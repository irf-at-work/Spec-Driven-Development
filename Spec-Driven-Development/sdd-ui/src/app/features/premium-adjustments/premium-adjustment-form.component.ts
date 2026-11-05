import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  AdjustmentCodeDto,
  LookupOptionDto,
  PremiumAdjustmentOptionsDto,
  PremiumAdjustmentOptionsClient,
  PremiumAdjustmentsClient,
} from '../../generated/api-client';
import { ApiProblem, isApiProblemError } from '../../core/api-problem';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { LimitedTextFieldComponent } from '../../shared/limited-text-field/limited-text-field.component';
import { NotificationService } from '../../shared/notifications/notification.service';
import { HasUnsavedChanges } from '../../shared/unsaved-changes.guard';
import {
  PremiumAdjustmentKey,
  readPremiumAdjustmentKeyFromHistory,
} from '../../shared/navigation-state';
import { notBlank } from '../../shared/validators';

const LIMITS = {
  code: 12,
  companyCode: 12,
  name: 100,
  shortName: 30,
  remarks: 2000,
  arabicName: 100,
  arabicShortName: 30,
  arabicRemarks: 2000,
} as const;

const ADDITIONAL_FIELDS = ['remarks', 'arabicName', 'arabicShortName', 'arabicRemarks'] as const;

interface AdjustmentFormValues {
  codeType: string;
  code: string;
  companyCode: string;
  name: string;
  shortName: string;
  discountType: string;
  chargesType: string;
  chargesCategory: string;
  remarks: string;
  arabicName: string;
  arabicShortName: string;
  arabicRemarks: string;
  active: boolean;
}

