import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiProblem, isApiProblemError } from '../../core/api-problem';
import { VehicleMakeDto, VehicleMakesClient } from '../../generated/api-client';
import { NotificationService } from '../../shared/notifications/notification.service';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { LimitedTextFieldComponent } from '../../shared/limited-text-field/limited-text-field.component';
import { HasUnsavedChanges } from '../../shared/unsaved-changes.guard';
import { notBlank } from '../../shared/validators';
import { VehicleModelListComponent } from './vehicle-model-list.component';

const MESSAGE_DURATION_MS = 5000;

// The same limits the API enforces (FR-004 to FR-007). The API stays the authority; these only help the user sooner.
const LIMITS = {
  makeCode: 12,
  makeName: 100,
  shortName: 30,
  remarks: 2000,
  arabicMakeName: 100,
  arabicShortName: 30,
  arabicRemarks: 2000,
} as const;

const ADDITIONAL_FIELDS = ['remarks', 'arabicMakeName', 'arabicShortName', 'arabicRemarks'];

interface FormValues {
  makeCode: string;
  makeName: string;
  shortName: string;
  remarks: string;
  arabicMakeName: string;
  arabicShortName: string;
  arabicRemarks: string;
  active: boolean;
}

/**
 * Adds a new vehicle make, or shows an existing one read-only with an Edit switch. It is one form for both
 * jobs (spec, User Stories 2 and 3), chosen by the route's data.
 */
