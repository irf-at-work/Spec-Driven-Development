import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyForm } from './company-form';

@Component({ standalone: true, template: '<h1>Company listing</h1>' })
class CompanyListStub {}

describe('CompanyForm', () => {
  const company = {
    companyCode: 'NORTH',
    companyName: 'North Insurance',
    shortName: 'North',
    address1: 'Bay Road',
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
  };

  async function createForm(
    api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesPost: vi.fn(() => of(company)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    },
  ) {
    await TestBed.configureTestingModule({
      imports: [CompanyForm],
      providers: [
        provideRouter([
          { path: 'company-master', component: CompanyListStub },
          { path: 'company-master/new', component: CompanyForm },
        ]),
        { provide: CompanyService, useValue: api },
      ],
    }).compileComponents();

    return {
      api,
      harness: await RouterTestingHarness.create(),
    };
  }

  it('prefills the short name from the first 30 characters and permits an override', async () => {
    const { harness } = await createForm();
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);

    form.form.controls.companyName.setValue('A company name that is longer than thirty characters');
    expect(form.form.controls.shortName.value).toBe('A company name that is longer ');

    form.form.controls.shortName.setValue('Custom');
    form.form.controls.companyName.setValue('Another company name');
    expect(form.form.controls.shortName.value).toBe('Custom');
  });

  it('validates required fields and all configured maximum lengths', async () => {
    const { harness } = await createForm();
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);

    expect(form.form.controls.companyCode.errors?.['required']).toBeTruthy();
    expect(form.form.controls.companyName.errors?.['required']).toBeTruthy();
    form.form.controls.companyCode.setValue('1234567890123');
    form.form.controls.companyName.setValue('n'.repeat(101));
    form.form.controls.shortName.setValue('s'.repeat(31));
    form.form.controls.address1.setValue('a'.repeat(101));
    form.form.controls.address2.setValue('b'.repeat(101));
    form.form.controls.address3.setValue('c'.repeat(101));
    form.form.controls.referenceNumber.setValue('r'.repeat(21));
    form.form.controls.companyInCharge.setValue('i'.repeat(61));
    form.form.controls.phone.setValue('p'.repeat(11));
    form.form.controls.email.setValue('e'.repeat(101));
    form.form.controls.website.setValue('w'.repeat(101));

    expect(form.form.invalid).toBe(true);
    for (const controlName of [
      'companyCode',
      'companyName',
      'shortName',
      'address1',
      'address2',
      'address3',
      'referenceNumber',
      'companyInCharge',
      'phone',
      'email',
      'website',
    ] as const) {
      expect(form.form.controls[controlName].errors?.['maxlength']).toBeTruthy();
    }
  });

  it('accepts only an optional exact 10-digit phone number', async () => {
    const { harness } = await createForm();
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);
    const phone = form.form.controls.phone;

    phone.setValue('1234567890');
    expect(phone.valid).toBe(true);

    for (const value of ['123456789', '12345678901', '12345abcde', '123-456-789']) {
      phone.setValue(value);
      expect(phone.invalid).toBe(true);
    }

    phone.setValue('');
    expect(phone.valid).toBe(true);
  });

  it('returns to the company listing when creation is canceled', async () => {
    const { harness } = await createForm();
    await harness.navigateByUrl('/company-master/new', CompanyForm);
    await harness.fixture.whenStable();

    const cancelButton = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Cancel');
    if (!cancelButton) {
      throw new Error('Cancel button was not rendered.');
    }

    cancelButton.click();
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain('Company listing');
  });

  it('parses typed DD-MM-YYYY dates and serializes them as date-only values', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesPost: vi.fn(() => of(company)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const { harness } = await createForm(api);
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);
    const dateInput = harness.routeNativeElement?.querySelector(
      '[formControlName="incorporationDate"]',
    );
    if (!(dateInput instanceof HTMLInputElement)) {
      throw new Error('Incorporation date input was not rendered.');
    }

    dateInput.value = '09-01-2024';
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    await harness.fixture.whenStable();

    expect(form.form.controls.incorporationDate.value).toEqual(new Date(2024, 0, 9));
    form.form.controls.companyCode.setValue('NORTH');
    form.form.controls.companyName.setValue('North');
    form.save();

    expect(api.apiCompaniesPost).toHaveBeenCalledWith({
      createCompanyRequest: expect.objectContaining({ incorporationDate: '2024-01-09' }),
    });
  });

  it('focuses the first invalid field and associates duplicate-code errors with the code field', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesPost: vi.fn(() =>
        throwError(() => new HttpErrorResponse({ status: 409, error: { title: 'Conflict' } })),
      ),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const { harness } = await createForm(api);
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);
    const firstField = harness.routeNativeElement?.querySelector('[formControlName="companyCode"]');
    expect(firstField).not.toBeNull();
    const focus = vi.spyOn(firstField as HTMLElement, 'focus');

    await form.save();
    expect(focus).toHaveBeenCalled();

    form.form.controls.companyCode.setValue('NORTH');
    form.form.controls.companyName.setValue('North');
    await form.save();
    await harness.fixture.whenStable();

    expect(form.form.controls.companyCode.errors?.['duplicate']).toBeTruthy();
  });
});
