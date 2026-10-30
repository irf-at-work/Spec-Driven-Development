import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { ApiProblem, ApiProblemError } from '../api-problem';
import { NotificationService } from '../../shared/notifications/notification.service';

/**
 * The one place where failed API calls are handled (constitution B8). It never shows what the server wrote.
 * Instead it shows a fixed plain-English message that says what to do next, and hands the screen an
 * {@link ApiProblemError}. Field messages that the API wrote for the person to read (for example "Make name is
 * required.") are passed to the form, so they appear beside the field they belong to instead of in a pop-up.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notifications = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      return from(readProblem(error)).pipe(
        switchMap((problem) => {
          if (!isShownBesideFields(problem)) {
            notifications.error(plainMessageFor(problem.status));
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
    return 'The record could not be found. It may have been deleted by someone else.';
  }
  if (status === 409) {
    return 'This change conflicts with existing records. Please check the values and try again.';
  }
  return 'A server error occurred. Please try again later.';
}

async function readProblem(response: HttpErrorResponse): Promise<ApiProblem> {
  const status = response.status;
  if (response.error instanceof Blob) {
    try {
      const text = await response.error.text();
      const parsed = JSON.parse(text);
      return parseProblem(status, parsed);
    } catch {
      return fallbackProblem(status);
    }
  }

  if (response.error && typeof response.error === 'object') {
    return parseProblem(status, response.error);
  }

  return fallbackProblem(status);
}

function parseProblem(status: number, data: any): ApiProblem {
  const fieldErrors: Record<string, string[]> = {};
  if (data?.errors && typeof data.errors === 'object') {
    for (const [key, value] of Object.entries(data.errors)) {
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map(String);
      } else if (value) {
        fieldErrors[key] = [String(value)];
      }
    }
  }

  return {
    status,
    fieldErrors,
  };
}

function fallbackProblem(status: number): ApiProblem {
  return {
    status,
    fieldErrors: {},
  };
}
