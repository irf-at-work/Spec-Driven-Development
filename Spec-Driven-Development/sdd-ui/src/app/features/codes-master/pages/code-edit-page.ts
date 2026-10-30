import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeFormFields } from '../components/code-form-fields';
import { codeFields, createCodeForm, toCodeWrite } from '../forms/code-form';
import { CodesApiService } from '../services/codes-api.service';
import { codeFieldErrors } from '../services/codes-api-errors';
import { CodesFeedbackService } from '../services/codes-feedback.service';

@Component({
  selector: 'app-code-edit-page',
  standalone: true,
  imports: [CodeFormFields, MatButtonModule],
  styleUrl: './code-edit-page.css',
  templateUrl: './code-edit-page.html',
})
export class CodeEditPage implements OnInit {
  private readonly codesApi = inject(CodesApiService);
  private readonly feedback = inject(CodesFeedbackService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = createCodeForm();
  protected readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  private code = '';
  private codeType = '';
  protected readonly recordLoaded = signal(false);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.serverErrors.set({});
      this.errorMessage.set('');
    });
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code') ?? '';
    this.codeType = this.route.snapshot.queryParamMap.get('codeType') ?? '';
    if (!this.code || !this.codeType) {
      this.errorMessage.set(
        'The code could not be identified. Return to the listing and try again.',
      );
      this.isLoading.set(false);
      return;
    }

    void this.loadRecord();
  }

  protected async save(): Promise<void> {
    if (this.isSubmitting() || !this.recordLoaded()) {
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
      await this.codesApi.update(this.code, this.codeType, toCodeWrite(this.form));
      this.feedback.showSuccess('Code updated successfully.');
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
        error.status === 404
          ? 'The code could not be found. Refresh the listing and try again.'
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

  private async loadRecord(): Promise<void> {
    try {
      const record = await this.codesApi.get(this.code, this.codeType);
      this.form.patchValue(record);
      this.form.markAsPristine();
      this.recordLoaded.set(true);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.errorMessage.set(
        error.status === 404
          ? 'The code could not be found. Return to the listing and try again.'
          : 'The code could not be loaded. Please try again.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
