import { Component, effect, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CodeFormControls, CodeFormGroup } from '../forms/code-form';

@Component({
  selector: 'app-code-form-fields',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  styleUrl: './code-form-fields.css',
  templateUrl: './code-form-fields.html',
})
export class CodeFormFields {
  readonly form = input.required<CodeFormGroup>();
  readonly serverErrors = input<Record<string, string[]>>({});
  readonly identityReadonly = input(false);
  readonly resetVersion = input(0);
  readonly submitted = output<void>();
  protected readonly moreExpanded = signal(false);

  constructor() {
    effect(() => {
      this.resetVersion();
      this.moreExpanded.set(false);
    });
  }
  private readonly shortDescriptionEdited = signal(false);

  protected fieldError(field: keyof CodeFormControls): string | null {
    const serverError = this.serverErrors()[field]?.[0];
    if (serverError) {
      return serverError;
    }

    const control = this.form().controls[field];
    return control.touched && control.hasError('required') ? 'This field is required.' : null;
  }

  protected toggleMore(): void {
    this.moreExpanded.update((expanded) => !expanded);
  }

  protected onCodeDescriptionInput(event: Event): void {
    if (this.identityReadonly() || this.form().controls.shortDescription.dirty) {
      return;
    }

    if (event.target instanceof HTMLInputElement) {
      this.form().controls.shortDescription.setValue(event.target.value.slice(0, 30), {
        emitEvent: false,
      });
    }
  }

  protected onShortDescriptionInput(): void {
    this.form().controls.shortDescription.markAsDirty();
  }

  protected setActive(checked: boolean): void {
    this.form().controls.activeYn.setValue(checked ? 'Y' : 'N');
  }
}
