import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { isApiProblemError } from '../../core/api-problem';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { HasUnsavedChanges } from '../../shared/unsaved-changes.guard';
import { LimitedTextFieldComponent } from '../../shared/limited-text-field/limited-text-field.component';
import { NotificationService } from '../../shared/notifications/notification.service';
import { ClaimConfigurationProductsComponent } from './claim-configuration-products.component';
import {
  ClaimConfigurationChoice,
  ClaimConfigurationDetail,
  ClaimConfigurationListService,
  ClaimConfigurationSaveRequest,
} from './claim-configuration-list.service';

type ChoiceField =
  | 'module'
  | 'postingType'
  | 'exchangeRateType'
  | 'roundType'
  | 'applicableCurrencyType'
  | 'estimatedClosureReason'
  | 'recoveryDeduction';

const CHOICE_FIELDS: readonly ChoiceField[] = [
  'module',
  'postingType',
  'exchangeRateType',
  'roundType',
  'applicableCurrencyType',
  'estimatedClosureReason',
  'recoveryDeduction',
];

@Component({
  selector: 'app-claim-configuration-form',
  imports: [IconButtonComponent, LimitedTextFieldComponent, MatCheckboxModule, MatExpansionModule, MatSlideToggle, ReactiveFormsModule, ClaimConfigurationProductsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './claim-configuration-form.component.html',
  styleUrl: './claim-configuration-form.component.css',
})
export class ClaimConfigurationFormComponent implements HasUnsavedChanges {
  private readonly service = inject(ClaimConfigurationListService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(NotificationService);

  protected readonly mode: 'create' | 'edit' | 'view' = this.route.snapshot.data['mode'] === 'create' ? 'create' : this.route.snapshot.data['mode'] === 'edit' ? 'edit' : 'view';
  protected readonly ccmCode = this.route.snapshot.paramMap.get('ccmCode') ?? '';
  protected readonly current = signal<ClaimConfigurationDetail | null>(null);
  protected readonly writeEnabled = signal(false);
  protected readonly writeMessage = signal('Checking write readiness…');
  protected readonly loading = signal(true);
  protected readonly optionsLoading = signal(true);
  protected readonly optionsFailed = signal(false);
  protected readonly saving = signal(false);
  protected readonly additionalOpen = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly fieldErrors = signal<Record<string, string>>({});
  protected readonly options = signal<Record<ChoiceField, ClaimConfigurationChoice[]>>({
    module: [], postingType: [], exchangeRateType: [], roundType: [], applicableCurrencyType: [], estimatedClosureReason: [], recoveryDeduction: [],
  });

  protected readonly form = new FormGroup({
    ccmCode: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[A-Za-z0-9-]+$/)]),
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    shortName: new FormControl('', [Validators.maxLength(30)]),
    nameL2: new FormControl('', { nonNullable: true }),
    shortNameL2: new FormControl('', { nonNullable: true }),
    module: new FormControl(''),
    accountingPostingType: new FormControl(''),
    accountingExchangeRateType: new FormControl(''),
    roundingType: new FormControl(''),
    roundingValue: new FormControl<number | null>(0, [Validators.min(0)]),
    applicableCurrencyType: new FormControl(''),
    defaultEstimatedClosureReasonCode: new FormControl(''),
    defaultRecoveryDeductionCode: new FormControl(''),
    printBeforeApproval: new FormControl(false, { nonNullable: true }),
    reprint: new FormControl(false, { nonNullable: true }),
    claimAccountingDocumentGeneration: new FormControl(true, { nonNullable: true }),
    claimCoinsuranceAccountingDocumentGeneration: new FormControl(true, { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    this.service.writeStatus().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (status) => {
        this.writeEnabled.set(status.enabled);
        this.writeMessage.set(status.message);
      },
      error: () => this.writeMessage.set('Write status could not be loaded. Saving is unavailable.'),
    });

    this.loadChoices();
    if (this.mode !== 'create') {
      this.form.controls.ccmCode.disable();
      this.loadCurrent();
    } else {
      this.loading.set(false);
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.saving();
  }

  protected back(): void {
    void this.router.navigate(['/claim-configurations']);
  }

  protected uppercase(field: 'name' | 'shortName', event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();
    input.value = upper;
    this.form.controls[field].setValue(upper);
  }

  protected choicesFor(field: ChoiceField, currentCode?: string | null): ClaimConfigurationChoice[] {
    const choices = this.options()[field];
    if (!currentCode || choices.some((choice) => choice.code === currentCode)) {
      return choices;
    }
    return [...choices, { code: currentCode, description: `${currentCode} (current value; inactive)` }];
  }

  protected save(): void {
    if (!this.writeEnabled()) {
      this.errorMessage.set(this.writeMessage());
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.fieldErrors.set({});
    const value = this.form.getRawValue();
    const request: ClaimConfigurationSaveRequest = {
      ccmCode: this.mode === 'create' ? (value.ccmCode ?? '').trim().toUpperCase() : this.ccmCode,
      name: (value.name ?? '').trim().toUpperCase(),
      shortName: (value.shortName ?? '').trim() ? (value.shortName ?? '').trim().toUpperCase() : null,
      nameL2: value.nameL2,
      shortNameL2: value.shortNameL2,
      module: value.module || null,
      accountingPostingType: value.accountingPostingType || null,
      accountingExchangeRateType: value.accountingExchangeRateType || null,
      roundingType: value.roundingType || null,
      roundingValue: value.roundingValue,
      applicableCurrencyType: value.applicableCurrencyType || null,
      defaultEstimatedClosureReasonCode: value.defaultEstimatedClosureReasonCode || null,
      defaultRecoveryDeductionCode: value.defaultRecoveryDeductionCode || null,
      printBeforeApproval: value.printBeforeApproval,
      reprint: value.reprint,
      claimAccountingDocumentGeneration: value.claimAccountingDocumentGeneration,
      claimCoinsuranceAccountingDocumentGeneration: value.claimCoinsuranceAccountingDocumentGeneration,
      active: value.active,
    };

    const save$ = this.mode === 'create'
      ? this.service.create(request)
      : this.service.update(this.ccmCode, request);
    save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.form.markAsPristine();
        this.notifications.success(this.mode === 'create' ? 'Claim configuration created.' : 'Claim configuration updated.');
        void this.router.navigate(['/claim-configurations', saved.ccmCode]);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        if (isApiProblemError(error)) {
          const messages: Record<string, string> = {};
          for (const [field, fieldMessages] of Object.entries(error.problem.fieldErrors)) {
            messages[field] = fieldMessages[0] ?? 'Check this value.';
          }
          this.fieldErrors.set(messages);
          if (error.problem.status === 503) {
            this.errorMessage.set('Writes are disabled until the approved global CCM Code index is applied and enabled.');
          } else if (Object.keys(messages).length === 0) {
            this.errorMessage.set('The claim configuration could not be saved. Review the values and try again.');
          } else {
            this.errorMessage.set(Object.values(messages).join(' '));
          }
        } else {
          this.errorMessage.set('The claim configuration could not be saved. Please try again.');
        }
      },
    });
  }

  private loadChoices(): void {
    const request = Object.fromEntries(CHOICE_FIELDS.map((field) => [field, this.service.choices(field)])) as Record<
      ChoiceField,
      ReturnType<ClaimConfigurationListService['choices']>
    >;
    forkJoin(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (choices) => {
        this.options.set(choices);
        this.optionsLoading.set(false);
        this.optionsFailed.set(false);
        const current = this.current();
        if (current) this.addCurrentValues(current);
      },
      error: () => {
        this.optionsLoading.set(false);
        this.optionsFailed.set(true);
      },
    });
  }

  private loadCurrent(): void {
    this.service.get(this.ccmCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (item) => {
        this.current.set(item);
        this.additionalOpen.set(!!item.nameL2 || !!item.shortNameL2);
        this.form.reset({
          ccmCode: item.ccmCode,
          name: item.name,
          shortName: item.shortName ?? '',
          nameL2: item.nameL2 ?? '',
          shortNameL2: item.shortNameL2 ?? '',
          module: item.module ?? '',
          accountingPostingType: item.accountingPostingType ?? '',
          accountingExchangeRateType: item.accountingExchangeRateType ?? '',
          roundingType: item.roundingType ?? '',
          roundingValue: item.roundingValue ?? null,
          applicableCurrencyType: item.applicableCurrencyType ?? '',
          defaultEstimatedClosureReasonCode: item.defaultEstimatedClosureReasonCode ?? '',
          defaultRecoveryDeductionCode: item.defaultRecoveryDeductionCode ?? '',
          printBeforeApproval: item.printBeforeApproval,
          reprint: item.reprint,
          claimAccountingDocumentGeneration: item.claimAccountingDocumentGeneration,
          claimCoinsuranceAccountingDocumentGeneration: item.claimCoinsuranceAccountingDocumentGeneration,
          active: item.active,
        });
        this.addCurrentValues(item);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('This claim configuration could not be loaded. Return to the list and try again.');
      },
    });
  }

  private addCurrentValues(item: ClaimConfigurationDetail): void {
    const values: Partial<Record<ChoiceField, string | null>> = {
      module: item.module,
      postingType: item.accountingPostingType,
      exchangeRateType: item.accountingExchangeRateType,
      roundType: item.roundingType,
      applicableCurrencyType: item.applicableCurrencyType,
      estimatedClosureReason: item.defaultEstimatedClosureReasonCode,
      recoveryDeduction: item.defaultRecoveryDeductionCode,
    };
    this.options.update((options) => {
      const next = { ...options };
      for (const field of CHOICE_FIELDS) {
        const code = values[field];
        if (code && !next[field].some((choice) => choice.code === code)) {
          next[field] = [...next[field], { code, description: `${code} (current value; inactive)` }];
        }
      }
      return next;
    });
  }
}
