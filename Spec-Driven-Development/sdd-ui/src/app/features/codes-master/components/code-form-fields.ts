import { Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CodeFormControls, CodeFormGroup } from '../forms/code-form';

@Component({
  selector: 'app-code-form-fields',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  styleUrl: './code-form-fields.css',
  templateUrl: './code-form-fields.html',
})
export class CodeFormFields {
  readonly form = input.required<CodeFormGroup>();
  readonly serverErrors = input<Record<string, string[]>>({});
  readonly identityReadonly = input(false);
  readonly submitted = output<void>();
  protected readonly moreExpanded = signal(false);

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
}
