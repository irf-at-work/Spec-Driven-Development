export type FieldErrors = Readonly<Record<string, readonly string[]>>;

/**
 * What a screen receives when an API call fails: a plain-English message that is safe to show,
 * plus any per-field messages the API reported (keyed by the field's JSON name).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
