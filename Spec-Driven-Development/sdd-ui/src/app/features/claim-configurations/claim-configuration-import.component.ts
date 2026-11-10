import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Workbook, type Worksheet } from 'exceljs';
import { API_BASE_URL } from '../../generated/api-client';
import { ApiProblemError } from '../../core/api-problem';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { NotificationService } from '../../shared/notifications/notification.service';

type ImportRow = Record<string, string | null>;
interface ImportRowStatus {
  rowNumber: number;
  key: string;
  isValid: boolean;
  alreadyExists: boolean;
  errors: string[];
}
interface ImportPreview {
  configurations: ImportRowStatus[];
  productLinks: ImportRowStatus[];
  errors: string[];
}
interface ImportResult {
  insertedConfigurations: number;
  skippedConfigurations: number;
  insertedLinks: number;
  skippedLinks: number;
}
interface WorkbookRows {
  configurations: ImportRow[];
  productLinks: ImportRow[];
}

const CONFIGURATION_COLUMNS = [
  ['CCM_CODE', 'ccmCode'],
  ['NAME', 'name'],
  ['SHORT_NAME', 'shortName'],
  ['NAME_L2', 'nameL2'],
  ['SHORT_NAME_L2', 'shortNameL2'],
  ['MODULE', 'module'],
  ['ACCOUNTING_POSTING_TYPE', 'accountingPostingType'],
  ['ACCOUNTING_EXCHANGE_RATE_TYPE', 'accountingExchangeRateType'],
  ['ROUNDING_TYPE', 'roundingType'],
  ['ROUNDING_VALUE', 'roundingValue'],
  ['APPLICABLE_CURRENCY_TYPE', 'applicableCurrencyType'],
  ['DEFAULT_ESTIMATED_CLOSURE_REASON_CODE', 'defaultEstimatedClosureReasonCode'],
  ['DEFAULT_RECOVERY_DEDUCTION_CODE', 'defaultRecoveryDeductionCode'],
  ['PRINT_BEFORE_APPROVAL', 'printBeforeApproval'],
  ['REPRINT', 'reprint'],
  ['CLAIM_ACCOUNTING_DOCUMENT_GENERATION', 'claimAccountingDocumentGeneration'],
  [
    'CLAIM_COINSURANCE_ACCOUNTING_DOCUMENT_GENERATION',
    'claimCoinsuranceAccountingDocumentGeneration',
  ],
  ['ACTIVE', 'active'],
] as const;
const PRODUCT_COLUMNS = [
  ['CCM_CODE', 'ccmCode'],
  ['PRODUCT_CODE', 'productCode'],
] as const;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 1000;

