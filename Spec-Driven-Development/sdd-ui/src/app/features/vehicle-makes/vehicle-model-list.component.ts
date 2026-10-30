import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
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
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { filter, switchMap } from 'rxjs';
import { ApiProblem, isApiProblemError } from '../../core/api-problem';
import {
  LookupOptionDto,
  UpdateVehicleModelRequest,
  VehicleModelDto,
  VehicleModelsClient,
  VehicleModelOptionsClient,
} from '../../generated/api-client';
import { openConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog.component';
import { LimitedTextFieldComponent } from '../../shared/limited-text-field/limited-text-field.component';
import { HasUnsavedChanges } from '../../shared/unsaved-changes.guard';
import { notBlank } from '../../shared/validators';

const MESSAGE_DURATION_MS = 5000;

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

interface ModelFormValue {
  modelCode: string;
  modelName: string;
  shortName: string;
  remarks: string;
  arabicModelName: string;
  arabicShortName: string;
  arabicRemarks: string;
  variant: string;
  vehicleType: string;
  weight: string;
  loadCapacity: string;
  bodyType: string;
  fuelType: string;
  engineCapacity: number | null;
  cylinders: string;
  seats: number | null;
  passengers: number | null;
  drivers: number | null;
  doors: string;
  makeYear: number | null;
  drivingType: string;
  bodyColour: string;
  value: number | null;
  category: string;
  active: boolean;
}

const nonNegativeWholeNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: unknown = control.value;
  return value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 0)
    ? null
    : { nonNegativeWholeNumber: true };
};

/** Lists and edits the models for a saved make, independently of the make's own form. */
@Component({
  selector: 'app-vehicle-model-list',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBar,
    MatSelectModule,
    MatSlideToggle,
    MatTableModule,
    LimitedTextFieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-model-list.component.html',
  styleUrl: './vehicle-model-list.component.css',
})
export class VehicleModelListComponent implements HasUnsavedChanges {
  private readonly modelsClient = inject(VehicleModelsClient);
  private readonly optionsClient = inject(VehicleModelOptionsClient);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly makeCode = input.required<string>();
  readonly makeEditable = input(false);

  protected readonly limits = LIMITS;
  protected readonly editorOpen = signal(false);
  protected readonly creating = signal(false);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly items = signal<VehicleModelDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = 10;
  protected readonly columns = computed(() =>
    this.makeEditable()
      ? ['modelCode', 'modelName', 'shortName', 'status', 'actions']
      : ['modelCode', 'modelName', 'shortName', 'status'],
  );

