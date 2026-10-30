import { HttpErrorResponse } from '@angular/common/http';
import { codeFields, CodeFieldErrors } from '../forms/code-form';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function codeFieldErrors(error: HttpErrorResponse): CodeFieldErrors {
  const body: unknown = error.error;
  if (!isRecord(body) || !isRecord(body['errors'])) {
    return {};
  }

  const errors: CodeFieldErrors = {};
  for (const field of codeFields) {
    const messages = body['errors'][field];
    if (
      Array.isArray(messages) &&
      messages.every((message): message is string => typeof message === 'string')
    ) {
      errors[field] = messages;
    }
  }

  return errors;
}