@Component({
  selector: 'app-premium-adjustment-form',
  imports: [
    IconButtonComponent,
    LimitedTextFieldComponent,
    MatExpansionModule,
    MatFormFieldModule,
    MatProgressBar,
    MatSelectModule,
    MatSlideToggle,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './premium-adjustment-form.component.html',
  styleUrl: './premium-adjustment-form.component.css',
})
export class PremiumAdjustmentFormComponent implements HasUnsavedChanges {
  private readonly client = inject(PremiumAdjustmentsClient);
  private readonly optionsClient = inject(PremiumAdjustmentOptionsClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly mode: 'create' | 'view' =
    this.route.snapshot.data['mode'] === 'view' ? 'view' : 'create';
  protected readonly heading =
    this.mode === 'create' ? 'Add Premium Adjustment' : 'Premium Adjustment Details';
  protected readonly limits = LIMITS;
  protected readonly loading = signal(false);
  protected readonly optionsLoading = signal(true);
  protected readonly optionsFailed = signal(false);
  protected readonly saving = signal(false);
  protected readonly additionalOpen = signal(false);
  protected readonly adjustment = signal<AdjustmentCodeDto | null>(null);
  protected readonly options = signal<PremiumAdjustmentOptionsDto | null>(null);
  private readonly key = signal<PremiumAdjustmentKey | null>(null);

  protected readonly form = new FormGroup({
    codeType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(12)],
    }),
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlank,
        Validators.maxLength(LIMITS.code),
        Validators.pattern(/^[A-Za-z0-9-]+$/),
      ],
    }),
    companyCode: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlank,
        Validators.maxLength(LIMITS.companyCode),
        Validators.pattern(/^[A-Za-z0-9-]+$/),
      ],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(LIMITS.name)],
    }),
    shortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(LIMITS.shortName)],
    }),
    discountType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(12)],
    }),
    chargesType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(12)],
    }),
    chargesCategory: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(12)],
    }),
    remarks: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.remarks)],
    }),
    arabicName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicName)],
    }),
    arabicShortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicShortName)],
    }),
    arabicRemarks: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicRemarks)],
    }),
    active: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    if (this.mode === 'view') {
      const key = readPremiumAdjustmentKeyFromHistory();
      if (key === null) {
        void this.router.navigate(['/premium-adjustments']);
        return;
      }
      this.key.set(key);
      this.loadAdjustment(key);
    } else {
      this.applyEditState();
    }

    this.loadOptions();
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  protected back(): void {
    void this.router.navigate(['/premium-adjustments']);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.openAdditionalInformationIfItHasAnError();
      return;
    }

    const values = this.form.getRawValue();
    this.saving.set(true);

    if (this.mode === 'create') {
      this.client
        .create(values)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.form.markAsPristine();
            this.notifications.success('Premium adjustment saved.');
            this.back();
          },
          error: (error: unknown) => this.onSaveFailed(error),
        });
      return;
    }

    const key = this.key();
    if (key === null) {
      this.saving.set(false);
      this.notifications.error(
        'The premium adjustment key is missing. Return to the list and open it again.',
      );
      return;
    }

    this.client
      .update(key.codeType, key.code, key.companyCode, {
        name: values.name,
        shortName: values.shortName,
        discountType: values.discountType,
        chargesType: values.chargesType,
        chargesCategory: values.chargesCategory,
        remarks: values.remarks,
        arabicName: values.arabicName,
        arabicShortName: values.arabicShortName,
        arabicRemarks: values.arabicRemarks,
        active: values.active,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.showAdjustment(updated);
          this.notifications.success('Premium adjustment updated.');
        },
        error: (error: unknown) => this.onSaveFailed(error),
      });
  }

  protected optionsFor(
    items: readonly LookupOptionDto[] | undefined,
    current: string | null | undefined,
  ): readonly LookupOptionDto[] {
    if (!items) {
      return [];
    }
    if (!current || items.some((item) => item.code === current)) {
      return items;
    }
    return [{ code: current, description: `${current} (inactive)` }, ...items];
  }

  protected fieldMessage(control: AbstractControl): string | null {
    const error: unknown = control.getError('server');
    return typeof error === 'string' ? error : null;
  }

  private loadOptions(): void {
    this.optionsClient
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (options) => {
          this.options.set(options);
          this.optionsLoading.set(false);
        },
        error: () => {
          this.optionsFailed.set(true);
          this.optionsLoading.set(false);
          this.notifications.error('The dropdown options could not be loaded. Please try again.');
        },
      });
  }

  private loadAdjustment(key: PremiumAdjustmentKey): void {
    this.loading.set(true);
    this.client
      .get(key.codeType, key.code, key.companyCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (adjustment) => {
          this.showAdjustment(adjustment);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.back();
        },
      });
  }

  private showAdjustment(adjustment: AdjustmentCodeDto): void {
    const values: AdjustmentFormValues = {
      codeType: adjustment.codeType,
      code: adjustment.code,
      companyCode: adjustment.companyCode,
      name: adjustment.name,
      shortName: adjustment.shortName,
      discountType: adjustment.discountType ?? '',
      chargesType: adjustment.chargesType ?? '',
      chargesCategory: adjustment.chargesCategory ?? '',
      remarks: adjustment.remarks ?? '',
      arabicName: adjustment.arabicName ?? '',
      arabicShortName: adjustment.arabicShortName ?? '',
      arabicRemarks: adjustment.arabicRemarks ?? '',
      active: adjustment.active,
    };

    this.adjustment.set(adjustment);
    this.form.reset(values);
    this.additionalOpen.set(ADDITIONAL_FIELDS.some((field) => values[field] !== ''));
    this.applyEditState();
  }

  private applyEditState(): void {
    this.form.enable();
    if (this.mode === 'view') {
      this.form.controls.codeType.disable();
      this.form.controls.code.disable();
      this.form.controls.companyCode.disable();
    }
  }

  private onSaveFailed(error: unknown): void {
    this.saving.set(false);
    if (!isApiProblemError(error)) {
      this.notifications.error('The premium adjustment could not be saved. Please try again.');
      return;
    }
    this.showFieldErrors(error.problem);
  }

  private showFieldErrors(problem: ApiProblem): void {
    const controls: Record<string, AbstractControl> = this.form.controls;
    for (const [field, messages] of Object.entries(problem.fieldErrors)) {
      const control = controls[field];
      if (control && messages.length > 0) {
        control.setErrors({ server: messages[0] });
        control.markAsTouched();
      }
    }
    this.openAdditionalInformationIfItHasAnError();
  }

  private openAdditionalInformationIfItHasAnError(): void {
    const controls: Record<string, AbstractControl> = this.form.controls;
    if (ADDITIONAL_FIELDS.some((field) => controls[field].invalid)) {
      this.additionalOpen.set(true);
    }
  }
}
