import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicableModuleSummary } from '../../../api/generated/models/applicable-module-summary';
import { ApplicableModuleSortColumn } from '../../../api/generated/models/applicable-module-sort-column';
import { DocumentSetupRecord } from '../../../api/generated/models/document-setup-record';
import { DocumentSetupUpdate } from '../../../api/generated/models/document-setup-update';
import { CreationAuditDetails } from '../../codes-master/components/creation-audit-details';
import { PageNumberNavigation } from '../../../shared/page-number-navigation';
import {
  DocumentSetupForm,
  createDocumentSetupForm,
  toDocumentSetupWrite,
} from '../forms/document-setup-form';
import {
  DocumentSetupApiService,
  DocumentSetupPageSize,
} from '../services/document-setup-api.service';
import { DocumentSetupFeedbackService } from '../services/document-setup-feedback.service';
import { UnsavedChangesAware } from '../guards/unsaved-changes.guard';
import {
  DocumentSetupOptionsError,
  DocumentSetupOptionsService,
  formatCodeDescription,
} from '../services/document-setup-options.service';
import { CodeRecord } from '../../../api/generated/models/code-record';
import {
  CodeColumnFilterValue,
  CodeFilterColumn,
  ColumnFilterControl,
} from '../../codes-master/components/column-filter-control';
import { ListApplicableModules$Params } from '../../../api/generated/fn/operations/list-applicable-modules';

type ApplicableModuleFilterColumn = Extract<
  CodeFilterColumn,
  | 'applicableFor'
  | 'productFrom'
  | 'productTo'
  | 'pcmFrom'
  | 'pcmTo'
  | 'ccmFrom'
  | 'ccmTo'
  | 'mandatoryYn'
  | 'activeYn'
>;

@Component({
  selector: 'app-document-setup-edit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    CreationAuditDetails,
    ColumnFilterControl,
    PageNumberNavigation,
    ReactiveFormsModule,
    RouterLink,
  ],
  styleUrl: './document-setup-edit-page.css',
  templateUrl: './document-setup-edit-page.html',
})
export class DocumentSetupEditPage implements OnInit, UnsavedChangesAware {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(DocumentSetupApiService);
  private readonly feedback = inject(DocumentSetupFeedbackService);
  private readonly options = inject(DocumentSetupOptionsService);

  protected readonly docCode = this.route.snapshot.paramMap.get('docCode') ?? '';
  protected readonly form: DocumentSetupForm = createDocumentSetupForm();
  protected readonly loadedRecord = signal<DocumentSetupRecord | null>(null);
  protected readonly modules = signal<ApplicableModuleSummary[]>([]);
  protected readonly setupForCodes = signal<CodeRecord[]>([]);
  protected readonly applicableForCodes = signal<CodeRecord[]>([]);
  protected readonly productCodes = signal<CodeRecord[]>([]);
  protected readonly pcmCodes = signal<CodeRecord[]>([]);
  protected readonly ccmCodes = signal<CodeRecord[]>([]);
  protected readonly isLoadingSetupForCodes = signal(true);
  protected readonly setupForCodesError = signal('');
  protected readonly rangeCodesError = signal('');
  protected readonly columns = [
    'applicableFor',
    'productFrom',
    'productTo',
    'pcmFrom',
    'pcmTo',
    'ccmFrom',
    'ccmTo',
    'mandatoryYn',
    'activeYn',
    'actions',
  ];
  protected readonly page = signal(1);
  protected readonly pageSize = signal<DocumentSetupPageSize>(10);
  protected readonly sortActive = signal('applicableFor');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly moduleFilters = signal<
    Partial<Record<ApplicableModuleFilterColumn, CodeColumnFilterValue>>
  >({});
  protected readonly moduleFilterDrafts = signal<
    Partial<Record<ApplicableModuleFilterColumn, string>>
  >({});
  protected readonly totalCount = signal(0);
  protected readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  protected readonly isLoading = signal(true);
  protected readonly isLoadingModules = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly deletingUid = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly moduleErrorMessage = signal('');

  ngOnInit(): void {
    void this.loadSetupForCodes();
    void this.loadRangeCodes();
    if (this.docCode.length === 0) {
      this.errorMessage.set(
        'The document setup code is missing. Return to the listing and try again.',
      );
      this.isLoading.set(false);
      return;
    }

    void this.loadRecord();
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.isSaving() || this.deletingUid() !== null) {
      return false;
    }

