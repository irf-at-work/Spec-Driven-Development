import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Workbook } from 'exceljs';
import {
  VehicleModelOptionsClient,
  VehicleModelOptionsImportPreviewDto,
  VehicleModelOptionsImportRequestDto,
  VehicleModelOptionImportRowDto,
} from '../../generated/api-client';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { NotificationService } from '../../shared/notifications/notification.service';

const FILE_LIMIT_BYTES = 5 * 1024 * 1024;
const ROW_LIMIT = 1_000;
const HEADERS = ['LI_TYPE', 'LI_CODE', 'LI_DESC', 'LI_ACTIVE_YN'] as const;
const EXAMPLE_ROWS = [
  ['VEH_VARIANT', 'STD', 'Standard', 'Y'],
  ['VEH_TYPE', 'SEDAN', 'Sedan', 'Y'],
  ['VEH_BODY_TYPE', 'SUV', 'Sports Utility Vehicle', 'Y'],
  ['VEH_FUEL_TYPE', 'PETROL', 'Petrol', 'Y'],
  ['VEH_CYLINDER', '4', '4 Cylinders', 'Y'],
  ['VEH_DOORS', '4', '4 Doors', 'Y'],
  ['VEH_DRIVING_TYPE', 'AWD', 'All-Wheel Drive', 'Y'],
  ['VEH_BODY_COLOR', 'WHITE', 'White', 'Y'],
  ['VEH_CATEGORY', 'PRIVATE', 'Private', 'Y'],
];

