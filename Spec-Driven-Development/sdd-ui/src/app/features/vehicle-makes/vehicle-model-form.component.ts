import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { isApiProblemError } from '../../core/api-problem';
import {
  LookupOptionDto,
  VehicleModelDto,
  VehicleModelsClient,
  VehicleModelOptionsClient,
} from '../../generated/api-client';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { LimitedTextFieldComponent } from '../../shared/limited-text-field/limited-text-field.component';
import { NotificationService } from '../../shared/notifications/notification.service';
import { HasUnsavedChanges } from '../../shared/unsaved-changes.guard';
import { notBlank } from '../../shared/validators';

const LIMITS = {
  modelCode: 12,
  modelName: 100,
  shortName: 30,
  remarks: 2000,
  arabicModelName: 100,
  arabicShortName: 30,
  arabicRemarks: 2000,
  weight: 100,
  loadCapacity: 100,
} as const;

type DropdownField =
  | 'variant'
  | 'vehicleType'
  | 'bodyType'
  | 'fuelType'
  | 'cylinders'
  | 'doors'
  | 'drivingType'
  | 'bodyColour'
  | 'category';

const nonNegativeWholeNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value === null || control.value === '' || control.value === undefined) {
    return null;
  }
  const value = Number(control.value);
  if (!Number.isInteger(value) || value < 0) {
    return { nonNegativeWholeNumber: true };
  }
  return null;
};

const nonNegativeDecimal: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value === null || control.value === '' || control.value === undefined) {
    return null;
  }
  const value = Number(control.value);
  if (Number.isNaN(value) || value < 0) {
    return { nonNegativeDecimal: true };
  }
  return null;
};

@Component({
  selector: 'app-vehicle-model-form',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBar,
    MatSelectModule,
    MatSlideToggle,
    LimitedTextFieldComponent,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-model-form.component.html',
  styleUrl: './vehicle-model-form.component.css',
})
export class VehicleModelFormComponent implements HasUnsavedChanges {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly modelsClient = inject(VehicleModelsClient);
  private readonly optionsClient = inject(VehicleModelOptionsClient);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly limits = LIMITS;

  protected readonly makeCode = signal<string>('');
  protected readonly modelCode = signal<string>('');
  protected readonly mode = signal<'create' | 'edit'>('create');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  // Dropdown options
  protected readonly variantOptions = signal<LookupOptionDto[]>([]);
  protected readonly typeOptions = signal<LookupOptionDto[]>([]);
  protected readonly bodyTypeOptions = signal<LookupOptionDto[]>([]);
  protected readonly fuelTypeOptions = signal<LookupOptionDto[]>([]);
  protected readonly cylinderOptions = signal<LookupOptionDto[]>([]);
  protected readonly doorOptions = signal<LookupOptionDto[]>([]);
  protected readonly drivingTypeOptions = signal<LookupOptionDto[]>([]);
  protected readonly bodyColourOptions = signal<LookupOptionDto[]>([]);
  protected readonly categoryOptions = signal<LookupOptionDto[]>([]);

  protected readonly initialInactiveSelections = signal<Partial<Record<DropdownField, LookupOptionDto>>>({});

