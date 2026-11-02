import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyMasterPage } from './company-master-page';

describe('CompanyMasterPage', () => {
  const response = {
    items: [
      {
        companyCode: 'NORTH',
        companyName: 'North Insurance',
        shortName: 'North',
        primaryAddress: 'Bay Road, Tower 2',
        incorporationDate: '2020-03-05',
        referenceNumber: 'REF-1',
        licenceIssueDate: '2024-01-01',
        licenceExpiryDate: '2027-01-01',
        companyInCharge: 'Alex',
        phone: '123',
        email: 'alex@example.test',
        website: 'north.example.test',
        createdBy: 'Admin',
        lastUpdatedBy: 'Admin',
      },
    ],
    page: 1,
    pageSize: 10,
    totalCount: 1,
  };

  async function createPage(api = { apiCompaniesGet: vi.fn(() => of(response)) }) {
    await TestBed.configureTestingModule({
      imports: [CompanyMasterPage],
      providers: [
        provideRouter([{ path: 'company-master', component: CompanyMasterPage }]),
        { provide: CompanyService, useValue: api },
      ],
    }).compileComponents();

    return {
      api,
      harness: await RouterTestingHarness.create(),
    };
  }

  it('renders the requested columns, company row and history action', async () => {
    const { harness } = await createPage();
    await harness.navigateByUrl('/company-master', CompanyMasterPage);
    await harness.fixture.whenStable();

    const page = harness.routeNativeElement as HTMLElement;
    expect(page.textContent).toContain('North Insurance');
    expect(page.textContent).toContain('Bay Road, Tower 2');
    expect(page.querySelector('[aria-label*="Created by Admin"]')).not.toBeNull();
    expect(page.textContent).toContain('Licence expiry date');
    expect(page.querySelector('[aria-label="Filter by licence expiry date"]')).toBeNull();
    expect(page.textContent).toContain('Email');
    expect(page.querySelector('.column-header-row')).not.toBeNull();
    expect(page.querySelector('.column-header-row')?.textContent?.indexOf('Actions'))
      .toBeGreaterThan(page.querySelector('.column-header-row')?.textContent?.indexOf('Website') ?? -1);
    expect(page.querySelector('.filter-row')).not.toBeNull();
    expect(getComputedStyle(page.querySelector('.column-header-row')!).position).toBe('sticky');
    expect(getComputedStyle(page.querySelector('.filter-row')!).position).toBe('sticky');
    const icons = Array.from(
      page.querySelectorAll('button[mat-icon-button] mat-icon'),
    );
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon.querySelector('svg')).not.toBeNull();
      expect(icon.textContent?.trim()).toBe('');
    }
  });

  it('restores operators, omits default operators, and clears both filter parameters', async () => {
    const { api, harness } = await createPage();
    const page = await harness.navigateByUrl(
      '/company-master?page=2&companyName=North&companyNameOperator=StartsWith&incorporationDate=2020-03-05',
      CompanyMasterPage,
    );
    await harness.fixture.whenStable();

    expect(api.apiCompaniesGet).toHaveBeenLastCalledWith(
      expect.objectContaining({ companyName: 'North', companyNameOperator: 'StartsWith' }),
    );
    expect(page.queryState().companyNameOperator).toBe('StartsWith');
    expect(harness.routeNativeElement?.querySelector('[aria-label="Filter by incorporation date"]')).toBeNull();

    page.setFilter('companyName', { value: 'South', operator: 'Contains' });
    await harness.fixture.whenStable();
    expect(page.queryState().page).toBe(1);
    expect(page.queryState().companyNameOperator).toBeUndefined();
    expect(api.apiCompaniesGet).toHaveBeenLastCalledWith(
      expect.objectContaining({ companyName: 'South' }),
    );
    expect(harness.routeNativeElement?.textContent).not.toContain('Incorporation date filter');

    page.clearFilter('companyName');
    await harness.fixture.whenStable();
    expect(page.queryState().companyName).toBeUndefined();
    expect(page.queryState().companyNameOperator).toBeUndefined();
    expect(api.apiCompaniesGet).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, pageSize: 10 }),
    );
  });

  it('keeps the table and existing rows visible while a filter request is pending', async () => {
    const pendingRequest = new Subject<typeof response>();
    const api = {
      apiCompaniesGet: vi.fn().mockReturnValueOnce(of(response)).mockReturnValue(pendingRequest),
    };
    const { harness } = await createPage(api);
    const page = await harness.navigateByUrl('/company-master', CompanyMasterPage);
    await harness.fixture.whenStable();

    const filter = harness.routeNativeElement?.querySelector(
      '[aria-label="Filter by company name"]',
    );
    if (!(filter instanceof HTMLInputElement)) {
      throw new Error('Company name filter was not rendered as an input.');
    }
    filter.value = 'South';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    await harness.fixture.whenStable();

    const table = harness.routeNativeElement?.querySelector('table[aria-label="Companies"]');
    expect(page.loading()).toBe(true);
    expect(table).not.toBeNull();
    expect(table?.textContent).toContain('North Insurance');
    expect(harness.routeNativeElement?.querySelector('[role="status"]')?.textContent).not.toContain(
      'Loading companies',
    );

    pendingRequest.next({ items: [], page: 1, pageSize: 10, totalCount: 0 });
    pendingRequest.complete();
    await harness.fixture.whenStable();

    expect(page.loading()).toBe(false);
    expect(harness.routeNativeElement?.querySelector('table[aria-label="Companies"]')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelectorAll('.company-row')).toHaveLength(0);
  });

  it('restores query filters and pagination and updates them when a filter changes', async () => {
    const { api, harness } = await createPage();
    const page = await harness.navigateByUrl(
      '/company-master?page=2&pageSize=10&sortBy=companyName&sortDirection=desc&companyName=North',
      CompanyMasterPage,
    );
    await harness.fixture.whenStable();

    expect(page.queryState().page).toBe(2);
    expect(page.queryState().companyName).toBe('North');
    expect(api.apiCompaniesGet).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, sortDirection: 'desc', companyName: 'North' }),
    );

    const filterElement = harness.routeNativeElement?.querySelector(
      '[aria-label="Filter by company name"]',
    );
    if (!(filterElement instanceof HTMLInputElement)) {
      throw new Error('Company name filter was not rendered as an input.');
    }
    const filter = filterElement;
    filter.value = 'South';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    await harness.fixture.whenStable();

    expect(page.queryState().page).toBe(1);
    expect(page.queryState().companyName).toBe('South');

    page.setSort({ active: 'companyName', direction: 'desc' });
    await harness.fixture.whenStable();
    expect(page.queryState().sortBy).toBe('companyName');
    expect(page.queryState().sortDirection).toBe('desc');

    page.setPage({ pageIndex: 2, pageSize: 25, length: 100 });
    await harness.fixture.whenStable();
    expect(page.queryState().page).toBe(3);
    expect(page.queryState().pageSize).toBe(25);
  });

  it('shows an explicit empty state when the API returns no companies', async () => {
    const { harness } = await createPage({
      apiCompaniesGet: vi.fn(() => of({ items: [], page: 1, pageSize: 10, totalCount: 0 })),
    });
    await harness.navigateByUrl('/company-master', CompanyMasterPage);
    await harness.fixture.whenStable();

    const page = harness.routeNativeElement;
    expect(page?.textContent).toContain('No companies found.');
    expect(page?.querySelector('table[aria-label="Companies"]')).not.toBeNull();
    expect(page?.querySelectorAll('.company-row')).toHaveLength(0);
  });

  it('shows a clear error instead of a successful empty state when the API fails', async () => {
    const { harness } = await createPage({
      apiCompaniesGet: vi.fn(() => throwError(() => new Error('network failure'))),
    });
    await harness.navigateByUrl('/company-master', CompanyMasterPage);
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain(
      'Companies could not be loaded. Please try again.',
    );
  });
});
