import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ListItemService } from '../../api/generated/api/listItem.service';
import { ListingMasterPage } from './listing-master-page';

@Component({ standalone: true, template: '<h1>List item details</h1>' })
class DetailsStub {}

describe('ListingMasterPage', () => {
  const response = {
    items: [
      {
        liType: 'COUNTRY',
        liCode: 'AE',
        description: 'United Arab Emirates',
        shortDescription: 'UAE',
        value: '971',
        activeYn: 'Y',
        createdBy: 'Admin',
        lastUpdatedBy: 'Editor',
      },
    ],
    page: 1,
    pageSize: 10,
    totalCount: 1,
  };

  async function createPage(api = { apiListItemsGet: vi.fn(() => of(response)) }) {
    await TestBed.configureTestingModule({
      imports: [ListingMasterPage],
      providers: [
        provideRouter([
          { path: 'listing-master', component: ListingMasterPage },
          { path: 'listing-master/:liType/:liCode', component: DetailsStub },
        ]),
        { provide: ListItemService, useValue: api },
      ],
    }).compileComponents();
    return { api, harness: await RouterTestingHarness.create() };
  }

  it('loads and displays list fields and audit history action', async () => {
    const { harness } = await createPage();
    await harness.navigateByUrl('/listing-master', ListingMasterPage);
    await harness.fixture.whenStable();

    const root = harness.routeNativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('List Item Master');
    expect(root.querySelector('a[routerLink="/listing-master/new"] mat-icon svg')).not.toBeNull();
    expect(
      root.querySelector('a[routerLink="/listing-master/new"] mat-icon')?.textContent?.trim(),
    ).toBe('');
    expect(root.textContent).toContain('United Arab Emirates');
    expect(root.textContent).toContain('COUNTRY');
    expect(root.textContent).toContain('AE');
    expect(root.textContent).toContain('971');
    expect(root.textContent).toContain('Active');
    expect(root.querySelector('[aria-label*="Created by Admin"]')).not.toBeNull();
  });

  it('restores query filters and applies sort and pagination changes', async () => {
    const { api, harness } = await createPage();
    const page = await harness.navigateByUrl(
      '/listing-master?page=2&pageSize=25&liType=COUNTRY&liTypeOperator=Equals&sortBy=liCode&sortDirection=desc',
      ListingMasterPage,
    );
    await harness.fixture.whenStable();

    expect(api.apiListItemsGet).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 2,
        pageSize: 25,
        liType: 'COUNTRY',
        liTypeOperator: 'Equals',
        sortBy: 'liCode',
        sortDirection: 'desc',
      }),
    );
    expect(page.filterValue('liType')).toBe('COUNTRY');
    page.setSort({ active: 'description', direction: 'asc' });
    await harness.fixture.whenStable();
    expect(page.queryState().sortBy).toBe('description');
    page.setPage({ pageIndex: 2, pageSize: 10, length: 60 });
    await harness.fixture.whenStable();
    expect(page.queryState().page).toBe(3);
    expect(page.queryState().pageSize).toBe(10);
  });

  it('shows an actionable load error and an empty state for an empty response', async () => {
    const failed = await createPage({
      apiListItemsGet: vi.fn(() => throwError(() => new Error('network error'))),
    });
    await failed.harness.navigateByUrl('/listing-master', ListingMasterPage);
    await failed.harness.fixture.whenStable();
    expect(
      failed.harness.routeNativeElement?.querySelector('[role="alert"]')?.textContent,
    ).toContain('Please try again');

    TestBed.resetTestingModule();
    const empty = await createPage({
      apiListItemsGet: vi.fn(() => of({ items: [], page: 1, pageSize: 10, totalCount: 0 })),
    });
    await empty.harness.navigateByUrl('/listing-master', ListingMasterPage);
    await empty.harness.fixture.whenStable();
    expect(empty.harness.routeNativeElement?.textContent).toContain('No list items found.');
  });
});
