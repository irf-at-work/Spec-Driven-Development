import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyDetailsPage } from './company-details-page';

@Component({ standalone: true, template: '<h1>Company list</h1>' })
class CompanyListStub {}

describe('CompanyDetailsPage deletion', () => {
  const company = {
    companyCode: 'NORTH',
    companyName: 'North Insurance',
    createdBy: 'Admin',
    lastUpdatedBy: 'Admin',
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function createDetails(api: {
    apiCompaniesCompanyCodeGet: ReturnType<typeof vi.fn>;
    apiCompaniesCompanyCodeDelete: ReturnType<typeof vi.fn>;
  }) {
    await TestBed.configureTestingModule({
      imports: [CompanyDetailsPage, CompanyListStub],
      providers: [
        provideRouter([
          { path: 'company-master', component: CompanyListStub },
          { path: 'company-master/:companyCode', component: CompanyDetailsPage },
        ]),
        { provide: CompanyService, useValue: api },
      ],
    }).compileComponents();

    return RouterTestingHarness.create();
  }

  it('presents company details inside a bordered panel', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
    };
    const harness = await createDetails(api);
    await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const panel = harness.routeNativeElement?.querySelector('.details-panel');
    expect(panel).not.toBeNull();
    expect(panel?.querySelector('.company-details dt')?.textContent).toContain('Short name');
  });

  it('does not call the API when the user cancels the confirmation', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    page.deleteCompany();

    expect(api.apiCompaniesCompanyCodeDelete).not.toHaveBeenCalled();
  });

  it('deletes after confirmation and returns to the company list', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    page.deleteCompany();
    await harness.fixture.whenStable();

    expect(api.apiCompaniesCompanyCodeDelete).toHaveBeenCalledWith({ companyCode: 'NORTH' });
    expect(harness.routeNativeElement?.textContent).toContain('Company list');
  });

  it('displays a clear conflict when referenced companies cannot be deleted', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() =>
        throwError(() => new HttpErrorResponse({ status: 409 })),
      ),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    page.deleteCompany();
    await harness.fixture.whenStable();

    expect(page.deleteError()).toBe(
      'This company cannot be deleted because it is used by other records.',
    );
    expect(harness.routeNativeElement?.textContent).toContain('used by other records');
  });
});
