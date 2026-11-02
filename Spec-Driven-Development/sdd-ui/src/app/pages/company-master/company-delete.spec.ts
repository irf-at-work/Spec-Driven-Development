import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
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
    shortName: 'North',
    phone: '555-OLD',
    createdBy: 'Admin',
    lastUpdatedBy: 'Admin',
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function createDetails(  api: {
    apiCompaniesCompanyCodeGet: ReturnType<typeof vi.fn>;
    apiCompaniesCompanyCodeDelete: ReturnType<typeof vi.fn>;
    apiCompaniesCompanyCodePut: ReturnType<typeof vi.fn>;
  }) {
    await TestBed.configureTestingModule({
      imports: [CompanyDetailsPage, CompanyListStub],
      providers: [
        provideRouter([
          { path: 'company-master', component: CompanyListStub },
          {
            path: 'company-master/:companyCode/edit',
            component: CompanyDetailsPage,
            data: { startInEditMode: true },
          },
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
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const harness = await createDetails(api);
    await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const panel = harness.routeNativeElement?.querySelector('.details-panel');
    expect(panel).not.toBeNull();
    expect(
      Array.from(panel?.querySelectorAll('.company-details dt, .read-field span') ?? []).some((label) =>
        label.textContent?.includes('Short name'),
      ),
    ).toBe(true);
  });

  it('does not call the API when the user cancels the confirmation', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
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
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
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
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
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

  it('edits fields in place while keeping company code view-only', async () => {
    const updated = { ...company, companyName: 'North Mutual', phone: '1234567890' };
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(updated)),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();
    const panel = harness.routeNativeElement?.querySelector('.details-panel');

    page.startEditing();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('.details-panel')).toBe(panel);
    expect(page.form.controls.companyName.enabled).toBe(true);
    expect(page.form.controls.phone.value).toBe('555-OLD');
    expect(page.form.controls.phone.valid).toBe(true);
    expect(harness.routeNativeElement?.querySelector('[formControlName="companyCode"]')).toBeNull();

    page.form.controls.companyName.setValue('North Mutual');
    page.form.controls.phone.setValue('1234567890');
    page.save();
    await harness.fixture.whenStable();

    expect(api.apiCompaniesCompanyCodePut).toHaveBeenCalledWith(
      expect.objectContaining({
        companyCode: 'NORTH',
        updateCompanyRequest: expect.objectContaining({
          companyName: 'North Mutual',
          phone: '1234567890',
        }),
      }),
    );
    expect(page.editing()).toBe(false);
    expect(page.company()?.companyName).toBe('North Mutual');
  });

  it('opens direct edit links in the same inline layout and cancels back to details', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH/edit?page=2', CompanyDetailsPage);
    await harness.fixture.whenStable();

    expect(page.editing()).toBe(true);
    expect(harness.routeNativeElement?.querySelector('.details-panel')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('[formControlName="companyCode"]')).toBeNull();

    page.cancelEditing();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/company-master/NORTH?page=2');
    expect(page.editing()).toBe(false);
  });

  it('rejects invalid phone edits but permits an unchanged legacy value', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.startEditing();
    expect(page.form.controls.phone.valid).toBe(true);
    page.form.controls.phone.setValue('123ABC');
    page.save();
    harness.detectChanges();

    expect(api.apiCompaniesCompanyCodePut).not.toHaveBeenCalled();
    expect(harness.routeNativeElement?.textContent).toContain('Enter a 10-digit phone number.');
  });

  it('keeps the inline editor visible when the API rejects an update', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesCompanyCodeDelete: vi.fn(() => of(null)),
      apiCompaniesCompanyCodePut: vi.fn(() =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 400,
              error: { errors: { Phone: ['Phone number must contain exactly 10 digits.'] } },
            }),
        ),
      ),
    };
    const harness = await createDetails(api);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.startEditing();
    page.form.controls.phone.setValue('1234567890');
    page.save();
    await harness.fixture.whenStable();

    expect(page.editing()).toBe(true);
    expect(harness.routeNativeElement?.querySelector('.details-panel')).not.toBeNull();
    expect(harness.routeNativeElement?.textContent).toContain('Please correct the highlighted fields.');
  });
});
