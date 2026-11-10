import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClaimConfigurationLookupOption } from '../../../api/generated/models/claim-configuration-lookup-option';
import { ClaimConfigurationOptionsService } from '../services/claim-configuration-options.service';

export interface ApplicableProductDialogData {
  existingProductCodes: string[];
  selectedProductCode?: string;
}

@Component({
  selector: 'app-applicable-product-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  styleUrl: './applicable-product-dialog.css',
  templateUrl: './applicable-product-dialog.html',
})
export class ApplicableProductDialog {
  private readonly dialogRef = inject(MatDialogRef<ApplicableProductDialog, string | undefined>);
  private readonly optionsService = inject(ClaimConfigurationOptionsService);
  protected readonly data = inject<ApplicableProductDialogData>(MAT_DIALOG_DATA);

  protected readonly productCode = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly options = signal<ClaimConfigurationLookupOption[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    if (this.data.selectedProductCode) {
      this.productCode.setValue(this.data.selectedProductCode);
    }
    void this.loadOptions();
  }

  protected async loadOptions(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const options = await this.optionsService.get('CCM_PRODUCT');
      const selectedCode = this.data.selectedProductCode;
      this.options.set(
        selectedCode && !options.some((option) => option.code === selectedCode)
          ? [...options, { code: selectedCode, description: 'Saved inactive value' }]
          : options,
      );
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.errorMessage.set('Product codes could not be loaded. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected save(): void {
    if (this.isLoading() || this.isSaving()) {
      return;
    }

    this.productCode.markAsTouched();
    if (this.productCode.invalid) {
      return;
    }

    const selectedCode = this.productCode.value;
    if (this.data.existingProductCodes.includes(selectedCode)) {
      this.errorMessage.set('This Product Code is already mapped to the claim configuration.');
      return;
    }

    this.isSaving.set(true);
    this.dialogRef.close(selectedCode);
  }

  protected reset(): void {
    this.productCode.reset('');
    this.errorMessage.set('');
  }

}