@Component({
  selector: 'app-claim-configuration-import',
  imports: [IconButtonComponent, MatButtonModule, MatProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './claim-configuration-import.component.html',
  styleUrl: './claim-configuration-import.component.css',
})
export class ClaimConfigurationImportComponent {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  protected readonly busy = signal(false);
  protected readonly fileName = signal('');
  protected readonly error = signal('');
  protected readonly preview = signal<ImportPreview | null>(null);
  protected readonly result = signal<ImportResult | null>(null);
  private workbookRows: WorkbookRows = { configurations: [], productLinks: [] };

  protected readonly configurationCount = computed(
    () => this.preview()?.configurations.length ?? 0,
  );
  protected readonly productLinkCount = computed(() => this.preview()?.productLinks.length ?? 0);
  protected readonly invalidCount = computed(() => {
    const preview = this.preview();
    return preview
      ? preview.configurations.filter((row) => !row.isValid).length +
          preview.productLinks.filter((row) => !row.isValid).length
      : 0;
  });
  protected readonly readyCount = computed(() => {
    const preview = this.preview();
    return preview
      ? preview.configurations.filter((row) => row.isValid && !row.alreadyExists).length +
          preview.productLinks.filter((row) => row.isValid && !row.alreadyExists).length
      : 0;
  });
  protected readonly skippedCount = computed(() => {
    const preview = this.preview();
    return preview
      ? preview.configurations.filter((row) => row.isValid && row.alreadyExists).length +
          preview.productLinks.filter((row) => row.isValid && row.alreadyExists).length
      : 0;
  });
  protected readonly canImport = computed(() => {
    const preview = this.preview();
    return (
      !!preview &&
      preview.errors.length === 0 &&
      this.invalidCount() === 0 &&
      this.readyCount() > 0 &&
      !this.busy()
    );
  });

  protected back(): void {
    void this.router.navigate(['/claim-configurations']);
  }

  protected async downloadTemplate(): Promise<void> {
    const workbook = new Workbook();
    const configurations = workbook.addWorksheet('CCM');
    configurations.addRow(CONFIGURATION_COLUMNS.map(([header]) => header));
    configurations.getRow(1).font = { bold: true };
    configurations.views = [{ state: 'frozen', ySplit: 1 }];
    const links = workbook.addWorksheet('PRODUCT_LINKS');
    links.addRow(PRODUCT_COLUMNS.map(([header]) => header));
    links.getRow(1).font = { bold: true };
    links.views = [{ state: 'frozen', ySplit: 1 }];

    const bytes = await workbook.xlsx.writeBuffer();
    const url = URL.createObjectURL(new Blob([bytes]));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'claim-configuration-template.xlsx';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  protected async selectFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.preview.set(null);
    this.result.set(null);
    this.error.set('');
    this.fileName.set(file?.name ?? '');
    this.workbookRows = { configurations: [], productLinks: [] };
    if (!file) return;
    if (!file.name.toLocaleLowerCase().endsWith('.xlsx')) {
      this.error.set('Choose an Excel workbook with the .xlsx file extension.');
      input.value = '';
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      this.error.set('Workbook must be 5 MB or smaller.');
      input.value = '';
      return;
    }

    this.busy.set(true);
    try {
      const workbook = new Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const ccmSheet = workbook.getWorksheet('CCM');
      const productSheet = workbook.getWorksheet('PRODUCT_LINKS');
      if (!ccmSheet) throw new Error('The workbook must contain a CCM worksheet.');
      const configurations = this.readSheet(ccmSheet, CONFIGURATION_COLUMNS, 'CCM');
      const productLinks = productSheet
        ? this.readSheet(productSheet, PRODUCT_COLUMNS, 'PRODUCT_LINKS')
        : [];
      if (configurations.length + productLinks.length > MAX_ROWS)
        throw new Error(
          `Workbook cannot contain more than ${MAX_ROWS} data rows across both sheets.`,
        );
      if (configurations.length + productLinks.length === 0)
        throw new Error('Workbook contains no data rows.');

      this.workbookRows = { configurations, productLinks };
      this.http
        .post<ImportPreview>(
          `${this.apiBaseUrl}/api/claim-configurations/import/preview`,
          this.workbookRows,
        )
        .subscribe({
          next: (preview) => {
            this.preview.set(preview);
            this.busy.set(false);
          },
          error: () => {
            this.error.set(
              'The workbook could not be checked. Check that the API is running and try again.',
            );
            this.busy.set(false);
          },
        });
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'The workbook could not be read.');
      this.busy.set(false);
    } finally {
      input.value = '';
    }
  }

  protected async importWorkbook(): Promise<void> {
    const confirmed = await this.notifications.confirm({
      title: 'Import claim configurations?',
      text: `${this.readyCount()} rows will be inserted and ${this.skippedCount()} existing rows will be skipped.`,
      confirmButtonText: 'Import',
      cancelButtonText: 'Cancel',
    });
    if (!confirmed) return;
    this.busy.set(true);
    this.http
      .post<ImportResult>(`${this.apiBaseUrl}/api/claim-configurations/import`, this.workbookRows)
      .subscribe({
        next: (result) => {
          this.result.set(result);
          this.preview.set(null);
          this.workbookRows = { configurations: [], productLinks: [] };
          this.busy.set(false);
        },
        error: (error: unknown) => {
          if (error instanceof ApiProblemError && error.problem.status === 400) {
            this.error.set(
              'The workbook changed or is no longer valid. Select it again to preview the latest data.',
            );
            this.preview.set(null);
            this.workbookRows = { configurations: [], productLinks: [] };
          } else {
            this.error.set('Import was not completed. Preview the workbook again before retrying.');
          }
          this.busy.set(false);
        },
      });
  }

  private readSheet<T extends readonly (readonly [string, string])[]>(
    sheet: Worksheet,
    columns: T,
    sheetName: string,
  ): ImportRow[] {
    const headers = sheet.getRow(1).values as (string | number | null | undefined)[];
    const indexes = columns.map(([header]) =>
      headers.findIndex(
        (value) =>
          String(value ?? '')
            .trim()
            .toUpperCase() === header,
      ),
    );
    if (indexes.some((index) => index < 1))
      throw new Error(
        `${sheetName} sheet is missing required headers: ${columns.map(([header]) => header).join(', ')}.`,
      );

    const rows: ImportRow[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = columns.map(
        ([, field], columnIndex) =>
          [field, String(row.getCell(indexes[columnIndex]).text ?? '').trim() || null] as const,
      );
      if (values.some(([, value]) => value !== null)) rows.push(Object.fromEntries(values));
    });
    return rows;
  }
}
