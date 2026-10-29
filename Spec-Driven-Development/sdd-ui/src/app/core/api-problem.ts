/**
 * What the screens need to know about a failed API call. The interceptor builds it from the HTTP response,
 * so no component ever reads a raw server response.
 */
export interface ApiProblem {
  readonly status: number;
  /**
   * Field-level messages written by the API itself in plain English (for example "Make name is required."),
   * keyed by form field name. Nothing else from the server is ever shown to the user.
   */
  readonly fieldErrors: Readonly<Record<string, readonly string[]>>;
}

export class ApiProblemError extends Error {
  constructor(readonly problem: ApiProblem) {
    super(`The API request failed with status ${problem.status}.`);
    this.name = 'ApiProblemError';
  }
}

export function isApiProblemError(error: unknown): error is ApiProblemError {
  return error instanceof ApiProblemError;
}
