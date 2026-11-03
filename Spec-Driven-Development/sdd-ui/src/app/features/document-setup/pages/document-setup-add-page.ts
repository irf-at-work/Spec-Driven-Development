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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import {
  CodeColumnFilterValue,
  CodeFilterColumn,
  ColumnFilterControl,
} from '../../codes-master/components/column-filter-control';
import { DocumentSetupApiService } from '../services/document-setup-api.service';
import { DocumentSetupFeedbackService } from '../services/document-setup-feedback.service';
import { DocumentSetupAddDraftService } from '../services/document-setup-add-draft.service';
import { UnsavedChangesAware } from '../guards/unsaved-changes.guard';
import { createDocumentSetupForm, toDocumentSetupWrite } from '../forms/document-setup-form';
import { CodesFeedbackService } from '../../codes-master/services/codes-feedback.service';
import {
  DocumentSetupOptionsError,
  DocumentSetupOptionsService,
  formatCodeDescription,
} from '../services/document-setup-options.service';
import { CodeRecord } from '../../../api/generated/models/code-record';

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
  selector: 'app-document-setup-add-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ColumnFilterControl,
    ReactiveFormsModule,
    RouterLink,
  ],
  styleUrl: './document-setup-add-page.css',
  templateUrl: './document-setup-add-page.html',
})
export class DocumentSetupAddPage implements OnInit, UnsavedChangesAware {
  private readonly documentSetupApi = inject(DocumentSetupApiService);
  private readonly feedback = inject(CodesFeedbackService);
  private readonly documentSetupFeedback = inject(DocumentSetupFeedbackService);
  private readonly addDraft = inject(DocumentSetupAddDraftService);
  private readonly options = inject(DocumentSetupOptionsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly moreExpanded = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly form = createDocumentSetupForm();
  protected readonly setupForCodes = signal<CodeRecord[]>([]);
  protected readonly applicableForCodes = signal<CodeRecord[]>([]);
  protected readonly productCodes = signal<CodeRecord[]>([]);
  protected readonly pcmCodes = signal<CodeRecord[]>([]);
  protected readonly ccmCodes = signal<CodeRecord[]>([]);
  protected readonly isLoadingSetupForCodes = signal(true);
  protected readonly setupForCodesError = signal('');
  protected readonly rangeCodesError = signal('');
  protected readonly moduleFilters = signal<
    Partial<Record<ApplicableModuleFilterColumn, CodeColumnFilterValue>>
  >({});
  protected readonly moduleFilterDrafts = signal<
    Partial<Record<ApplicableModuleFilterColumn, string>>
  >({});
  protected readonly moduleFilterColumns = [
    { key: 'applicableFor', label: 'Applicable For' },
    { key: 'productFrom', label: 'Product From' },
    { key: 'productTo', label: 'Product To' },
    { key: 'pcmFrom', label: 'PCM From' },
    { key: 'pcmTo', label: 'PCM To' },
    { key: 'ccmFrom', label: 'CCM From' },
    { key: 'ccmTo', label: 'CCM To' },
  ] as const;
  protected readonly pendingModules = this.addDraft.modules;
  protected readonly savedModules = this.addDraft.savedModules;
  protected readonly createdParent = this.addDraft.parentRecord;
  protected readonly listedModules = computed(() => [
    ...this.savedModules().map((module) => ({
      applicableFor: module.applicableFor,
      productFrom: module.productFrom,
      productTo: module.productTo,
      pcmFrom: module.pcmFrom,
      pcmTo: module.pcmTo,
      ccmFrom: module.ccmFrom,
      ccmTo: module.ccmTo,
      mandatoryYn: module.mandatoryYn,
      activeYn: module.activeYn,
      persisted: true,
      pendingIndex: null,
    })),
    ...this.pendingModules().map((module, pendingIndex) => ({
      ...module,
      persisted: false,
      pendingIndex,
    })),
  ]);
  protected readonly filteredModules = computed(() =>
    this.listedModules().filter((module) =>
      this.moduleFilterColumns.every(({ key }) =>
        this.matchesModuleFilter(module, key, this.moduleFilters()[key]),
      ),
    ),
  );

  constructor() {
    if (this.createdParent()) {
      this.form.disable();
    } else {
      const parentDraft = this.addDraft.parentForm();
      if (parentDraft) {
        this.form.reset(parentDraft);
        this.form.markAsDirty();
      }
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.errorMessage.set('');
    });
  }

  ngOnInit(): void {
    void this.loadSetupForCodes();
    void this.loadRangeCodes();
  }

  protected rangeValue(
    applicableFor: string,
    value: string | null | undefined,
    codes: CodeRecord[],
  ): string {
    return formatCodeDescription(value, codes);
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
  }

  protected onModuleFilterDraftChange(column: ApplicableModuleFilterColumn, value: string): void {
    this.moduleFilterDrafts.update((drafts) => ({ ...drafts, [column]: value }));
  }

  protected hasModuleFilters(): boolean {
    return Object.keys(this.moduleFilters()).length > 0;
  }

  protected clearModuleFilters(): void {
    this.moduleFilters.set({});
    this.moduleFilterDrafts.set({});
  }

