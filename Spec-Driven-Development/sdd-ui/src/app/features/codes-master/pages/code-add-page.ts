import { DestroyRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CodeFormFields } from '../components/code-form-fields';
import { codeFields, createCodeForm, toCodeWrite } from '../forms/code-form';
import { CodesApiService } from '../services/codes-api.service';
import { codeFieldErrors } from '../services/codes-api-errors';
import { CodesFeedbackService } from '../services/codes-feedback.service';

@Component({
  selector: 'app-code-add-page',
  standalone: true,
  imports: [CodeFormFields, MatButtonModule],
  styleUrl: './code-add-page.css',
  templateUrl: './code-add-page.html',
})
export class CodeAddPage {
  private readonly codesApi = inject(CodesApiService);
  private readonly feedback = inject(CodesFeedbackService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = createCodeForm();
  protected readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.serverErrors.set({});
      this.errorMessage.set('');
    });
  }

  protected async save(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.serverErrors.set({});
    this.errorMessage.set('');

    try {
      await this.codesApi.create(toCodeWrite(this.form));
      this.feedback.showSuccess('Code created successfully.');
      await this.router.navigate(['/codes']);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      const fieldErrors = codeFieldErrors(error);
      this.serverErrors.set(fieldErrors);
      for (const field of codeFields) {
        if (fieldErrors[field]) {
          this.form.controls[field].setErrors({ server: true });
        }
      }
      this.errorMessage.set(
        error.status === 409
          ? 'A record with the same Code and Code Type already exists.'
          : Object.keys(fieldErrors).length > 0
            ? 'Please correct the highlighted fields.'
            : 'The code could not be saved. Please try again.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected leavePage(): void {
    if (this.form.dirty && !window.confirm('Discard your unsaved changes?')) {
      return;
    }

    void this.router.navigate(['/codes']);
  }
}