  protected readonly options = signal({
    variants: [] as LookupOptionDto[],
    vehicleTypes: [] as LookupOptionDto[],
    bodyTypes: [] as LookupOptionDto[],
    fuelTypes: [] as LookupOptionDto[],
    cylinders: [] as LookupOptionDto[],
    doors: [] as LookupOptionDto[],
    drivingTypes: [] as LookupOptionDto[],
    bodyColours: [] as LookupOptionDto[],
    categories: [] as LookupOptionDto[],
  });

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
    variant: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    vehicleType: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    weight: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.weight)],
    }),
    loadCapacity: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.loadCapacity)],
    }),
    bodyType: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    fuelType: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    engineCapacity: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber],
    }),
    cylinders: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    seats: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(999)],
    }),
    passengers: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(999)],
    }),
    drivers: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(999)],
    }),
    doors: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    makeYear: new FormControl<number | null>(null, {
      validators: [nonNegativeWholeNumber, Validators.max(9999)],
    }),
    drivingType: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    bodyColour: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    value: new FormControl<number | null>(null, { validators: [Validators.min(0)] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(12)] }),
    active: new FormControl(true, { nonNullable: true }),
  });

  private currentModel: VehicleModelDto | null = null;

  protected readonly emptyMessage = computed(
    () => 'This make has no models yet. Select "Add model" to create the first one.',
  );

  constructor() {
    this.loadOptions();

    effect(() => {
      const makeCode = this.makeCode();
      if (makeCode) {
        this.pageIndex.set(0);
        untracked(() => this.loadModels());
      }
    });

    effect(() => {
      if (!this.makeEditable() && this.editorOpen()) {
        this.resetEditor();
      }
    });
  }

  hasUnsavedChanges(): boolean {
    return this.editorOpen() && this.form.dirty;
  }

  protected loadModels(): void {
    this.loading.set(true);
    this.modelsClient
      .list(this.makeCode(), this.pageIndex() + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.items.set(result.items ?? []);
          this.totalCount.set(result.totalCount ?? 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Could not load vehicle models.', 'Close', {
            duration: MESSAGE_DURATION_MS,
          });
        },
      });
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.loadModels();
  }

  protected addModel(): void {
    if (!this.makeEditable()) {
      return;
    }

    this.currentModel = null;
    this.creating.set(true);
    this.form.reset(emptyFormValue());
    this.form.enable();
    this.editorOpen.set(true);
  }

  protected editModel(model: VehicleModelDto): void {
    if (!this.makeEditable()) {
      return;
    }

    this.currentModel = model;
    this.creating.set(false);
    this.form.reset(formValueFor(model));
    this.form.controls.modelCode.disable();
    this.editorOpen.set(true);
  }

  protected cancelModel(): void {
    if (!this.form.dirty) {
      this.resetEditor();
      return;
    }

    openConfirmDialog(this.dialog, {
      title: 'Discard this model row?',
      message: 'Your unsaved model changes will be lost.',
      confirmLabel: 'Discard changes',
      cancelLabel: 'Keep editing',
      destructive: true,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discard) => {
        if (discard) {
          this.resetEditor();
        }
      });
  }

  /** Called after the parent has confirmed that make-edit changes may be discarded. */
  discardForMakeEditOff(): void {
    this.resetEditor();
  }

  protected saveModel(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.makeEditable()) {
      return;
    }

    const value = this.form.getRawValue();
    const fields = modelRequestFields(value);
    const creating = this.creating();
    const currentModel = this.currentModel;
    this.saving.set(true);

    const request = creating
      ? this.modelsClient.create(this.makeCode(), {
          modelCode: value.modelCode,
          ...fields,
        })
      : currentModel
        ? this.modelsClient.update(this.makeCode(), currentModel.modelCode, fields)
        : null;

    if (request === null) {
      this.saving.set(false);
      this.snackBar.open(
        'The selected model is no longer available. Refresh the model list.',
        'Close',
        {
          duration: MESSAGE_DURATION_MS,
        },
      );
      return;
    }

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.resetEditor();
        this.loadModels();
        this.snackBar.open(creating ? 'Vehicle model saved.' : 'Vehicle model updated.', 'Close', {
          duration: MESSAGE_DURATION_MS,
        });
      },
      error: (error: unknown) => {
        this.saving.set(false);
        if (isApiProblemError(error)) {
          this.showFieldErrors(error.problem);
        } else {
          this.snackBar.open('Could not save the vehicle model.', 'Close', {
            duration: MESSAGE_DURATION_MS,
          });
        }
      },
    });
  }

  protected deleteModel(model: VehicleModelDto): void {
    if (!this.makeEditable()) {
      return;
    }

    openConfirmDialog(this.dialog, {
      title: 'Delete this vehicle model?',
      message: `${model.modelName} (${model.modelCode}) will be permanently deleted. This cannot be undone.`,
      confirmLabel: 'Delete permanently',
      cancelLabel: 'Cancel',
      destructive: true,
    })
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.modelsClient.delete(this.makeCode(), model.modelCode)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          if (this.items().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((index) => index - 1);
          }
          this.loadModels();
          this.snackBar.open('Vehicle model deleted.', 'Close', {
            duration: MESSAGE_DURATION_MS,
          });
        },
        error: () => {
          this.snackBar.open('Could not delete the vehicle model.', 'Close', {
            duration: MESSAGE_DURATION_MS,
          });
        },
      });
  }

  protected optionsFor(field: DropdownField): LookupOptionDto[] {
    const options = this.options();
    switch (field) {
      case 'variant':
        return options.variants;
      case 'vehicleType':
        return options.vehicleTypes;
      case 'bodyType':
        return options.bodyTypes;
      case 'fuelType':
        return options.fuelTypes;
      case 'cylinders':
        return options.cylinders;
      case 'doors':
        return options.doors;
      case 'drivingType':
        return options.drivingTypes;
      case 'bodyColour':
        return options.bodyColours;
      case 'category':
        return options.categories;
    }
  }

  protected hasInactiveSelection(field: DropdownField): boolean {
    const selected = this.form.controls[field].value;
    return (
      selected.length > 0 && !this.optionsFor(field).some((option) => option.code === selected)
    );
  }

  protected fieldError(control: AbstractControl): string | null {
    if (!control.touched) {
      return null;
    }

    const serverError: unknown = control.getError('server');
    if (typeof serverError === 'string') {
      return serverError;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (control.hasError('maxlength')) {
      return 'The value exceeds its maximum length.';
    }
    if (control.hasError('nonNegativeWholeNumber')) {
      return 'Enter a whole number of zero or more.';
    }
    if (control.hasError('min') || control.hasError('max')) {
      return 'The value is outside the allowed range.';
    }
    return null;
  }

  private loadOptions(): void {
    this.optionsClient
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (options) => this.options.set(options),
        error: () => {
          this.snackBar.open('Could not load vehicle model options.', 'Close', {
            duration: MESSAGE_DURATION_MS,
          });
        },
      });
  }

  private showFieldErrors(problem: ApiProblem): void {
    const controls: Record<string, AbstractControl> = this.form.controls;
    for (const [field, messages] of Object.entries(problem.fieldErrors)) {
      const control = controls[field];
      if (control && messages.length > 0) {
        control.setErrors({ ...control.errors, server: messages[0] });
        control.markAsTouched();
      }
    }
  }

  private resetEditor(): void {
    this.editorOpen.set(false);
    this.creating.set(false);
    this.currentModel = null;
    this.form.reset(emptyFormValue());
    this.form.markAsPristine();
    this.form.enable();
  }
}

