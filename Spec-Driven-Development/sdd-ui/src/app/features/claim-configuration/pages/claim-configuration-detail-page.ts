import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  CodeColumnFilterValue,
  CodeFilterColumn,
  ColumnFilterControl,
} from '../../codes-master/components/column-filter-control';
import { ClaimConfigurationRecord } from '../../../api/generated/models/claim-configuration-record';
import { ClaimConfigurationLookupOption } from '../../../api/generated/models/claim-configuration-lookup-option';
import { ApplicableProductSummary } from '../../../api/generated/models/applicable-product-summary';
import { ApplicableProductDialog } from '../components/applicable-product-dialog';
import {
  ClaimConfigurationField,
  ClaimConfigurationFormGroup,
  YesNoValue,
  claimConfigurationFields,
  createClaimConfigurationForm,
  toClaimConfigurationWrite,
} from '../forms/claim-configuration-form';
import { ClaimConfigurationApiService } from '../services/claim-configuration-api.service';
import {
  claimConfigurationFieldErrors,
  claimConfigurationProblemDetail,
} from '../services/claim-configuration-api-errors';
import { ClaimConfigurationFeedbackService } from '../services/claim-configuration-feedback.service';
import {
  ClaimConfigurationLookupType,
  ClaimConfigurationOptionsService,
  claimConfigurationLookupTypes,
} from '../services/claim-configuration-options.service';

type LookupOptions = Record<ClaimConfigurationLookupType, ClaimConfigurationLookupOption[]>;
type ProductFilterColumn = Extract<CodeFilterColumn, 'productCode' | 'productName'>;

