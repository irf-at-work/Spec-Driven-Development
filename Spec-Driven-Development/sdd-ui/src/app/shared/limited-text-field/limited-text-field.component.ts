import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, merge, startWith, switchMap } from 'rxjs';

/**
 * One text box with the behaviour every master page needs: it stops typing at the limit and says so, can show a
 * character counter, can run right to left for Arabic, and shows the first error that applies. Written once here
 * so no page repeats it (constitution Article 5).
 */
@Component({
  selector: 'app-limited-text-field',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    .field {
      width: 100%;
    }
    .uppercase {
      text-transform: uppercase;
    }
  `,
  template: `
    <mat-form-field class="field" appearance="outline" subscriptSizing="dynamic">
      <mat-label>{{ label() }}</mat-label>
      @if (multiline()) {
        <textarea
          matInput
          rows="3"
          [formControl]="control()"
          [maxlength]="maxLength()"
          [attr.dir]="direction()"
          [attr.lang]="rtl() ? 'ar' : null"
        ></textarea>
      } @else {
        <input
          matInput
          type="text"
          autocomplete="off"
          [formControl]="control()"
          [maxlength]="maxLength()"
          [attr.dir]="direction()"
          [attr.lang]="rtl() ? 'ar' : null"
          [class.uppercase]="uppercase()"
          (blur)="convertToUppercase()"
        />
      }

      @if (limitReached()) {
        <mat-hint>Maximum {{ maxLength() }} characters.</mat-hint>
      }
      @if (showCounter()) {
        <mat-hint align="end">{{ length() }} / {{ maxLength() }}</mat-hint>
      }

      @if (control().hasError('required')) {
        <mat-error>{{ label() }} is required.</mat-error>
      } @else if (control().hasError('pattern')) {
        <mat-error>{{ patternMessage() }}</mat-error>
      } @else if (control().hasError('maxlength')) {
        <mat-error>Maximum {{ maxLength() }} characters.</mat-error>
      } @else if (serverMessage(); as message) {
        <mat-error>{{ message }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class LimitedTextFieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly maxLength = input.required<number>();
  readonly patternMessage = input('This value is not in the expected format.');
  readonly rtl = input(false);
  readonly multiline = input(false);
  /** Shows and saves the text in capitals (used for codes). */
  readonly uppercase = input(false);
  readonly showCounter = input(false);

  // The control's value is not a signal, so its length and enabled state are followed here. This keeps the OnPush view
  // up to date when a page fills the form in by code, or switches a form between read-only and editable.
  private readonly state = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) =>
        merge(control.valueChanges, control.statusChanges).pipe(
          startWith(null),
          map(() => ({ length: control.value.length, enabled: control.enabled })),
        ),
      ),
    ),
    { initialValue: { length: 0, enabled: true } },
  );

  protected readonly length = computed(() => this.state().length);
  protected readonly direction = computed(() => (this.rtl() ? 'rtl' : 'ltr'));

  // Only while the box can be edited: a full read-only value is not a warning.
  protected readonly limitReached = computed(
    () => this.state().enabled && this.state().length >= this.maxLength(),
  );

  protected serverMessage(): string | null {
    const error: unknown = this.control().getError('server');
    return typeof error === 'string' ? error : null;
  }

  protected convertToUppercase(): void {
    const control = this.control();
    if (this.uppercase() && control.value !== control.value.toUpperCase()) {
      control.setValue(control.value.toUpperCase());
    }
  }
}