  private matchesModuleFilter(
    module: {
      applicableFor: string;
      productFrom?: string | null;
      productTo?: string | null;
      pcmFrom?: string | null;
      pcmTo?: string | null;
      ccmFrom?: string | null;
      ccmTo?: string | null;
      mandatoryYn?: string | null;
      activeYn?: string | null;
    },
    column: ApplicableModuleFilterColumn,
    filter: CodeColumnFilterValue | undefined,
  ): boolean {
    if (!filter) {
      return true;
    }

    const rawValue = module[column];
    if (rawValue == null || rawValue.length === 0) {
      return false;
    }

    const codes =
      column === 'productFrom' || column === 'productTo'
        ? this.productCodes()
        : column === 'pcmFrom' || column === 'pcmTo'
          ? this.pcmCodes()
          : column === 'ccmFrom' || column === 'ccmTo'
            ? this.ccmCodes()
            : [];
    const displayValue = codes.length > 0 ? formatCodeDescription(rawValue, codes) : rawValue;
    const candidates = [...new Set([rawValue, displayValue])];
    return filter.operator === 'DoesNotContain' || filter.operator === 'NotEqualTo'
      ? candidates.every((value) => this.matchesFilterText(value, filter))
      : candidates.some((value) => this.matchesFilterText(value, filter));
  }

  private matchesFilterText(value: string, filter: CodeColumnFilterValue): boolean {
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

  protected leavePage(): void {
    void this.router.navigate(['/document-setups']).then((navigated) => {
      if (navigated) {
        this.addDraft.clear();
      }
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.isSubmitting()) {
      return false;
    }

    if (this.addDraft.consumeParentNavigationBypass()) {
      return true;
    }

    return (
      (this.form.pristine && this.pendingModules().length === 0) ||
      this.documentSetupFeedback.confirmDiscardChanges()
    );
  }

  protected addModule(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.addDraft.setParentForm(this.form.getRawValue());
    this.addDraft.allowParentNavigationOnce();
    void this.router.navigate(['/document-setups/add/applicable-modules/add']);
  }

  protected editPendingModule(index: number): void {
    if (this.isSubmitting()) {
      return;
    }

    this.addDraft.setParentForm(this.form.getRawValue());
    this.addDraft.allowParentNavigationOnce();
    void this.router.navigate(['/document-setups/add/applicable-modules/add'], {
      queryParams: { editIndex: index },
    });
  }

  protected toggleMore(): void {
    this.moreExpanded.update((expanded) => !expanded);
  }

  protected async save(): Promise<void> {
    if (this.isSubmitting() || this.isLoadingSetupForCodes() || this.setupForCodesError()) {
      return;
    }

    let parent = this.createdParent();
    const parentAlreadyExisted = parent !== null;
    if (!parent) {
      this.form.markAllAsTouched();
      if (this.form.invalid) {
        const requiredFields = [
          ['docCode', 'Doc Code'],
          ['docSetupFor', 'Doc Setup For'],
        ] as const;
        const missingFields = requiredFields
          .filter(([field]) => this.form.controls[field].hasError('required'))
          .map(([, label]) => label);
        this.feedback.showRequiredFieldsValidation(missingFields);
        return;
      }
      if (
        !this.setupForCodes().some((code) => code.code === this.form.controls.docSetupFor.value)
      ) {
        this.errorMessage.set('Select a Doc Setup For code from Codes Master.');
        return;
      }
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    try {
      if (!parent) {
        try {
          parent = await this.documentSetupApi.create(toDocumentSetupWrite(this.form));
        } catch (error: unknown) {
          if (!(error instanceof HttpErrorResponse)) {
            throw error;
          }

          this.errorMessage.set(
            error.status === 409
              ? 'A document setup with this Doc Code already exists.'
              : error.status === 400
                ? 'Please correct the highlighted fields.'
                : 'The document setup could not be saved. Please try again.',
          );
          return;
        }

        this.addDraft.setParentRecord(parent);
        this.form.disable();
        this.form.markAsPristine();
      }

      const hadModules = this.pendingModules().length > 0;
      while (this.pendingModules().length > 0) {
        const [module] = this.pendingModules();
        try {
          const createdModule = await this.documentSetupApi.createApplicableModule(
            parent.docCode,
            module,
          );
          this.addDraft.addSavedModule(createdModule);
        } catch (error: unknown) {
          if (!(error instanceof HttpErrorResponse)) {
            throw error;
          }

          this.errorMessage.set(
            'The document setup was created, but an Applicable Module could not be saved. Select Save Applicable Modules to retry; already saved modules will not be submitted again.',
          );
          return;
        }
        this.addDraft.removeFirstModule();
      }

      this.feedback.showSuccess(
        parentAlreadyExisted
          ? 'Applicable Modules created successfully.'
          : hadModules
            ? 'Document setup and Applicable Modules created successfully.'
            : 'Document setup created successfully.',
      );
    } finally {
      this.isSubmitting.set(false);
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

  protected removePendingModule(index: number): void {
    if (this.isSubmitting()) {
      return;
    }

    this.addDraft.removeModule(index);
  }

  protected resetForm(): void {
    if (this.isSubmitting() || this.createdParent()) {
      return;
    }

    this.form.reset({
      docCode: '',
      docName: '',
      docDescription: '',
      docSetupFor: '',
      flex1: '',
      flex2: '',
      nameInArabic: '',
      descriptionInArabic: '',
      activeYn: true,
    });
    this.addDraft.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorMessage.set('');
  }
}
