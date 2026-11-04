import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyStructureService } from '../../api/generated/api/companyStructure.service';
import { CompanyForm } from './company-form';

@Component({ standalone: true, template: '<h1>Company listing</h1>' })
class CompanyListStub {}

@Component({ standalone: true, template: '<h1>Company details destination</h1>' })
class CompanyDetailsStub {}

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
    structureApi: object = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    },
  ) {
    await TestBed.configureTestingModule({
      imports: [CompanyForm],
      providers: [
        provideRouter([
          { path: 'company-master', component: CompanyListStub },
          { path: 'company-master/new', component: CompanyForm },
          { path: 'company-master/:companyCode', component: CompanyDetailsStub },
        ]),
        { provide: CompanyService, useValue: api },
        { provide: CompanyStructureService, useValue: structureApi },
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

  it('clears unsaved company values when Reset is selected', async () => {
    const { harness } = await createForm();
    await harness.navigateByUrl('/company-master/new', CompanyForm);
    await harness.fixture.whenStable();

    const cancelButton = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Reset');
    if (!cancelButton) {
      throw new Error('Reset button was not rendered.');
    }

    const form = harness.routeDebugElement?.componentInstance as CompanyForm;
    form.form.controls.companyCode.setValue('NORTH');
    cancelButton.click();
    await harness.fixture.whenStable();

    expect(form.form.controls.companyCode.value).toBe('');
  });

  it('shows the three-step progress indicator and saves company details before opening Division', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesPost: vi.fn(() => of(company)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const { harness } = await createForm(api);
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);
    form.form.controls.companyCode.setValue('NORTH');
    form.form.controls.companyName.setValue('North');

    expect(form.step()).toBe('basic');
    expect(
      Array.from(harness.routeNativeElement?.querySelectorAll('[data-step]') ?? []).map((step) =>
        step.textContent?.trim().replace(/\s+/g, ' '),
      ),
    ).toEqual(['1 Basic details', '2 Division', '3 Department']);
    form.saveAndAddDivision();
    await harness.fixture.whenStable();

    expect(api.apiCompaniesPost).toHaveBeenCalledOnce();
    expect(form.step()).toBe('division');
    expect(form.companyCode()).toBe('NORTH');
  });

  it('keeps entered division values and remains on the step when its save fails', async () => {
    const structureApi = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(() =>
        throwError(() => new HttpErrorResponse({ status: 500 })),
      ),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    };
    const { harness } = await createForm(undefined, structureApi);
    const form = await harness.navigateByUrl(
      '/company-master/new?step=division&companyCode=NORTH',
      CompanyForm,
    );
    form.divisionForms.at(0).controls.divisionCode.setValue('WEST');
    form.divisionForms.at(0).controls.name.setValue('Western Office');

    form.saveDivisionAndAddDepartment();
    await harness.fixture.whenStable();

    expect(form.step()).toBe('division');
    expect(form.divisionForms.at(0).controls.name.value).toBe('Western Office');
    expect(form.error()).toContain('could not be saved');
  });

  it('updates saved divisions and the company when returning to Basic details', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesPost: vi.fn(() => of(company)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const structureApi = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(({ createDivisionsRequest }) =>
        of(createDivisionsRequest.divisions),
      ),
      apiCompaniesCompanyCodeDivisionsDivisionCodePut: vi.fn(({ updateDivisionRequest }) =>
        of(updateDivisionRequest),
      ),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    };
    const { harness } = await createForm(api, structureApi);
    const form = await harness.navigateByUrl('/company-master/new', CompanyForm);
    form.form.controls.companyCode.setValue('NORTH');
    form.form.controls.companyName.setValue('North');
    form.saveAndAddDivision();
    await harness.fixture.whenStable();

    form.divisionForms.at(0).controls.divisionCode.setValue('WEST');
    form.divisionForms.at(0).controls.name.setValue('Western Office');
    form.saveDivisionAndAddDepartment();
    await harness.fixture.whenStable();
    expect(form.savedDivisionCodes().has('WEST')).toBe(true);

    form.backToDivision();
    await harness.fixture.whenStable();
    form.divisionForms.at(0).controls.name.setValue('Western Hub');
    form.saveDivisionAndAddDepartment();
    await harness.fixture.whenStable();

    expect(structureApi.apiCompaniesCompanyCodeDivisionsPost).toHaveBeenCalledOnce();
    expect(structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodePut).toHaveBeenCalledWith(
      expect.objectContaining({
        companyCode: 'NORTH',
        divisionCode: 'WEST',
        updateDivisionRequest: expect.objectContaining({ name: 'Western Hub' }),
      }),
    );

    const backToDivision = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Back to Division'));
    if (!(backToDivision instanceof HTMLButtonElement)) {
      throw new Error('Back to Division button was not rendered.');
    }
    backToDivision.click();
    await harness.fixture.whenStable();

    const backToBasic = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Back to Basic details'));
    if (!(backToBasic instanceof HTMLButtonElement)) {
      throw new Error('Back to Basic details button was not rendered.');
    }
    backToBasic.click();
    await harness.fixture.whenStable();
    expect(form.companyCode()).toBe('NORTH');
    expect(form.divisionForms.length).toBe(1);
    form.form.controls.shortName.setValue('North Mutual');
    form.saveAndAddDivision();
    await harness.fixture.whenStable();

    expect(api.apiCompaniesPost).toHaveBeenCalledOnce();
    expect(api.apiCompaniesCompanyCodePut).toHaveBeenCalledWith(
      expect.objectContaining({
        companyCode: 'NORTH',
        updateCompanyRequest: expect.objectContaining({ shortName: 'North Mutual' }),
      }),
    );
    expect(form.step()).toBe('division');
  });

  it('renders multiple Division and Department expansion panels open at once', async () => {
    const structureApi = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    };
    const { harness } = await createForm(undefined, structureApi);
    const form = await harness.navigateByUrl(
      '/company-master/new?step=division&companyCode=NORTH',
      CompanyForm,
    );
    await harness.fixture.whenStable();
    expect(form.divisionForms.length).toBe(1);
    expect(
      harness.routeNativeElement
        ?.querySelector('mat-expansion-panel-header')
        ?.getAttribute('aria-expanded'),
    ).toBe('true');
    const addButton = (text: string): HTMLButtonElement => {
      const button = Array.from(harness.routeNativeElement?.querySelectorAll('button') ?? []).find(
        (candidate) => candidate.textContent?.trim() === text,
      );
      if (!(button instanceof HTMLButtonElement)) {
        throw new Error(`${text} button was not rendered.`);
      }
      return button;
    };

    addButton('Add new division').click();
    harness.fixture.detectChanges();
    addButton('Add new division').click();
    harness.fixture.detectChanges();

    const divisionHeaders = harness.routeNativeElement?.querySelectorAll(
      'mat-expansion-panel-header',
    );
    expect(divisionHeaders).toHaveLength(3);
    expect(
      Array.from(divisionHeaders ?? []).every(
        (header) => header.getAttribute('aria-expanded') === 'true',
      ),
    ).toBe(true);
    divisionHeaders?.[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    harness.fixture.detectChanges();
    expect(divisionHeaders?.[0].getAttribute('aria-expanded')).toBe('false');
    expect(divisionHeaders?.[1].getAttribute('aria-expanded')).toBe('true');
    expect(divisionHeaders?.[2].getAttribute('aria-expanded')).toBe('true');

    for (const division of form.divisionForms.controls) {
      division.controls.divisionCode.setValue(
        `CODE${form.divisionForms.controls.indexOf(division)}`,
      );
      division.controls.name.setValue('Division');
    }
    form.saveDivisionAndAddDepartment();
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    addButton('Add new department').click();
    harness.fixture.detectChanges();
    const departmentHeaders = harness.routeNativeElement?.querySelectorAll(
      'mat-expansion-panel-header',
    );
    expect(departmentHeaders?.length).toBeGreaterThan(1);
    expect(
      Array.from(departmentHeaders ?? []).every(
        (header) => header.getAttribute('aria-expanded') === 'true',
      ),
    ).toBe(true);
    expect(
      harness.routeNativeElement?.querySelector(
        'mat-expansion-panel-header .setup-card-actions .destructive-action',
      ),
    ).not.toBeNull();
  });

  it('discards unsaved department data and navigates to company details on Exit', async () => {
    const api = {
      apiCompaniesCompanyCodeGet: vi.fn(() => of(company)),
      apiCompaniesPost: vi.fn(() => of(company)),
      apiCompaniesCompanyCodePut: vi.fn(() => of(company)),
    };
    const structureApi = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    };
    const { harness } = await createForm(api, structureApi);
    const form = await harness.navigateByUrl(
      '/company-master/new?step=department&companyCode=NORTH',
      CompanyForm,
    );
    await harness.fixture.whenStable();
    form.departmentForms.at(0).controls.departmentCode.setValue('OPS');
    form.departmentForms.at(0).controls.name.setValue('Unsaved Operations');

    const exitButton = Array.from(
      harness.routeNativeElement?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Exit') as HTMLButtonElement;
    exitButton.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/company-master/NORTH');
    expect(harness.routeNativeElement?.textContent).toContain('Company details destination');
    expect(structureApi.apiCompaniesCompanyCodeDepartmentsPost).not.toHaveBeenCalled();
  });

  it('clears setup parameters when returning from company setup to the grid', async () => {
    const { harness } = await createForm();
    await harness.navigateByUrl(
      '/company-master/new?step=department&companyCode=NORTH&page=2',
      CompanyForm,
    );
    await harness.fixture.whenStable();

    const backLink = harness.routeNativeElement?.querySelector(
      'a[routerLink="/company-master"]',
    ) as HTMLAnchorElement;
    backLink.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/company-master?page=2');
    expect(harness.routeNativeElement?.textContent).toContain('Company listing');
  });

  it('loads one department entry form and the current company division options', async () => {
    const structureApi = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() =>
        of([{ divisionCode: 'WEST', name: 'Western Office' }]),
      ),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    };
    const { harness } = await createForm(undefined, structureApi);
    const form = await harness.navigateByUrl(
      '/company-master/new?step=department&companyCode=NORTH',
      CompanyForm,
    );
    await harness.fixture.whenStable();

    expect(form.step()).toBe('department');
    expect(form.departmentForms.length).toBe(1);
    expect(form.divisionOptions().map((division) => division.divisionCode)).toEqual(['WEST']);
  });

  it('resets only the current structure step without clearing previously saved company context', async () => {
    const structureApi = {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(() => of({})),
    };
    const { harness } = await createForm(undefined, structureApi);
    const form = await harness.navigateByUrl(
      '/company-master/new?step=division&companyCode=NORTH',
      CompanyForm,
    );
    form.addDivision();
    form.divisionForms.at(0).controls.name.setValue('Unsaved');

    form.resetStep();

    expect(form.step()).toBe('division');
    expect(form.companyCode()).toBe('NORTH');
    expect(form.divisionForms.length).toBe(0);
    expect(structureApi.apiCompaniesCompanyCodeDivisionsPost).not.toHaveBeenCalled();
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