    return this.form.pristine || this.feedback.confirmDiscardChanges();
  }

  protected leavePage(): void {
    void this.router.navigate(['/document-setups']);
  }

  protected toggleMore(): void {
    this.moreExpanded.update((expanded) => !expanded);
  }

  protected readonly moreExpanded = signal(false);

  protected resetForm(): void {
    const record = this.loadedRecord();
    if (!record) {
      return;
    }

    this.form.reset({
      docCode: record.docCode,
      docName: record.docName ?? '',
      docDescription: record.docDescription ?? '',
      docSetupFor: record.docSetupFor ?? '',
      flex1: record.flex1 ?? '',
      flex2: record.flex2 ?? '',
      nameInArabic: record.nameInArabic ?? '',
      descriptionInArabic: record.descriptionInArabic ?? '',
      activeYn: record.activeYn !== 'N',
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorMessage.set('');
  }

  protected async save(): Promise<void> {
    const record = this.loadedRecord();
    if (this.isSaving() || !record || this.isLoadingSetupForCodes() || this.setupForCodesError()) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const requiredFields = [
        ['docCode', 'Doc Code'],
        ['docSetupFor', 'Doc Setup For'],
      ] as const;
      this.feedback.showRequiredFieldsValidation(
        requiredFields
          .filter(([field]) => this.form.controls[field].hasError('required'))
          .map(([, label]) => label),
      );
      return;
    }
    if (!this.setupForCodes().some((code) => code.code === this.form.controls.docSetupFor.value)) {
      this.errorMessage.set('Select a Doc Setup For code from Codes Master.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    try {
      const body: DocumentSetupUpdate = {
        ...toDocumentSetupWrite(this.form),
        docCode: record.docCode,
        expectedVersion: record.version,
      };
      const updated = await this.api.update(this.docCode, body);
      this.loadedRecord.set(updated);
      this.resetForm();
      this.feedback.showSuccess('Document setup updated successfully.');
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.errorMessage.set(
        error.status === 409
          ? 'This document setup changed after it was loaded. Reload the page before saving.'
          : error.status === 404
            ? 'The document setup no longer exists. Return to the listing and reload.'
            : error.status === 400
              ? 'Please correct the highlighted fields.'
              : 'The document setup could not be saved. Please try again.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async loadModules(page: number, pageSize = this.pageSize()): Promise<void> {
    this.isLoadingModules.set(true);
    this.moduleErrorMessage.set('');
    try {
      const sortBy = this.toModuleSortColumn(this.sortActive());
      if (sortBy === null) {
        throw new RangeError(`Unsupported Applicable Module sort column: ${this.sortActive()}.`);
      }

      const result = await this.api.listApplicableModules(
        this.docCode,
        page,
        pageSize,
        sortBy,
        this.sortDirection() === 'desc' ? 'Descending' : 'Ascending',
        this.toModuleFilterParams(),
      );
      this.modules.set(result.items);
      this.page.set(result.page);
      if (this.isPageSize(result.pageSize)) {
        this.pageSize.set(result.pageSize);
      }
      this.totalCount.set(result.totalCount);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.modules.set([]);
      this.totalCount.set(0);
      this.moduleErrorMessage.set('Applicable Modules could not be loaded. Please try again.');
    } finally {
      this.isLoadingModules.set(false);
    }
  }

  protected async loadSetupForCodes(): Promise<void> {
    this.isLoadingSetupForCodes.set(true);
    this.setupForCodesError.set('');
    try {
      this.setupForCodes.set(await this.options.listDocSetupForCodes());
      if (this.setupForCodes().length === 0) {
        this.setupForCodesError.set('No DOC_SETUP_FOR codes were found in Codes Master.');
      }
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse) && !(error instanceof DocumentSetupOptionsError)) {
        throw error;
      }
      this.setupForCodesError.set('Doc Setup For codes could not be loaded. Please try again.');
    } finally {
      this.isLoadingSetupForCodes.set(false);
    }
  }

  protected onModulePageNumberChange(page: number): void {
    void this.loadModules(page);
  }

  protected onModulesSortChange(sort: Sort): void {
    if (
      this.toModuleSortColumn(sort.active) === null ||
      (sort.direction !== 'asc' && sort.direction !== 'desc')
    ) {
      return;
    }

    this.sortActive.set(sort.active);
    this.sortDirection.set(sort.direction);
    void this.loadModules(1);
  }

  protected moduleFilter(column: ApplicableModuleFilterColumn): CodeColumnFilterValue | null {
    return this.moduleFilters()[column] ?? null;
  }

  protected moduleFilterDraft(column: ApplicableModuleFilterColumn): string {
    return this.moduleFilterDrafts()[column] ?? '';
  }

  protected onModuleFilterChange(
    column: ApplicableModuleFilterColumn,
    filter: CodeColumnFilterValue | null,
  ): void {
    this.moduleFilters.update((filters) => {
      const updated = { ...filters };
      if (filter === null) {
        delete updated[column];
      } else {
        updated[column] = filter;
      }
      return updated;
    });
    if (filter === null) {
      this.moduleFilterDrafts.update((drafts) => ({ ...drafts, [column]: '' }));
    }

    void this.loadModules(1);
  }

  protected onModuleFilterDraftChange(column: ApplicableModuleFilterColumn, value: string): void {
    this.moduleFilterDrafts.update((drafts) => ({ ...drafts, [column]: value }));
  }

  protected clearModuleFilters(): void {
    if (
      Object.keys(this.moduleFilters()).length === 0 &&
      Object.values(this.moduleFilterDrafts()).every((value) => !value)
    ) {
      return;
    }

    this.moduleFilters.set({});
    this.moduleFilterDrafts.set({});
    void this.loadModules(1);
  }

  protected hasModuleFilters(): boolean {
    return Object.keys(this.moduleFilters()).length > 0;
  }

  private toModuleFilterParams(): Partial<
    Omit<ListApplicableModules$Params, 'docCode' | 'page' | 'pageSize'>
  > {
    const filters = this.moduleFilters();
    return {
      applicableForOperator: filters.applicableFor?.operator,
      applicableForValue: filters.applicableFor?.value,
      productFromOperator: filters.productFrom?.operator,
      productFromValue: filters.productFrom?.value,
      productToOperator: filters.productTo?.operator,
      productToValue: filters.productTo?.value,
      pcmFromOperator: filters.pcmFrom?.operator,
      pcmFromValue: filters.pcmFrom?.value,
      pcmToOperator: filters.pcmTo?.operator,
      pcmToValue: filters.pcmTo?.value,
      ccmFromOperator: filters.ccmFrom?.operator,
      ccmFromValue: filters.ccmFrom?.value,
      ccmToOperator: filters.ccmTo?.operator,
      ccmToValue: filters.ccmTo?.value,
      mandatoryYnOperator: filters.mandatoryYn?.operator,
      mandatoryYnValue: filters.mandatoryYn?.value,
      activeYnOperator: filters.activeYn?.operator,
      activeYnValue: filters.activeYn?.value,
    };
  }

  private toModuleSortColumn(active: string): ApplicableModuleSortColumn | null {
    const columns: Record<string, ApplicableModuleSortColumn> = {
      applicableFor: 'ApplicableFor',
      productFrom: 'ProductFrom',
      productTo: 'ProductTo',
      pcmFrom: 'PcmFrom',
      pcmTo: 'PcmTo',
      ccmFrom: 'CcmFrom',
      ccmTo: 'CcmTo',
      mandatoryYn: 'MandatoryYn',
      activeYn: 'ActiveYn',
    };

    return columns[active] ?? null;
  }

  protected addModule(): void {
    void this.router.navigate(['/document-setups', this.docCode, 'applicable-modules', 'add']);
  }

  protected editModule(module: ApplicableModuleSummary): void {
    void this.router.navigate([
      '/document-setups',
      this.docCode,
      'applicable-modules',
      module.damodUid,
      'edit',
    ]);
  }

  protected async deleteModule(module: ApplicableModuleSummary): Promise<void> {
    if (this.deletingUid() !== null) {
      return;
    }

    if (!(await this.feedback.confirmDeleteApplicableModule(module.damodUid))) {
      return;
    }

    this.deletingUid.set(module.damodUid);
    this.moduleErrorMessage.set('');
    try {
      await this.api.deleteApplicableModule(this.docCode, module.damodUid, module.version);
      this.feedback.showSuccess('Applicable Module deleted successfully.');
      await this.loadModules(this.page());
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.moduleErrorMessage.set(
        error.status === 409
          ? 'This Applicable Module changed after it was loaded. Reload the page before deleting.'
          : 'The Applicable Module could not be deleted. Please reload and try again.',
      );
    } finally {
      this.deletingUid.set(null);
    }
  }

  protected setupForLabel(value: string | null | undefined): string {
    switch (value) {
      case '101':
        return 'File Upload';
      case '102':
        return 'Doc Print';
      default:
        return value ?? '';
    }
  }

  protected rangeValue(
    module: ApplicableModuleSummary,
    value: string | null | undefined,
    codeType: 'PRODUCT' | 'PCM' | 'CCM',
  ): string {
    const codes =
      codeType === 'PRODUCT'
        ? this.productCodes()
        : codeType === 'PCM'
          ? this.pcmCodes()
          : this.ccmCodes();
    return formatCodeDescription(value, codes);
  }

  private async loadRecord(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const record = await this.api.get(this.docCode);
      this.loadedRecord.set(record);
      this.resetForm();
      await this.loadModules(1);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }
      this.errorMessage.set(
        error.status === 404
          ? 'The document setup was not found. Return to the listing and reload.'
          : 'The document setup could not be loaded. Please try again.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadRangeCodes(): Promise<void> {
    this.rangeCodesError.set('');
    try {
      const [applicableFor, products, pcm, ccm] = await Promise.all([
        this.options.listApplicableForCodes(),
        this.options.listProductCodes(),
        this.options.listPcmCodes(),
        this.options.listCcmCodes(),
      ]);
      this.applicableForCodes.set(applicableFor);
      this.productCodes.set(products);
      this.pcmCodes.set(pcm);
      this.ccmCodes.set(ccm);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse) && !(error instanceof DocumentSetupOptionsError)) {
        throw error;
      }
      this.rangeCodesError.set('Applicable range codes could not be loaded.');
    }
  }

  private isPageSize(value: number): value is DocumentSetupPageSize {
    return value === 10 || value === 15 || value === 20 || value === 50;
  }
}
