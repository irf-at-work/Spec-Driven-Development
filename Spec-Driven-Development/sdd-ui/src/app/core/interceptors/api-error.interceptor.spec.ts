import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { vi } from 'vitest';
import { ApiProblemError } from '../api-problem';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  const snackBar = { open: vi.fn() };
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    snackBar.open.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  function outcomeOf(request: Observable<unknown>): Promise<unknown> {
    return new Promise((resolve) =>
      request.subscribe({ next: () => resolve(undefined), error: (error: unknown) => resolve(error) }),
    );
  }

  async function expectProblem(outcome: Promise<unknown>): Promise<ApiProblemError> {
    const error = await outcome;
    if (!(error instanceof ApiProblemError)) {
      throw new Error('Expected an ApiProblemError.');
    }
    return error;
  }

  it('passes the API field messages to the form and shows no pop-up for a duplicate code', async () => {
    const outcome = outcomeOf(http.get('/x'));
    controller.expectOne('/x').flush(
      { errors: { makeCode: ['This make code already exists.'] } },
      { status: 409, statusText: 'Conflict' },
    );

    const error = await expectProblem(outcome);

    expect(error.problem.status).toBe(409);
    expect(error.problem.fieldErrors['makeCode']).toEqual(['This make code already exists.']);
    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('reads field messages from a Blob body, which is how the generated client receives responses', async () => {
    const outcome = outcomeOf(http.get('/x', { responseType: 'blob' }));
    const body = new Blob([JSON.stringify({ errors: { makeName: ['Make name is required.'] } })]);
    controller.expectOne('/x').flush(body, { status: 400, statusText: 'Bad Request' });

    const error = await expectProblem(outcome);

    expect(error.problem.fieldErrors['makeName']).toEqual(['Make name is required.']);
    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('shows a fixed plain message for a server fault and never the text the server sent', async () => {
    const outcome = outcomeOf(http.get('/x'));
    controller.expectOne('/x').flush(
      { detail: 'ORA-12345: secret database detail' },
      { status: 500, statusText: 'Server Error' },
    );

    const error = await expectProblem(outcome);

    expect(error.problem.fieldErrors).toEqual({});
    const message = String(snackBar.open.mock.calls[0][0]);
    expect(message).toContain('Something went wrong');
    expect(message).not.toContain('ORA-');
  });

  it('explains a missing record and tells the user what to do next', async () => {
    const outcome = outcomeOf(http.get('/x'));
    controller.expectOne('/x').flush({}, { status: 404, statusText: 'Not Found' });

    await expectProblem(outcome);

    expect(String(snackBar.open.mock.calls[0][0])).toContain('Go back to the list');
  });

  it('says the server cannot be reached when there is no response at all', async () => {
    const outcome = outcomeOf(http.get('/x'));
    controller.expectOne('/x').error(new ProgressEvent('error'));

    const error = await expectProblem(outcome);

    expect(error.problem.status).toBe(0);
    expect(String(snackBar.open.mock.calls[0][0])).toContain('could not reach the server');
  });
});
