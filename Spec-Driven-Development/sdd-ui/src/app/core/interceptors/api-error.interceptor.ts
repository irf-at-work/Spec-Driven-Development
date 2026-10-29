import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { ApiProblem, ApiProblemError } from '../api-problem';

const MESSAGE_DURATION_MS = 8000;

/**
 * The one place where failed API calls are handled (constitution B8). It never shows what the server wrote.
 * Instead it shows a fixed plain-English message that says what to do next, and hands the screen an
 * {@link ApiProblemError}. Field messages that the API wrote for the person to read (for example "Make name is
 * required.") are passed to the form, so they appear beside the field they belong to instead of in a pop-up.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      return from(readProblem(error)).pipe(
        switchMap((problem) => {
          if (!isShownBesideFields(problem)) {
            snackBar.open(plainMessageFor(problem.status), 'Close', { duration: MESSAGE_DURATION_MS });
          }
          return throwError(() => new ApiProblemError(problem));
        }),
      );
    }),
  );
};

function isShownBesideFields(problem: ApiProblem): boolean {
  const isFieldProblem = problem.status === 400 || problem.status === 409;
  return isFieldProblem && Object.keys(problem.fieldErrors).length > 0;
}

function plainMessageFor(status: number): string {
  if (status === 0) {
    return 'We could not reach the server. Check that the API is running, then try again.';
  }
  if (status === 400) {
    return 'Some values were not accepted. Please check what you entered and try again.';
  }
  if (status === 404) {
    return 'That record could not be found. It may have been deleted. Go back to the list and try again.';
  }
  if (status >= 500) {
    return 'Something went wrong on the server. Please try again, and contact support if it keeps happening.';
  }
  return 'The request could not be completed. Please try again.';
}

async function readProblem(error: HttpErrorResponse): Promise<ApiProblem> {
  const body = await readBody(error.error);
  return { status: error.status, fieldErrors: extractFieldErrors(body) };
}

// The generated client asks for the response as a Blob, so an error body can arrive as a Blob, a string or an object.
async function readBody(body: unknown): Promise<unknown> {
  try {
    if (body instanceof Blob) {
      return JSON.parse(await body.text());
    }
    if (typeof body === 'string') {
      return JSON.parse(body);
    }
    return body;
  } catch {
    return undefined;
  }
}

function extractFieldErrors(body: unknown): Record<string, string[]> {
  if (!isRecord(body)) {
    return {};
  }
  const errors = body['errors'];
  if (!isRecord(errors)) {
    return {};
  }

  const fieldErrors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      const texts = messages.filter((message): message is string => typeof message === 'string');
      if (texts.length > 0) {
        fieldErrors[field] = texts;
      }
    }
  }
  return fieldErrors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
