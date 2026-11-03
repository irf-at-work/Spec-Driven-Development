import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ApplicableModuleRecord } from '../../../api/generated/models/applicable-module-record';
import { ApplicableModuleUpdate } from '../../../api/generated/models/applicable-module-update';
import { ApplicableModuleWrite } from '../../../api/generated/models/applicable-module-write';
import { CodeRecord } from '../../../api/generated/models/code-record';
import { DocumentSetupAddDraftService } from '../services/document-setup-add-draft.service';
import {
  ApplicableModuleForm,
  createApplicableModuleForm,
  setApplicableModuleForm,
  setApplicableModuleWriteForm,
  toApplicableModuleWrite,
} from '../forms/applicable-module-form';
import { DocumentSetupApiService } from '../services/document-setup-api.service';
import { DocumentSetupFeedbackService } from '../services/document-setup-feedback.service';
import {
  DocumentSetupOptionsError,
  DocumentSetupOptionsService,
  formatCodeOption,
  isFixedAssetApplicableFor,
} from '../services/document-setup-options.service';

@Component({
  selector: 'app-applicable-module-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  styleUrl: './applicable-module-form-page.css',
  templateUrl: './applicable-module-form-page.html',
})
export class ApplicableModuleFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(DocumentSetupApiService);
  private readonly feedback = inject(DocumentSetupFeedbackService);
  private readonly addDraft = inject(DocumentSetupAddDraftService);
  private readonly options = inject(DocumentSetupOptionsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form: ApplicableModuleForm = createApplicableModuleForm();
  protected readonly docCode = this.route.snapshot.paramMap.get('docCode') ?? '';
  protected readonly isParentDraft = this.route.snapshot.data['parentDraft'] === true;
  private readonly draftIndexParam = this.route.snapshot.queryParamMap.get('editIndex');
  protected readonly isEditingDraft = this.isParentDraft && this.draftIndexParam !== null;
  protected readonly draftEditIndex = this.parseDraftIndex(this.draftIndexParam);
  protected readonly documentLabel = this.isParentDraft ? 'New Document Setup' : this.docCode;
  protected readonly parentRoute = this.isParentDraft
    ? ['/document-setups/add']
    : ['/document-setups', this.docCode, 'edit'];
  protected readonly damodUid = this.route.snapshot.paramMap.get('damodUid');
  protected readonly isPersistedEditing = this.damodUid !== null;
  protected readonly isEditing = this.isPersistedEditing || this.isEditingDraft;
  protected readonly heading = 'Applicable Module';
  protected readonly applicableForCodes = signal<CodeRecord[]>([]);
  protected readonly productCodes = signal<CodeRecord[]>([]);
  protected readonly pcmCodes = signal<CodeRecord[]>([]);
  protected readonly ccmCodes = signal<CodeRecord[]>([]);
  protected readonly isLoadingApplicableForCodes = signal(true);
  protected readonly isLoadingRangeCodes = signal(true);
  protected readonly applicableForCodesError = signal('');
  protected readonly rangeCodesError = signal('');
  protected readonly loadedRecord = signal<ApplicableModuleRecord | null>(null);
  protected readonly isLoading = signal(this.isPersistedEditing);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly formatCodeOption = formatCodeOption;
  protected readonly draftModule = signal<ApplicableModuleWrite | null>(null);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.errorMessage.set('');
    });
    this.form.controls.applicableFor.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (
          !this.isLoadingApplicableForCodes() &&
          !isFixedAssetApplicableFor(value, this.applicableForCodes())
        ) {
          this.clearRanges();
        }
      });
  }

  ngOnInit(): void {
    void this.loadApplicableForCodes();
    void this.loadRangeCodes();
    if (this.isParentDraft) {
      if (this.isEditingDraft) {
        const module =
          this.draftEditIndex === null ? undefined : this.addDraft.modules()[this.draftEditIndex];
        if (!module) {
          this.errorMessage.set(
            'This draft Applicable Module is no longer available. Return to the document setup and try again.',
          );
          return;
        }

        this.draftModule.set(module);
        setApplicableModuleWriteForm(this.form, module);
      }
      return;
    }

    if (this.docCode.length === 0) {
      this.errorMessage.set(
        'The document setup code is missing. Return to the listing and try again.',
      );
      return;
    }

    if (this.isEditing) {
      void this.loadRecord();
    }
  }

  protected canDeactivate(): boolean | Promise<boolean> {
    if (this.isSaving()) {
      return false;
    }

    return this.form.pristine || this.feedback.confirmDiscardChanges();
  }

  protected leavePage(): void {
    void this.router.navigate(
      this.isParentDraft ? ['/document-setups/add'] : ['/document-setups', this.docCode, 'edit'],
    );
  }

  protected isFixedAssetSelected(): boolean {
    return isFixedAssetApplicableFor(
      this.form.controls.applicableFor.value,
      this.applicableForCodes(),
    );
  }

  protected resetForm(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.isEditingDraft) {
      const module = this.draftModule();
      if (module) {
        setApplicableModuleWriteForm(this.form, module);
        this.form.markAsUntouched();
        this.errorMessage.set('');
      }
      return;
    }

    const record = this.loadedRecord();
    if (record) {
      setApplicableModuleForm(this.form, record);
    } else {
      this.form.reset({
        applicableFor: '',
        productFrom: 'ALL',
        productTo: 'ALL',
        pcmFrom: 'ALL',
        pcmTo: 'ALL',
        ccmFrom: 'ALL',
        ccmTo: 'ALL',
        mandatoryYn: false,
        activeYn: true,
      });
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorMessage.set('');
  }

  protected async save(): Promise<void> {
    if (
      this.isSaving() ||
      this.isLoading() ||
      this.isLoadingApplicableForCodes() ||
      this.isLoadingRangeCodes() ||
      this.applicableForCodesError() ||
      (this.isFixedAssetSelected() && this.rangeCodesError() !== '') ||
      (this.isPersistedEditing && this.loadedRecord() === null) ||
      (this.isEditingDraft && (this.draftEditIndex === null || this.draftModule() === null))
    ) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const missingFields = this.form.controls.applicableFor.hasError('required')
        ? ['Applicable For']
        : [];
      this.feedback.showRequiredFieldsValidation(missingFields);
      return;
    }
    if (
      !this.applicableForCodes().some(
        (code) => code.code === this.form.controls.applicableFor.value,
      )
    ) {
      this.errorMessage.set('Select an Applicable For code from Codes Master.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    try {
      const write = toApplicableModuleWrite(this.form, this.isFixedAssetSelected());
      const record = this.loadedRecord();
      if (this.isParentDraft) {
        if (this.isEditingDraft) {
          if (this.draftEditIndex === null || this.draftModule() === null) {
            throw new RangeError('The Applicable Module draft is no longer available.');
          }
          this.addDraft.updateModule(this.draftEditIndex, write);
        } else {
          this.addDraft.addModule(write);
        }
      } else if (record && this.damodUid !== null) {
        const body: ApplicableModuleUpdate = {
          ...write,
          expectedVersion: record.version,
        };
        await this.api.updateApplicableModule(this.docCode, this.damodUid, body);
        this.feedback.showSuccess('Applicable Module updated successfully.');
      } else {
        await this.api.createApplicableModule(this.docCode, write);
        this.feedback.showSuccess('Applicable Module created successfully.');
      }

      this.form.markAsPristine();
      this.isSaving.set(false);
      await this.router.navigate(
        this.isParentDraft ? ['/document-setups/add'] : ['/document-setups', this.docCode, 'edit'],
      );
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.errorMessage.set(
        error.status === 409
          ? 'This Applicable Module changed after it was loaded. Reload the page before saving.'
          : error.status === 404
            ? 'The document setup or Applicable Module no longer exists. Return to the listing and reload.'
            : error.status === 400
              ? 'Please correct the highlighted fields.'
              : 'The Applicable Module could not be saved. Please try again.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  private async loadRecord(): Promise<void> {
    if (this.damodUid === null) {
      return;
    }

    this.isLoading.set(true);
    try {
      const record = await this.api.getApplicableModule(this.docCode, this.damodUid);
      this.loadedRecord.set(record);
      setApplicableModuleForm(this.form, record);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.errorMessage.set(
        error.status === 404
          ? 'The Applicable Module was not found. Return to the document setup and reload.'
          : 'The Applicable Module could not be loaded. Please try again.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadApplicableForCodes(): Promise<void> {
    this.isLoadingApplicableForCodes.set(true);
    this.applicableForCodesError.set('');
    try {
      this.applicableForCodes.set(await this.options.listApplicableForCodes());
      if (this.applicableForCodes().length === 0) {
        this.applicableForCodesError.set('No APPLICABLE_FOR codes were found in Codes Master.');
      }
      if (!this.isFixedAssetSelected()) {
        this.clearRanges();
      }
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse) && !(error instanceof DocumentSetupOptionsError)) {
        throw error;
      }
      this.applicableForCodesError.set(
        'Applicable For codes could not be loaded. Please try again.',
      );
    } finally {
      this.isLoadingApplicableForCodes.set(false);
    }
  }

  private async loadRangeCodes(): Promise<void> {
    this.isLoadingRangeCodes.set(true);
    this.rangeCodesError.set('');
    try {
      const [products, pcm, ccm] = await Promise.all([
        this.options.listProductCodes(),
        this.options.listPcmCodes(),
        this.options.listCcmCodes(),
      ]);
      this.productCodes.set(products);
      this.pcmCodes.set(pcm);
      this.ccmCodes.set(ccm);
      this.rangeCodesError.set(
        products.length === 0 || pcm.length === 0 || ccm.length === 0
          ? 'One or more range code types have no options in Codes Master.'
          : '',
      );
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse) && !(error instanceof DocumentSetupOptionsError)) {
        throw error;
      }
      this.rangeCodesError.set('Product, PCM, or CCM codes could not be loaded. Please try again.');
    } finally {
      this.isLoadingRangeCodes.set(false);
    }
  }

  private clearRanges(): void {
    this.form.patchValue(
      {
        productFrom: 'ALL',
        productTo: 'ALL',
        pcmFrom: 'ALL',
        pcmTo: 'ALL',
        ccmFrom: 'ALL',
        ccmTo: 'ALL',
      },
      { emitEvent: false },
    );
  }

  private parseDraftIndex(value: string | null): number | null {
    if (value === null || !/^\d+$/.test(value)) {
      return null;
    }

    const index = Number(value);
    return Number.isSafeInteger(index) ? index : null;
  }
}