@Component({
  selector: 'app-vehicle-make-form',
  imports: [
    IconButtonComponent,
    ReactiveFormsModule,
    
    MatExpansionModule,
    MatProgressBar,
    MatSlideToggle,
    LimitedTextFieldComponent,
    VehicleModelListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-make-form.component.html',
  styleUrl: './vehicle-make-form.component.css',
})
export class VehicleMakeFormComponent implements HasUnsavedChanges {
  private readonly client = inject(VehicleMakesClient);
  private readonly router = inject(Router);
  
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  // Named in the template, because the Active switch is also a slide toggle.
  private readonly editToggle = viewChild('editSwitch', { read: MatSlideToggle });
  private readonly modelList = viewChild(VehicleModelListComponent);

  protected readonly mode: 'create' | 'view' =
    inject(ActivatedRoute).snapshot.data['mode'] === 'view' ? 'view' : 'create';
  protected readonly heading = this.mode === 'create' ? 'Add vehicle make' : 'Vehicle make details';
  protected readonly limits = LIMITS;

  protected readonly editing = signal(this.mode === 'create');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly additionalOpen = signal(false);
  protected readonly currentMakeCode = signal('');

  protected readonly form = new FormGroup({
    makeCode: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        notBlank,
        Validators.maxLength(LIMITS.makeCode),
        Validators.pattern(/^[A-Za-z0-9-]+$/),
      ],
    }),
    makeName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(LIMITS.makeName)],
    }),
    shortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(LIMITS.shortName)],
    }),
    remarks: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.remarks)],
    }),
    arabicMakeName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicMakeName)],
    }),
    arabicShortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicShortName)],
    }),
    arabicRemarks: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(LIMITS.arabicRemarks)],
    }),
    // On by default for a new make; turning it off retires the make without deleting it (FR-027).
    active: new FormControl(true, { nonNullable: true }),
  });

  // What was last saved or loaded, so turning Edit off can put the form back exactly as it was.
  private savedValues: FormValues | null = null;

  constructor() {
    if (this.mode === 'view') {
      const makeCode = readMakeCodeFromHistory();
      if (makeCode === null) {
        // Reached without choosing a make from the list (for example by typing the address), so there is nothing to show.
        void this.router.navigate(['/vehicle-makes']);
        return;
      }
      this.applyEditState();
      this.loadMake(makeCode);
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty || (this.modelList()?.hasUnsavedChanges() ?? false);
  }

  protected back(): void {
    void this.router.navigate(['/vehicle-makes']);
  }

  protected onEditToggle(change: MatSlideToggleChange): void {
    if (change.checked) {
      this.editing.set(true);
      this.applyEditState();
      return;
    }

    if (!this.hasUnsavedChanges()) {
      this.stopEditing();
      return;
    }

    void this.notifications.confirm({
      title: 'Discard your changes?',
      text: 'You have changes that have not been saved. Turning editing off will discard them.',
      confirmButtonText: 'Discard changes',
      cancelButtonText: 'Keep editing',
      isDanger: true,
    }).then((discard) => {
      if (discard) {
        this.stopEditing();
        return;
      }
      const toggle = this.editToggle();
      if (toggle) {
        toggle.checked = true;
      }
    });
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.openAdditionalInformationIfItHasAnError();
      return;
    }

    const value = this.form.getRawValue();
    const details = {
      makeName: value.makeName,
      shortName: value.shortName,
      remarks: value.remarks,
      arabicMakeName: value.arabicMakeName,
      arabicShortName: value.arabicShortName,
      arabicRemarks: value.arabicRemarks,
      active: value.active,
    };

    this.saving.set(true);

    if (this.mode === 'create') {
      this.client
        .create({ makeCode: value.makeCode, ...details })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.form.markAsPristine();
            this.notifications.success('Vehicle make saved.');
            this.back();
          },
          error: (error: unknown) => this.onSaveFailed(error),
        });
      return;
    }

    this.client
      .update(value.makeCode, details)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          const keepEditingForModel = this.modelList()?.hasUnsavedChanges() ?? false;
          this.showMake(updated);
          this.editing.set(keepEditingForModel);
          this.applyEditState();
          this.notifications.success('Vehicle make updated.');
        },
        error: (error: unknown) => this.onSaveFailed(error),
      });
  }

  private loadMake(makeCode: string): void {
    this.loading.set(true);

    this.client
      .get(makeCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (make) => {
          this.loading.set(false);
          this.showMake(make);
        },
        // The interceptor has explained what went wrong; there is nothing to show, so return to the list.
        error: () => this.back(),
      });
  }

  private showMake(make: VehicleMakeDto): void {
    const values: FormValues = {
      makeCode: make.makeCode,
      makeName: make.makeName,
      shortName: make.shortName,
      remarks: make.remarks ?? '',
      arabicMakeName: make.arabicMakeName ?? '',
      arabicShortName: make.arabicShortName ?? '',
      arabicRemarks: make.arabicRemarks ?? '',
      active: make.active !== false,
    };

    this.form.reset(values);
    this.currentMakeCode.set(values.makeCode);
    this.savedValues = values;
    // FR-011: the optional section opens by itself when it holds anything, so nothing is hidden from the user.
    this.additionalOpen.set(
      values.remarks !== '' ||
        values.arabicMakeName !== '' ||
        values.arabicShortName !== '' ||
        values.arabicRemarks !== '',
    );
    this.applyEditState();
  }

  private stopEditing(): void {
    // model editing is on separate pages
    if (this.savedValues) {
      this.form.reset(this.savedValues);
    }
    this.editing.set(false);
    this.applyEditState();
  }

  // Create: everything is editable. Open: everything is locked until Edit is switched on, and then the code stays locked.
  private applyEditState(): void {
    if (this.mode === 'create' || this.editing()) {
      this.form.enable();
      if (this.mode === 'view') {
        this.form.controls.makeCode.disable();
      }
    } else {
      this.form.disable();
    }
  }

  private onSaveFailed(error: unknown): void {
    this.saving.set(false);

    if (!isApiProblemError(error)) {
      throw error;
    }
    this.showFieldErrors(error.problem);
  }

  // The API's own messages (for example "This make code already exists.") go beside the field they belong to.
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

  // A hidden error would leave the user wondering why nothing was saved.
  private openAdditionalInformationIfItHasAnError(): void {
    const controls: Record<string, AbstractControl> = this.form.controls;
    if (ADDITIONAL_FIELDS.some((field) => controls[field].invalid)) {
      this.additionalOpen.set(true);
    }
  }
}

// The code of the chosen make travels in the browser's navigation state, so it never appears in the address bar.
// The state survives a page refresh, which is why it is read from the history entry.
function readMakeCodeFromHistory(): string | null {
  const state: unknown = history.state;
  if (typeof state === 'object' && state !== null && 'makeCode' in state) {
    const makeCode = state.makeCode;
    return typeof makeCode === 'string' && makeCode.length > 0 ? makeCode : null;
  }
  return null;
}