@Component({
  selector: 'app-vehicle-model-options-import',
  imports: [IconButtonComponent, MatButtonModule, MatProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-model-options-import.component.html',
  styleUrl: './vehicle-model-options-import.component.css',
})
export class VehicleModelOptionsImportComponent {
  private readonly router = inject(Router);
  private readonly optionsClient = inject(VehicleModelOptionsClient);
  private readonly notifications = inject(NotificationService);

  protected readonly fileName = signal('');
  protected readonly errorMessage = signal('');
  protected readonly preview = signal<VehicleModelOptionsImportPreviewDto | null>(null);
  protected readonly loading = signal(false);
  protected readonly importing = signal(false);
  protected readonly resultMessage = signal('');
  protected readonly canImport = computed(() => {
    const current = this.preview();
    return (
      !!current &&
      current.errors.length === 0 &&
      current.rows.length > 0 &&
      current.rows.every((row) => row.isValid) &&
      current.rows.some((row) => !row.alreadyExists)
    );
  });
  protected readonly newRowCount = computed(
    () => this.preview()?.rows.filter((row) => row.isValid && !row.alreadyExists).length ?? 0,
  );
  protected readonly existingRowCount = computed(
    () => this.preview()?.rows.filter((row) => row.alreadyExists).length ?? 0,
  );

  protected back(): void {
    void this.router.navigate(['/vehicle-makes']);
  }

  protected async downloadTemplate(): Promise<void> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('STD_LIST_ITEM');
    worksheet.addRow([...HEADERS]);
    for (const row of EXAMPLE_ROWS) {
      worksheet.addRow(row);
    }
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.columns = [
      { width: 24, style: { numFmt: '@' } },
      { width: 18, style: { numFmt: '@' } },
      { width: 34 },
      { width: 20, style: { numFmt: '@' } },
    ];
    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vehicle-model-dropdown-template.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  }

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.preview.set(null);
    this.resultMessage.set('');
    this.errorMessage.set('');

    if (!file) {
      return;
    }
    this.fileName.set(file.name);
    input.value = '';
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.errorMessage.set('Choose an Excel .xlsx workbook.');
      return;
    }
    if (file.size > FILE_LIMIT_BYTES) {
      this.errorMessage.set('The workbook must be 5 MB or smaller.');
      return;
    }

    this.loading.set(true);
    try {
      const rows = await this.readWorkbook(file);
      if (rows.length === 0) {
        this.errorMessage.set('The worksheet has no data rows.');
        return;
      }
      if (rows.length > ROW_LIMIT) {
        this.errorMessage.set(`The workbook can contain no more than ${ROW_LIMIT} data rows.`);
        return;
      }

      const request: VehicleModelOptionsImportRequestDto = { rows };
      this.optionsClient.previewImport(request).subscribe({
        next: (result) => {
          this.preview.set(result);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('The workbook could not be checked. Please try again.');
          this.loading.set(false);
        },
      });
    } catch {
      this.errorMessage.set('The workbook could not be read. Check that it is a valid .xlsx file.');
      this.loading.set(false);
    }
  }

  protected async importRows(): Promise<void> {
    const current = this.preview();
    if (!current || !this.canImport()) {
      return;
    }

    const inserted = current.rows.filter((row) => !row.alreadyExists).length;
    const skipped = current.rows.length - inserted;
    const confirmed = await this.notifications.confirm({
      title: 'Import vehicle dropdown choices?',
      text: `${inserted} new rows will be inserted. ${skipped} existing rows will be skipped. Existing data will not be changed.`,
      confirmButtonText: 'Import rows',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) {
      return;
    }

    this.importing.set(true);
    const request: VehicleModelOptionsImportRequestDto = {
      rows: current.rows.map((row) => ({
        rowNumber: row.rowNumber,
        listType: row.listType,
        code: row.code,
        description: row.description,
        active: row.active,
      })),
    };
    this.optionsClient.import(request).subscribe({
      next: (result) => {
        this.importing.set(false);
        this.resultMessage.set(
          `Import complete: ${result.insertedCount} inserted, ${result.skippedExistingCount} existing rows skipped.`,
        );
        this.notifications.success('Vehicle dropdown choices imported.');
        this.optionsClient.previewImport(request).subscribe({
          next: (updatedPreview) => this.preview.set(updatedPreview),
        });
      },
      error: () => {
        this.importing.set(false);
        this.errorMessage.set(
          'The import could not be confirmed. The preview is being refreshed; check row statuses before retrying.',
        );
        this.optionsClient.previewImport(request).subscribe({
          next: (updatedPreview) => this.preview.set(updatedPreview),
        });
      },
    });
  }

  private async readWorkbook(file: File): Promise<VehicleModelOptionImportRowDto[]> {
    const workbook = new Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const worksheet = workbook.getWorksheet('STD_LIST_ITEM');
    if (!worksheet) {
      throw new Error('Required worksheet not found.');
    }

    const headerIndexes = new Map<string, number>();
    worksheet.getRow(1).eachCell((cell, columnNumber) => {
      headerIndexes.set(this.cellText(cell).trim().toUpperCase(), columnNumber);
    });
    const missing = HEADERS.filter((header) => !headerIndexes.has(header));
    if (missing.length > 0) {
      throw new Error(`Missing columns: ${missing.join(', ')}`);
    }

    const rows: VehicleModelOptionImportRowDto[] = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }
      const listType = this.cellText(row.getCell(headerIndexes.get('LI_TYPE')!));
      const code = this.cellText(row.getCell(headerIndexes.get('LI_CODE')!));
      const description = this.cellText(row.getCell(headerIndexes.get('LI_DESC')!));
      const active = this.cellText(row.getCell(headerIndexes.get('LI_ACTIVE_YN')!));
      if ([listType, code, description, active].some((value) => value.trim() !== '')) {
        rows.push({ rowNumber, listType, code, description, active });
      }
    });
    return rows;
  }

  private cellText(cell: import('exceljs').Cell): string {
    const value: unknown = cell.value;
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
      return value.text;
    }
    if (typeof value === 'object' && 'result' in value) {
      const result: unknown = value.result;
      return typeof result === 'string' || typeof result === 'number' ? String(result) : '';
    }
    return '';
  }
}
