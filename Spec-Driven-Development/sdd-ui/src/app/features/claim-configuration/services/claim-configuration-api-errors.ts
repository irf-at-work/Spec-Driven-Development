import { HttpErrorResponse } from '@angular/common/http';
import {
  ClaimConfigurationField,
  claimConfigurationFields,
} from '../forms/claim-configuration-form';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function claimConfigurationFieldErrors(
  error: HttpErrorResponse,
): Partial<Record<ClaimConfigurationField, string[]>> {
  const body: unknown = error.error;
  if (!isRecord(body) || !isRecord(body['errors'])) {
    return {};
  }

  const fieldErrors: Partial<Record<ClaimConfigurationField, string[]>> = {};
  for (const field of claimConfigurationFields) {
    const messages = body['errors'][field];
    if (
      Array.isArray(messages) &&
      messages.every((message): message is string => typeof message === 'string')
    ) {
      fieldErrors[field] = messages;
    }
  }

  return fieldErrors;
}

export function claimConfigurationProblemDetail(error: HttpErrorResponse): string | null {
  const body: unknown = error.error;
  if (!isRecord(body)) {
    return null;
  }

  return typeof body['detail'] === 'string' && body['detail'].trim()
    ? body['detail']
    : null;
}
