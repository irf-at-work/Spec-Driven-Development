import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ListItemService } from '../../api/generated/api/listItem.service';
import { ListItemCreatePage } from './list-item-create-page';

@Component({ standalone: true, template: '<h1>List item details</h1>' })
class DetailsStub {}

describe('ListItemCreatePage', () => {
  it('creates a list item and navigates to its details only after success', async () => {
    const api = {
      apiListItemsPost: vi.fn(({ createListItemRequest }) => of(createListItemRequest)),
    };
    await TestBed.configureTestingModule({
      imports: [ListItemCreatePage],
      providers: [
        provideRouter([
          { path: 'listing-master/new', component: ListItemCreatePage },
          { path: 'listing-master/:liType/:liCode', component: DetailsStub },
        ]),
        { provide: ListItemService, useValue: api },
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/listing-master/new', ListItemCreatePage);
    await harness.fixture.whenStable();

    const inputs = harness.routeNativeElement?.querySelectorAll('input') ?? [];
    const setInput = (name: string, value: string) => {
      const input = harness.routeNativeElement?.querySelector(
        `input[formControlName="${name}"]`,
      ) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setInput('liType', 'COUNTRY');
    setInput('liCode', 'AE');
    setInput('description', 'United Arab Emirates');
    const form = harness.routeNativeElement?.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();

    expect(api.apiListItemsPost).toHaveBeenCalledWith({
      createListItemRequest: expect.objectContaining({
        liType: 'COUNTRY',
        liCode: 'AE',
        description: 'United Arab Emirates',
      }),
    });
    expect(TestBed.inject(Router).url).toBe('/listing-master/COUNTRY/AE');
    expect(harness.routeNativeElement?.textContent).toContain('List item details');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('associates server validation errors with the affected form field', async () => {
    const api = {
      apiListItemsPost: vi.fn(() =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 400,
              error: { errors: { liType: ['The list type is not valid.'] } },
            }),
        ),
      ),
    };
    await TestBed.configureTestingModule({
      imports: [ListItemCreatePage],
      providers: [
        provideRouter([{ path: 'listing-master/new', component: ListItemCreatePage }]),
        { provide: ListItemService, useValue: api },
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/listing-master/new', ListItemCreatePage);
    await harness.fixture.whenStable();

    const setInput = (name: string, value: string) => {
      const input = harness.routeNativeElement?.querySelector(
        `input[formControlName="${name}"]`,
      ) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setInput('liType', 'COUNTRY');
    setInput('liCode', 'AE');
    harness.fixture.detectChanges();
    const form = harness.routeNativeElement?.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    expect(page.validationErrors().liType).toBe('The list type is not valid.');
    expect(harness.routeNativeElement?.textContent).toContain('The list type is not valid.');
    expect(harness.routeNativeElement?.querySelector('[role="alert"]')?.textContent).toContain(
      'highlighted fields',
    );
    expect(api.apiListItemsPost).toHaveBeenCalled();
  });
});
