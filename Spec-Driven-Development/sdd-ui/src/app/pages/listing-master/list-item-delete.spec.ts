import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ListItemService } from '../../api/generated/api/listItem.service';
import { ListItemDetailsPage } from './list-item-details-page';

@Component({ standalone: true, template: '<h1>List item listing</h1>' })
class ListingStub {}

describe('List item deletion', () => {
  const item = { liType: 'COUNTRY', liCode: 'AE', description: 'United Arab Emirates' };

  async function createPage(deleteResult = of(undefined)) {
    const api = {
      apiListItemsLiTypeLiCodeGet: vi.fn(() => of(item)),
      apiListItemsLiTypeLiCodePut: vi.fn(),
      apiListItemsLiTypeLiCodeDelete: vi.fn(() => deleteResult),
    };
    await TestBed.configureTestingModule({
      imports: [ListItemDetailsPage],
      providers: [
        provideRouter([
          { path: 'listing-master', component: ListingStub },
          { path: 'listing-master/:liType/:liCode', component: ListItemDetailsPage },
        ]),
        { provide: ListItemService, useValue: api },
      ],
    }).compileComponents();
    return { api, harness: await RouterTestingHarness.create() };
  }

  it('does not delete when confirmation is cancelled', async () => {
    const { api, harness } = await createPage();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await harness.navigateByUrl('/listing-master/COUNTRY/AE', ListItemDetailsPage);
    await harness.fixture.whenStable();

    const deleteButton = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Delete')) as HTMLButtonElement;
    deleteButton.click();
    expect(confirm).toHaveBeenCalled();
    expect(api.apiListItemsLiTypeLiCodeDelete).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/listing-master/COUNTRY/AE');
    confirm.mockRestore();
  });

  it('returns to the listing after confirmed deletion', async () => {
    const { api, harness } = await createPage();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await harness.navigateByUrl('/listing-master/COUNTRY/AE', ListItemDetailsPage);
    await harness.fixture.whenStable();
    const deleteButton = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Delete')) as HTMLButtonElement;
    deleteButton.click();
    await harness.fixture.whenStable();

    expect(api.apiListItemsLiTypeLiCodeDelete).toHaveBeenCalledWith({
      liType: 'COUNTRY',
      liCode: 'AE',
    });
    expect(TestBed.inject(Router).url).toBe('/listing-master');
    expect(harness.routeNativeElement?.textContent).toContain('List item listing');
  });

  it('shows a reference-conflict explanation and preserves the detail page', async () => {
    const { harness } = await createPage(throwError(() => new HttpErrorResponse({ status: 409 })));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await harness.navigateByUrl('/listing-master/COUNTRY/AE', ListItemDetailsPage);
    await harness.fixture.whenStable();
    const deleteButton = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Delete')) as HTMLButtonElement;
    deleteButton.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/listing-master/COUNTRY/AE');
    expect(harness.routeNativeElement?.querySelector('[role="alert"]')?.textContent).toContain(
      'referenced by other records',
    );
  });
});
