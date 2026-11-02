import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyStructureService } from '../../api/generated/api/companyStructure.service';
import { CompanyDetailsPage } from './company-details-page';

@Component({ standalone: true, template: '<h1>Company listing</h1>' })
class CompanyListStub {}

describe('CompanyDetailsPage structure', () => {
  const company = {
    companyCode: 'NORTH',
    companyName: 'North Insurance',
    shortName: 'North',
    createdBy: 'Admin',
    lastUpdatedBy: 'Admin',
  };
  const divisions = [
    {
      divisionCode: 'WEST',
      name: 'Western Office',
      departments: [{ departmentCode: 'FIN', name: 'Finance', divisionCodes: ['WEST'] }],
    },
    {
      divisionCode: 'EAST',
      name: 'Eastern Office',
      departments: [{ departmentCode: 'IT', name: 'Information Technology', divisionCodes: ['EAST'] }],
    },
  ];

  function createStructureApi() {
    return {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of(divisions)),
      apiCompaniesCompanyCodeDivisionsDivisionCodePut: vi.fn(({ updateDivisionRequest }) =>
        of({ ...divisions[0], ...updateDivisionRequest }),
      ),
      apiCompaniesCompanyCodeDepartmentsGet: vi.fn(() =>
        of([
          { departmentCode: 'FIN', name: 'Finance', divisionCodes: ['WEST'] },
          { departmentCode: 'HR', name: 'Human Resources', divisionCodes: ['EAST'] },
        ]),
      ),
      apiCompaniesCompanyCodeDepartmentsPost: vi.fn(({ createDepartmentRequest }) =>
        of({ ...createDepartmentRequest }),
      ),
      apiCompaniesCompanyCodeDivisionsDivisionCodeDepartmentsPost: vi.fn(() => of([])),
      apiCompaniesCompanyCodeDivisionsDivisionCodeDepartmentsDepartmentCodeDelete: vi.fn(() =>
        of(undefined),
      ),
      apiCompaniesCompanyCodeDivisionsDivisionCodeDelete: vi.fn(() => of(undefined)),
    };
  }

  async function createPage(structureApi = createStructureApi()) {
    await TestBed.configureTestingModule({
      imports: [CompanyDetailsPage],
      providers: [
        provideRouter([
          { path: 'company-master', component: CompanyListStub },
          { path: 'company-master/:companyCode', component: CompanyDetailsPage },
        ]),
        { provide: CompanyService, useValue: { apiCompaniesCompanyCodeGet: vi.fn(() => of(company)) } },
        { provide: CompanyStructureService, useValue: structureApi },
      ],
    }).compileComponents();

    return {
      structureApi,
      harness: await RouterTestingHarness.create(),
    };
  }

  it('loads company divisions and nested department data without replacing company details', async () => {
    const { harness, structureApi } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    expect(page.company()?.companyName).toBe('North Insurance');
    expect(page.divisions().map((division) => division.divisionCode)).toEqual(['WEST', 'EAST']);
    expect(structureApi.apiCompaniesCompanyCodeDivisionsGet).toHaveBeenCalledWith({
      companyCode: 'NORTH',
    });
    expect(harness.routeNativeElement?.textContent).toContain('Finance');
  });

  it('collapses a division card while keeping its name available', async () => {
    const { harness } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.toggleDivision('WEST');
    harness.fixture.detectChanges();

    expect(page.isDivisionCollapsed('WEST')).toBe(true);
    expect(harness.routeNativeElement?.textContent).toContain('Western Office');
    expect(harness.routeNativeElement?.textContent).not.toContain('Finance');
  });

  it('renders the empty state when no divisions are returned', async () => {
    const emptyStructureApi = createStructureApi();
    emptyStructureApi.apiCompaniesCompanyCodeDivisionsGet = vi.fn(() => of([]));
    const { harness } = await createPage(emptyStructureApi);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    expect(page.divisions()).toEqual([]);
    expect(harness.routeNativeElement?.textContent).toContain(
      'No divisions have been added to this company yet.',
    );
  });

  it('edits division details in place and preserves the form when update fails', async () => {
    const structureApi = createStructureApi();
    structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodePut = vi
      .fn()
      .mockReturnValueOnce(of({ ...divisions[0], name: 'Western Hub' }))
      .mockReturnValueOnce(throwError(() => new Error('The server is unavailable.')));
    const { harness } = await createPage(structureApi);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.startEditingDivision(page.divisions()[0]);
    page.divisionEditForm.controls.name.setValue('Western Hub');
    page.saveDivisionEdit();
    await harness.fixture.whenStable();

    expect(page.divisions()[0].name).toBe('Western Hub');
    expect(page.editingDivisionCode()).toBeNull();

    page.startEditingDivision(page.divisions()[0]);
    page.divisionEditForm.controls.name.setValue('Retry name');
    page.saveDivisionEdit();
    await harness.fixture.whenStable();
    expect(page.editingDivisionCode()).toBe('WEST');
    expect(page.divisionEditForm.controls.name.value).toBe('Retry name');
  });

  it('opens the new department popup and saves the department for its division', async () => {
    const { harness, structureApi } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.openNewDepartment(page.divisions()[0]);
    page.newDepartmentForm.controls.departmentCode.setValue('OPS');
    page.newDepartmentForm.controls.name.setValue('Operations');
    page.saveNewDepartment();
    await harness.fixture.whenStable();

    expect(structureApi.apiCompaniesCompanyCodeDepartmentsPost).toHaveBeenCalledWith(
      expect.objectContaining({
        companyCode: 'NORTH',
        createDepartmentRequest: expect.objectContaining({
          departmentCode: 'OPS',
          divisionCodes: ['WEST'],
        }),
      }),
    );
    expect(page.departmentDialog()).toBeNull();
  });

  it('excludes already assigned departments when linking and removes only one association', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true));
    const { harness, structureApi } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.openExistingDepartments(page.divisions()[0]);
    await harness.fixture.whenStable();
    expect(page.availableExistingDepartments('WEST').map((department) => department.departmentCode))
      .toEqual(['HR']);
    page.selectedExistingDepartmentCodes.setValue(['HR']);
    page.saveExistingDepartments();
    await harness.fixture.whenStable();
    expect(
      structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodeDepartmentsPost,
    ).toHaveBeenCalled();

    page.removeDepartmentAssignment(page.divisions()[0], page.divisions()[0].departments?.[0]);
    await harness.fixture.whenStable();
    expect(
      structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodeDepartmentsDepartmentCodeDelete,
    ).toHaveBeenCalled();
  });
});