  protected readonly form = new FormGroup({
    modelCode: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlank,
        Validators.maxLength(LIMITS.modelCode),
        Validators.pattern(/^[A-Za-z0-9-]+$/),
      ],
    }),
    modelName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(LIMITS.modelName)],
    }),
    shortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(LIMITS.shortName)],
    }),
    remarks: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.remarks)],
    }),
    arabicModelName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicModelName)],
    }),
    arabicShortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicShortName)],
    }),
    arabicRemarks: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicRemarks)],
    }),
    variant: new FormControl('', { nonNullable: true }),
    vehicleType: new FormControl('', { nonNullable: true }),
    weight: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.weight)],
    }),
    loadCapacity: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.loadCapacity)],
    }),
    bodyType: new FormControl('', { nonNullable: true }),
    fuelType: new FormControl('', { nonNullable: true }),
    engineCapacity: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber],
    }),
    cylinders: new FormControl('', { nonNullable: true }),
    seats: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(999)],
    }),
    passengers: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(999)],
    }),
    drivers: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(999)],
    }),
    doors: new FormControl('', { nonNullable: true }),
    makeYear: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(9999)],
    }),
    drivingType: new FormControl('', { nonNullable: true }),
    bodyColour: new FormControl('', { nonNullable: true }),
    value: new FormControl<number | null>(null, {
      validators: [nonNegativeDecimal],
    }),
    category: new FormControl('', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });

  protected readonly pageTitle = computed(() => {
    return this.mode() === 'create'
      ? `Add Vehicle Model for Make ${this.makeCode()}`
      : `Edit Vehicle Model ${this.modelCode()} (${this.makeCode()})`;
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const make = params.get('makeCode') || '';
      const model = params.get('modelCode');
      this.makeCode.set(make);
      if (model) {
        this.modelCode.set(model);
        this.mode.set('edit');
        this.form.controls.modelCode.disable();
      } else {
        this.mode.set('create');
        this.form.controls.modelCode.enable();
      }
    });

    this.loadDropdownOptions();

    // If edit mode, load model details
    if (this.mode() === 'edit') {
      this.loadModel();
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  protected loadDropdownOptions(): void {
    this.optionsClient
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (options) => {
          this.variantOptions.set(options.variants ?? []);
          this.typeOptions.set(options['types'] ?? []);
          this.bodyTypeOptions.set(options.bodyTypes ?? []);
          this.fuelTypeOptions.set(options.fuelTypes ?? []);
          this.cylinderOptions.set(options.cylinders ?? []);
          this.doorOptions.set(options.doors ?? []);
          this.drivingTypeOptions.set(options.drivingTypes ?? []);
          this.bodyColourOptions.set(options.bodyColours ?? []);
          this.categoryOptions.set(options.categories ?? []);
        },
      });
  }

  protected loadModel(): void {
    this.loading.set(true);
    this.modelsClient
      .get(this.makeCode(), this.modelCode())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (model) => {
          this.populateForm(model);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notifications.error('The vehicle model could not be loaded.', 'Load error');
          this.back();
        },
      });
  }

  private populateForm(model: VehicleModelDto): void {
    this.form.patchValue({
      modelCode: model.modelCode ?? '',
      modelName: model.modelName ?? '',
      shortName: model.shortName ?? '',
      remarks: model.remarks ?? '',
      arabicModelName: model.arabicModelName ?? '',
      arabicShortName: model.arabicShortName ?? '',
      arabicRemarks: model.arabicRemarks ?? '',
      variant: model.variant ?? '',
      vehicleType: model.vehicleType ?? '',
      weight: model.weight ?? '',
      loadCapacity: model.loadCapacity ?? '',
      bodyType: model.bodyType ?? '',
      fuelType: model.fuelType ?? '',
      engineCapacity: model.engineCapacity ?? null,
      cylinders: model.cylinders ?? '',
      seats: model.seats ?? null,
      passengers: model.passengers ?? null,
      drivers: model.drivers ?? null,
      doors: model.doors ?? '',
      makeYear: model.makeYear ?? null,
      drivingType: model.drivingType ?? '',
      bodyColour: model.bodyColour ?? '',
      value: model.value ?? null,
      category: model.category ?? '',
      active: model.active ?? true,
    });

    this.form.markAsPristine();
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const fields = {
      modelName: value.modelName,
      shortName: value.shortName,
      remarks: value.remarks || null,
      arabicModelName: value.arabicModelName || null,
      arabicShortName: value.arabicShortName || null,
      arabicRemarks: value.arabicRemarks || null,
      variant: value.variant || null,
      vehicleType: value.vehicleType || null,
      weight: value.weight || null,
      loadCapacity: value.loadCapacity || null,
      bodyType: value.bodyType || null,
      fuelType: value.fuelType || null,
      engineCapacity: value.engineCapacity ?? null,
      cylinders: value.cylinders || null,
      seats: value.seats ?? null,
      passengers: value.passengers ?? null,
      drivers: value.drivers ?? null,
      doors: value.doors || null,
      makeYear: value.makeYear ?? null,
      drivingType: value.drivingType || null,
      bodyColour: value.bodyColour || null,
      value: value.value ?? null,
      category: value.category || null,
      active: value.active,
    };

    this.saving.set(true);

    if (this.mode() === 'create') {
      this.modelsClient
        .create(this.makeCode(), {
          modelCode: value.modelCode,
          ...fields,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.form.markAsPristine();
            this.notifications.success('Vehicle model created.');
            this.back();
          },
          error: (err: unknown) => {
            this.saving.set(false);
            this.handleError(err);
          },
        });
    } else {
      this.modelsClient
        .update(this.makeCode(), this.modelCode(), fields)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.form.markAsPristine();
            this.notifications.success('Vehicle model updated.');
            this.back();
          },
          error: (err: unknown) => {
            this.saving.set(false);
            this.handleError(err);
          },
        });
    }
  }

  private handleError(err: unknown): void {
    if (isApiProblemError(err) && err.problem.status === 409) {
      const codeError = err.problem.fieldErrors['modelCode']?.[0] ?? 'This model code already exists for this make.';
      this.form.controls.modelCode.setErrors({ server: codeError });
      this.notifications.error(codeError, 'Duplicate Model Code');
    } else {
      this.notifications.error('The vehicle model could not be saved.', 'Save failed');
    }
  }

  protected back(): void {
    void this.router.navigate(['/vehicle-makes/view'], { state: { makeCode: this.makeCode() } });
  }

  protected optionsFor(field: DropdownField): LookupOptionDto[] {
    switch (field) {
      case 'variant': return this.variantOptions();
      case 'vehicleType': return this.typeOptions();
      case 'bodyType': return this.bodyTypeOptions();
      case 'fuelType': return this.fuelTypeOptions();
      case 'cylinders': return this.cylinderOptions();
      case 'doors': return this.doorOptions();
      case 'drivingType': return this.drivingTypeOptions();
      case 'bodyColour': return this.bodyColourOptions();
      case 'category': return this.categoryOptions();
    }
  }
}