@Component({
  selector: 'app-claim-configuration-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterLink,
    ColumnFilterControl,
  ],
  styleUrl: './claim-configuration-detail-page.css',
  templateUrl: './claim-configuration-detail-page.html',
})
export class ClaimConfigurationDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ClaimConfigurationApiService);
  private readonly optionsService = inject(ClaimConfigurationOptionsService);
  private readonly feedback = inject(ClaimConfigurationFeedbackService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form: ClaimConfigurationFormGroup = createClaimConfigurationForm();
  protected readonly ccmCode = signal<string | null>(null);
  protected readonly record = signal<ClaimConfigurationRecord | null>(null);
  protected readonly isEditMode = computed(() => this.ccmCode() !== null);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly isLoadingLookups = signal(true);
  protected readonly lookupsError = signal('');
  protected readonly errorMessage = signal('');
  protected readonly serverErrors = signal<Partial<Record<ClaimConfigurationField, string[]>>>({});
  protected readonly moreExpanded = signal(false);
  protected readonly lookups = signal<LookupOptions>({
    CCM_MODULE: [],
    CCM_POST_TYPE: [],
    CCM_EXCH_RATE: [],
    CCM_ROUND_TYPE: [],
    CCM_CURR_TYPE: [],
    CCM_CLO_REASON: [],
    CCM_DFLT_RECV_DEDU: [],
  });
  protected readonly products = signal<ApplicableProductSummary[]>([]);
  protected readonly productFilters =
    signal<Partial<Record<ProductFilterColumn, CodeColumnFilterValue>>>({});
  protected readonly productFilterDraftValues = signal<Partial<Record<ProductFilterColumn, string>>>(
    {},
  );
  protected readonly hasProductFilters = computed(() => Object.keys(this.productFilters()).length > 0);
  protected readonly filteredProducts = computed(() => {
    const filters = this.productFilters();
    return this.products().filter(
      (product) =>
        this.matchesProductFilter(product.productCode, filters.productCode) &&
        this.matchesProductFilter(product.productName ?? '', filters.productName),
    );
  });
  protected readonly productsLoading = signal(false);
  protected readonly productsError = signal('');
  protected readonly productMutationInProgress = signal(false);
  protected readonly productColumns = ['productCode', 'productName', 'actions'];
  private initialFormValue = this.form.getRawValue();
  private originalVersion = '';

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.clearServerErrors();
        this.errorMessage.set('');
      });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const code = params.get('ccmCode');
      this.ccmCode.set(code);
      void this.initialize(code);
    });
  }

  protected async initialize(code: string | null): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.products.set([]);
    this.productFilters.set({});
    this.productFilterDraftValues.set({});
    try {
      await this.loadLookups();
      if (code !== null) {
        const record = await this.api.get(code);
        this.record.set(record);
        this.originalVersion = record.version;
        this.preserveSavedLookupOptions(record);
        this.form.reset(this.formValueFor(record));
        this.initialFormValue = this.form.getRawValue();
        await this.loadProducts();
      } else {
        this.record.set(null);
        this.originalVersion = '';
        this.form.reset(createClaimConfigurationForm().getRawValue());
        this.initialFormValue = this.form.getRawValue();
      }
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.errorMessage.set(
        error.status === 404
          ? 'The claim configuration was not found.'
          : 'The claim configuration could not be loaded. Please try again.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async loadLookups(): Promise<void> {
    this.isLoadingLookups.set(true);
    this.lookupsError.set('');
    try {
      const values = await Promise.all(
        claimConfigurationLookupTypes.map(async (type) => [type, await this.optionsService.get(type)] as const),
      );
      this.lookups.set(Object.fromEntries(values) as LookupOptions);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.lookupsError.set('Claim configuration choices could not be loaded. Please try again.');
      throw error;
    } finally {
      this.isLoadingLookups.set(false);
    }
  }

  protected async retryLoadLookups(): Promise<void> {
    try {
      await this.initialize(this.ccmCode());
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }
    }
  }

  protected resetForm(): void {
    this.form.reset(this.initialFormValue);
    this.clearServerErrors();
    this.moreExpanded.set(false);
    this.errorMessage.set('');
  }

  protected fieldError(field: ClaimConfigurationField): string | null {
    const serverError = this.serverErrors()[field]?.[0];
    if (serverError) {
      return serverError;
    }

    const control = this.form.controls[field];
    if (!control.touched) {
      return null;
    }

    if (control.hasError('required')) {
      return `${this.fieldLabel(field)} is required.`;
    }
    if (control.hasError('maxlength')) {
      return field === 'ccmCode'
        ? 'Claim Config Code cannot exceed 12 characters.'
        : field === 'ccmName'
          ? 'Claim Config Name cannot exceed 100 characters.'
          : field === 'ccmShortName'
            ? 'Short Name cannot exceed 30 characters.'
            : `${this.fieldLabel(field)} exceeds the maximum length.`;
    }
    if (control.hasError('roundingValueRange')) {
      return 'Rounding Value must fit NUMBER(8,5), from -999.99999 to 999.99999.';
    }
    if (control.hasError('roundingValuePrecision')) {
      return 'Rounding Value cannot have more than 5 decimal places.';
    }

    return null;
  }

  private fieldLabel(field: ClaimConfigurationField): string {
    const labels: Record<ClaimConfigurationField, string> = {
      ccmCode: 'Claim Config Code',
      ccmName: 'Claim Config Name',
      ccmShortName: 'Short Name',
      nameInArabic: 'Name in Arabic',
      shortNameInArabic: 'Short Name in Arabic',
      module: 'Module Name',
      postingType: 'Posting Type',
      exchangeRateType: 'Exchange Rate Type',
      roundingType: 'Rounding Type',
      roundingValue: 'Rounding Value',
      applicableCurrencies: 'Applicable Currencies',
      defaultEstimateCloseReasonCode: 'Dflt Estimate Close Reason',
      defaultRecoveryCodeForDedl: 'Dflt Recovery Code for Dedl',
      printBeforeApprovalYn: 'Print Before Approval Y/N',
      rePrintAllowedYn: 'RePrint Allowed Y/N',
      claimAccountDocumentGenerationYn: 'Claim A/c Doc Gen Y/N',
      sharingClaimsAccountDocumentGenerationYn: 'Sharing Clms A/c Doc Gen Y/N',
      activeYn: 'Active Y/N',
    };
    return labels[field];
  }

  protected setToggle(field: keyof Pick<
    ClaimConfigurationFormGroup['controls'],
    | 'printBeforeApprovalYn'
    | 'rePrintAllowedYn'
    | 'claimAccountDocumentGenerationYn'
    | 'sharingClaimsAccountDocumentGenerationYn'
    | 'activeYn'
  >, checked: boolean): void {
    this.form.controls[field].setValue(checked ? 'Y' : 'N' as YesNoValue);
  }

  protected toggleMore(): void {
    this.moreExpanded.update((expanded) => !expanded);
  }

  protected lookupOptions(
    type: ClaimConfigurationLookupType,
    selectedValue: string,
  ): ClaimConfigurationLookupOption[] {
    const options = this.lookups()[type];
    if (selectedValue && !options.some((option) => option.code === selectedValue)) {
      return [...options, { code: selectedValue, description: 'Saved inactive value' }];
    }

    return options;
  }

  protected async save(): Promise<void> {
    if (this.isSubmitting() || this.isLoadingLookups() || this.lookupsError()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.controls.nameInArabic.invalid || this.form.controls.shortNameInArabic.invalid) {
        this.moreExpanded.set(true);
      }
      this.feedback.showError('Please correct the highlighted fields before saving.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.clearServerErrors();
    try {
      const body = toClaimConfigurationWrite(this.form);
      if (this.ccmCode() === null) {
        const created = await this.api.create(body);
        this.feedback.showSuccess('Claim configuration created successfully.');
        await this.router.navigate(['/claim-configurations', created.ccmCode, 'edit'], {
          replaceUrl: true,
        });
      } else {
        const update = { ...body, expectedVersion: this.originalVersion };
        const updated = await this.api.update(this.ccmCode()!, update);
        this.record.set(updated);
        this.originalVersion = updated.version;
        this.initialFormValue = this.form.getRawValue();
        this.feedback.showSuccess('Claim configuration updated successfully.');
      }
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      const fieldErrors = claimConfigurationFieldErrors(error);
      this.serverErrors.set(fieldErrors);
      for (const field of claimConfigurationFields) {
        if (fieldErrors[field]) {
          this.form.controls[field].setErrors({
            ...this.form.controls[field].errors,
            server: true,
          });
        }
      }
      if (
        fieldErrors.nameInArabic ||
        fieldErrors.shortNameInArabic ||
        fieldErrors.activeYn
      ) {
        this.moreExpanded.set(true);
      }
      this.errorMessage.set(this.parentErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async loadProducts(): Promise<void> {
    const code = this.ccmCode();
    if (code === null) {
      return;
    }

    this.productsLoading.set(true);
    this.productsError.set('');
    try {
      this.products.set(await this.api.products(code));
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.productsError.set('Applicable Products could not be loaded. Please try again.');
    } finally {
      this.productsLoading.set(false);
    }
  }

  protected onProductFilterChange(
    column: ProductFilterColumn,
    filter: CodeColumnFilterValue | null,
  ): void {
    this.productFilters.update((currentFilters) => {
      const nextFilters = { ...currentFilters };
      if (filter === null) {
        delete nextFilters[column];
      } else {
        nextFilters[column] = filter;
      }

      return nextFilters;
    });
  }

  protected onProductFilterDraftChange(column: ProductFilterColumn, value: string): void {
    this.productFilterDraftValues.update((currentValues) => ({
      ...currentValues,
      [column]: value,
    }));
  }

  protected clearProductFilters(): void {
    this.productFilters.set({});
    this.productFilterDraftValues.set({});
  }

  protected async addProduct(): Promise<void> {
    const code = this.ccmCode();
    if (code === null || this.productMutationInProgress()) {
      return;
    }

    const dialogRef = this.dialog.open(ApplicableProductDialog, {
      data: { existingProductCodes: this.products().map((product) => product.productCode) },
      ariaLabel: 'Add Applicable Product',
    });
    const productCode = await firstValueFrom(dialogRef.afterClosed());
    if (productCode === undefined) {
      return;
    }

    if (this.products().some((product) => product.productCode === productCode)) {
      this.feedback.showError('This Product Code is already mapped to the claim configuration.');
      return;
    }

    this.productMutationInProgress.set(true);
    try {
      await this.api.createProduct(code, { productCode });
      this.feedback.showSuccess('Applicable Product added successfully.');
      await this.loadProducts();
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.feedback.showError(
        error.status === 409
          ? 'This Product Code is already mapped to the claim configuration.'
          : 'Applicable Product could not be added. Please try again.',
      );
    } finally {
      this.productMutationInProgress.set(false);
    }
  }

  protected async editProduct(product: ApplicableProductSummary): Promise<void> {
    const code = this.ccmCode();
    if (code === null || this.productMutationInProgress()) {
      return;
    }

    this.productMutationInProgress.set(true);
    try {
      const current = await this.api.getProduct(code, product.productCode);
      const dialogRef = this.dialog.open(ApplicableProductDialog, {
        data: {
          existingProductCodes: this.products()
            .map((item) => item.productCode)
            .filter((productCode) => productCode !== product.productCode),
          selectedProductCode: product.productCode,
        },
        ariaLabel: 'Edit Applicable Product',
      });
      const nextProductCode = await firstValueFrom(dialogRef.afterClosed());
      if (nextProductCode === undefined || nextProductCode === product.productCode) {
        return;
      }

      await this.api.updateProduct(code, product.productCode, {
        productCode: nextProductCode,
        expectedVersion: current.version,
      });
      this.feedback.showSuccess('Applicable Product updated successfully.');
      await this.loadProducts();
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.feedback.showError(
        error.status === 409
          ? 'This Applicable Product changed or the selected Product Code is already mapped. Reload and try again.'
          : error.status === 404
            ? 'The Applicable Product no longer exists.'
            : 'Applicable Product could not be updated. Please try again.',
      );
      await this.loadProducts();
    } finally {
      this.productMutationInProgress.set(false);
    }
  }

  protected async deleteProduct(product: ApplicableProductSummary): Promise<void> {
    const code = this.ccmCode();
    if (
      code === null ||
      this.productMutationInProgress() ||
      !(await this.feedback.confirmDeleteProduct(code, product.productCode))
    ) {
      return;
    }

    this.productMutationInProgress.set(true);
    try {
      await this.api.deleteProduct(code, product.productCode);
      this.feedback.showSuccess('Applicable Product deleted successfully.');
      await this.loadProducts();
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.feedback.showError(
        error.status === 404
          ? 'The Applicable Product no longer exists.'
          : 'Applicable Product could not be deleted. Please try again.',
      );
      await this.loadProducts();
    } finally {
      this.productMutationInProgress.set(false);
    }
  }

  protected async leavePage(): Promise<void> {
    await this.router.navigate(['/claim-configurations']);
  }

  private formValueFor(record: ClaimConfigurationRecord): ClaimConfigurationFormGroup['value'] {
    return {
      ccmCode: record.ccmCode,
      ccmName: record.ccmName,
      ccmShortName: record.ccmShortName ?? '',
      nameInArabic: record.nameInArabic ?? '',
      shortNameInArabic: record.shortNameInArabic ?? '',
      module: record.module ?? '',
      postingType: record.postingType ?? '',
      exchangeRateType: record.exchangeRateType ?? '',
      roundingType: record.roundingType ?? '',
      roundingValue: record.roundingValue ?? null,
      applicableCurrencies: record.applicableCurrencies ?? '',
      defaultEstimateCloseReasonCode: record.defaultEstimateCloseReasonCode ?? '',
      defaultRecoveryCodeForDedl: record.defaultRecoveryCodeForDedl ?? '',
      printBeforeApprovalYn: this.toYesNo(record.printBeforeApprovalYn),
      rePrintAllowedYn: this.toYesNo(record.rePrintAllowedYn),
      claimAccountDocumentGenerationYn: this.toYesNo(record.claimAccountDocumentGenerationYn),
      sharingClaimsAccountDocumentGenerationYn: this.toYesNo(record.sharingClaimsAccountDocumentGenerationYn),
      activeYn: this.toYesNo(record.activeYn, 'Y'),
    };
  }

  private preserveSavedLookupOptions(record: ClaimConfigurationRecord): void {
    this.lookups.update((current) => ({
      ...current,
      CCM_MODULE: this.withSavedValue(current.CCM_MODULE, record.module, record.moduleDescription),
      CCM_POST_TYPE: this.withSavedValue(current.CCM_POST_TYPE, record.postingType, record.postingTypeDescription),
      CCM_EXCH_RATE: this.withSavedValue(
        current.CCM_EXCH_RATE,
        record.exchangeRateType,
        record.exchangeRateTypeDescription,
      ),
      CCM_ROUND_TYPE: this.withSavedValue(
        current.CCM_ROUND_TYPE,
        record.roundingType,
        record.roundingTypeDescription,
      ),
      CCM_CURR_TYPE: this.withSavedValue(
        current.CCM_CURR_TYPE,
        record.applicableCurrencies,
        record.applicableCurrenciesDescription,
      ),
      CCM_CLO_REASON: this.withSavedValue(
        current.CCM_CLO_REASON,
        record.defaultEstimateCloseReasonCode,
        record.defaultEstimateCloseReasonDescription,
      ),
      CCM_DFLT_RECV_DEDU: this.withSavedValue(
        current.CCM_DFLT_RECV_DEDU,
        record.defaultRecoveryCodeForDedl,
        record.defaultRecoveryCodeForDedlDescription,
      ),
    }));
  }

  private withSavedValue(
    options: ClaimConfigurationLookupOption[],
    value: string | null | undefined,
    description: string | null | undefined,
  ): ClaimConfigurationLookupOption[] {
    if (!value || options.some((option) => option.code === value)) {
      return options;
    }

    return [...options, { code: value, description: description ?? 'Saved inactive value' }];
  }

  private matchesProductFilter(
    value: string,
    filter: CodeColumnFilterValue | undefined,
  ): boolean {
    if (!filter) {
      return true;
    }

    const actual = value.toLocaleUpperCase();
    const expected = filter.value.toLocaleUpperCase();
    switch (filter.operator) {
      case 'StartsWith':
        return actual.startsWith(expected);
      case 'EndsWith':
        return actual.endsWith(expected);
      case 'Contains':
        return actual.includes(expected);
      case 'DoesNotContain':
        return !actual.includes(expected);
      case 'EqualTo':
        return actual === expected;
      case 'NotEqualTo':
        return actual !== expected;
    }
  }

  private toYesNo(value: string | null | undefined, defaultValue: YesNoValue = 'N'): YesNoValue {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    if (value === 'Y' || value === 'N') {
      return value;
    }
    throw new Error('The saved toggle value must be Y or N.');
  }

  private parentErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 409) {
      return error.error?.code === 'CCM_VERSION_CONFLICT'
        ? 'This claim configuration changed since it was loaded. Reload it before saving your changes.'
        : 'A claim configuration with this code already exists.';
    }
    if (error.status === 400) {
      return Object.keys(claimConfigurationFieldErrors(error)).length > 0
        ? 'Please correct the highlighted fields.'
        : claimConfigurationProblemDetail(error) ??
            'The submitted values were rejected. Review the form and try again.';
    }
    return 'The claim configuration could not be saved. Please try again.';
  }

  private clearServerErrors(): void {
    for (const field of claimConfigurationFields) {
      const control = this.form.controls[field];
      if (control.hasError('server')) {
        const remainingErrors = { ...control.errors };
        delete remainingErrors['server'];
        control.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
      }
    }
    this.serverErrors.set({});
  }
}
