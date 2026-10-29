import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Treats a box holding only spaces as empty. Angular's own required check accepts spaces, but the API trims
 * them away, so the form should reject them too. Use it together with Validators.required, which is what puts the
 * asterisk on the label.
 */
export function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length === 0 ? { required: true } : null;
}