function emptyFormValue(): ModelFormValue {
  return {
    modelCode: '',
    modelName: '',
    shortName: '',
    remarks: '',
    arabicModelName: '',
    arabicShortName: '',
    arabicRemarks: '',
    variant: '',
    vehicleType: '',
    weight: '',
    loadCapacity: '',
    bodyType: '',
    fuelType: '',
    engineCapacity: null,
    cylinders: '',
    seats: null,
    passengers: null,
    drivers: null,
    doors: '',
    makeYear: null,
    drivingType: '',
    bodyColour: '',
    value: null,
    category: '',
    active: true,
  };
}

function formValueFor(model: VehicleModelDto): ModelFormValue {
  return {
    modelCode: model.modelCode,
    modelName: model.modelName,
    shortName: model.shortName,
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
    engineCapacity: model.engineCapacity,
    cylinders: model.cylinders ?? '',
    seats: model.seats,
    passengers: model.passengers,
    drivers: model.drivers,
    doors: model.doors ?? '',
    makeYear: model.makeYear,
    drivingType: model.drivingType ?? '',
    bodyColour: model.bodyColour ?? '',
    value: model.value,
    category: model.category ?? '',
    active: model.active,
  };
}

function modelRequestFields(value: ModelFormValue): UpdateVehicleModelRequest {
  return {
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
    engineCapacity: value.engineCapacity,
    cylinders: value.cylinders || null,
    seats: value.seats,
    passengers: value.passengers,
    drivers: value.drivers,
    doors: value.doors || null,
    makeYear: value.makeYear,
    drivingType: value.drivingType || null,
    bodyColour: value.bodyColour || null,
    value: value.value,
    category: value.category || null,
    active: value.active,
  };
}
