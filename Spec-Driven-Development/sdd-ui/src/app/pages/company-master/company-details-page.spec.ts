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
      shortName: 'West',
      address1: 'Western Road',
      address2: 'Western District',
      address3: 'Western City',
      commercialRegistrationNumber: 'CR-123',
      licenceIssueDate: '2024-01-02',
      licenceExpiryDate: '2026-01-02',
      inCharge: 'West Manager',
      phone: '555-0100',
      fax: '555-0101',
      mobile: '555-0102',
      email: 'west@example.com',
      remarks: 'Main office',
      active: 'Y',
      nameL2: 'Western Office L2',
      shortNameL2: 'West L2',
      address1L2: 'Western Road L2',
      address2L2: 'Western District L2',
      address3L2: 'Western City L2',
      inChargeL2: 'West Manager L2',
      departments: [{ departmentCode: 'FIN', name: 'Finance', divisionCodes: ['WEST'] }],
    },
    {
      divisionCode: 'EAST',
      name: 'Eastern Office',
      departments: [
        { departmentCode: 'IT', name: 'Information Technology', divisionCodes: ['EAST'] },
      ],
    },
  ];

  function createStructureApi() {
    return {
      apiCompaniesCompanyCodeDivisionsGet: vi.fn(() => of(divisions)),
      apiCompaniesCompanyCodeDivisionsPost: vi.fn(({ createDivisionsRequest }) =>
        of(createDivisionsRequest.divisions),
      ),
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
        {
          provide: CompanyService,
          useValue: { apiCompaniesCompanyCodeGet: vi.fn(() => of(company)) },
        },
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

  it('keeps audit actors paired with their GST dates', async () => {
    const { harness } = await createPage();
    await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const auditPairs = Array.from(
      (harness.routeNativeElement as HTMLElement).querySelectorAll('.company-details .audit-pair'),
    );
    expect(auditPairs).toHaveLength(2);
    expect(auditPairs[0].textContent).toContain('Created by');
    expect(auditPairs[0].textContent).toContain('Created date (GST)');
    expect(auditPairs[1].textContent).toContain('Last updated by');
    expect(auditPairs[1].textContent).toContain('Last updated date (GST)');
  });

  it('renders divisions as collapsed Material expansion panels by default', async () => {
    const { harness } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const root = harness.routeNativeElement as HTMLElement;
    const panels = Array.from(root.querySelectorAll('mat-expansion-panel'));
    expect(panels).toHaveLength(2);
    expect(
      panels[0].querySelector('mat-expansion-panel-header')?.getAttribute('aria-expanded'),
    ).toBe('false');
    expect(panels[0].querySelector('[aria-label="Edit division WEST"]')).not.toBeNull();
    expect(panels[0].querySelector('[aria-label="Delete division WEST"]')).not.toBeNull();
    expect(panels[0].querySelector('.destructive-action')).not.toBeNull();
    expect(root.querySelector('.details-heading .destructive-action')).not.toBeNull();
    expect(root.querySelector('.details-actions button mat-icon svg')).not.toBeNull();
    expect(root.querySelector('.details-heading .destructive-action mat-icon svg')).not.toBeNull();
    expect(
      panels[0].querySelector('[aria-label="Edit division WEST"] mat-icon svg'),
    ).not.toBeNull();
    expect(
      panels[0].querySelector('[aria-label="Delete division WEST"] mat-icon svg'),
    ).not.toBeNull();
    expect(root.textContent).not.toContain('Collapse');
    expect(root.textContent).not.toContain('Cancel edit');

    panels[0]
      .querySelector('mat-expansion-panel-header')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    harness.fixture.detectChanges();
    expect(
      panels[0].querySelector('mat-expansion-panel-header')?.getAttribute('aria-expanded'),
    ).toBe('true');
    expect(page.divisions()[0].name).toBe('Western Office');
  });

  it('shows all editable non-L2 division fields in view mode', async () => {
    const { harness } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();
    page.setDivisionExpanded('WEST', true);
    harness.fixture.detectChanges();

    const fields = Array.from(
      (harness.routeNativeElement as HTMLElement)
        .querySelector('mat-expansion-panel .division-details')
        ?.querySelectorAll('dt') ?? [],
    ).map((field) => field.textContent?.trim());
    expect(fields).toEqual([
      'Division name',
      'Division code',
      'Short name',
      'Address 1',
      'Address 2',
      'Address 3',
      'Commercial registration number',
      'Licence issue date',
      'Licence expiry date',
      'In charge',
      'Phone',
      'Fax',
      'Mobile',
      'Email',
      'Remarks',
      'Active',
    ]);
  });

  it('hides the division Edit action while that division is being edited', async () => {
    const { harness } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const editButton = harness.routeNativeElement?.querySelector(
      '[aria-label="Edit division WEST"]',
    ) as HTMLButtonElement;
    editButton.click();
    harness.fixture.detectChanges();

    expect(page.editingDivisionCode()).toBe('WEST');
    expect(
      harness.routeNativeElement?.querySelector('[aria-label="Edit division WEST"]'),
    ).toBeNull();
    expect(
      harness.routeNativeElement?.querySelector('[aria-label="Delete division WEST"]'),
    ).not.toBeNull();
  });

  it('adds a division from the company details screen', async () => {
    const { harness, structureApi } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const addButton = Array.from(
      (harness.routeNativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'Add division') as HTMLButtonElement;
    addButton.click();
    harness.fixture.detectChanges();
    page.newDivisionForm.controls.divisionCode.setValue('CENTRAL');
    page.newDivisionForm.controls.name.setValue('Central Office');
    page.newDivisionForm.controls.fax.setValue('555-0103');
    page.saveNewDivision();
    await harness.fixture.whenStable();

    expect(structureApi.apiCompaniesCompanyCodeDivisionsPost).toHaveBeenCalledWith({
      companyCode: 'NORTH',
      createDivisionsRequest: {
        divisions: [
          expect.objectContaining({
            divisionCode: 'CENTRAL',
            name: 'Central Office',
            fax: '555-0103',
          }),
        ],
      },
    });
    expect(page.divisions().map((division) => division.divisionCode)).toEqual([
      'CENTRAL',
      'WEST',
      'EAST',
    ]);
    expect(page.divisionDialogOpen()).toBe(false);
  });

  it('removes a department when its final division assignment is deleted', async () => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
    const structureApi = createStructureApi();
    const { harness } = await createPage(structureApi);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.removeDepartmentAssignment(page.divisions()[0], page.divisions()[0].departments?.[0]);
    await harness.fixture.whenStable();

    expect(page.divisions()[0].departments).toEqual([]);
    expect(harness.routeNativeElement?.querySelectorAll('mat-expansion-panel')).toHaveLength(2);
    expect(harness.routeNativeElement?.querySelector('[role="alert"]')).toBeNull();
  });

  it('moves departments to a selected destination when deleting a division', async () => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
    const { harness, structureApi } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.deleteDivision(page.divisions()[0]);
    expect(page.divisionToDelete()?.divisionCode).toBe('WEST');
    page.deleteDestinationDivisionCode.setValue('EAST');
    page.confirmDivisionDelete();
    await harness.fixture.whenStable();

    expect(structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodeDelete).toHaveBeenCalledWith({
      companyCode: 'NORTH',
      divisionCode: 'WEST',
      destinationDivisionCode: 'EAST',
    });
    expect(page.divisions().map((division) => division.divisionCode)).toEqual(['EAST']);
    expect(page.divisions()[0].departments?.map((department) => department.departmentCode)).toEqual(
      ['IT', 'FIN'],
    );
    expect(page.divisionToDelete()).toBeNull();
  });

  it('blocks division deletion with departments when there is no other destination', async () => {
    const structureApi = createStructureApi();
    structureApi.apiCompaniesCompanyCodeDivisionsGet = vi.fn(() => of([divisions[0]]));
    const { harness } = await createPage(structureApi);
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.deleteDivision(page.divisions()[0]);

    expect(structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodeDelete).not.toHaveBeenCalled();
    expect(page.divisions()).toHaveLength(1);
    expect(page.deleteError()).toContain('no other division is available');
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
    expect(structureApi.apiCompaniesCompanyCodeDivisionsDivisionCodePut).toHaveBeenCalledWith(
      expect.objectContaining({
        updateDivisionRequest: expect.objectContaining({
          nameL2: 'Western Office L2',
          shortNameL2: 'West L2',
          address1L2: 'Western Road L2',
          address2L2: 'Western District L2',
          address3L2: 'Western City L2',
          inChargeL2: 'West Manager L2',
        }),
      }),
    );

    page.startEditingDivision(page.divisions()[0]);
    page.divisionEditForm.controls.name.setValue('Retry name');
    page.saveDivisionEdit();
    await harness.fixture.whenStable();
    expect(page.editingDivisionCode()).toBe('WEST');
    expect(page.divisionEditForm.controls.name.value).toBe('Retry name');
  });

  it('places company and division edit actions after their details and renders the department icon', async () => {
    const { harness } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.startEditing();
    harness.fixture.detectChanges();
    const root = harness.routeNativeElement as HTMLElement;
    const companyFields = root.querySelector('app-company-fields');
    const companyActions = root.querySelector('.details-edit-actions');
    const audit = root.querySelector('#company-audit-heading');
    expect(companyFields?.querySelectorAll('.field-group')).toHaveLength(4);
    expect(
      Array.from(companyFields?.querySelectorAll('.field-group h2') ?? []).map(
        (heading) => heading.textContent,
      ),
    ).toEqual(['Company information', 'Address', 'Licensing', 'Contact']);
    expect(companyFields?.compareDocumentPosition(companyActions!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(companyActions?.compareDocumentPosition(audit!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    page.cancelEditing();
    const editButton = root.querySelector('[aria-label="Edit division WEST"]') as HTMLButtonElement;
    editButton.click();
    harness.fixture.detectChanges();

    expect(root.querySelectorAll('.division-edit-fields [formControlName$="L2"]')).toHaveLength(0);
    const panel = root.querySelector('mat-expansion-panel') as HTMLElement;
    const actions = Array.from(
      panel.querySelectorAll(
        '.department-table-wrapper, .department-assignment-actions, .division-edit-actions',
      ),
    );
    expect(actions.map((element) => element.className)).toEqual([
      'department-table-wrapper',
      'department-assignment-actions',
      'division-edit-actions',
    ]);
    const deleteIcon = panel.querySelector('.department-action-column mat-icon');
    expect(deleteIcon?.querySelector('svg')).not.toBeNull();
    expect(deleteIcon?.textContent?.trim()).toBe('');
    expect(panel.querySelector('.department-action-column .destructive-action')).not.toBeNull();
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
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
    const { harness, structureApi } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    page.openExistingDepartments(page.divisions()[0]);
    await harness.fixture.whenStable();
    expect(
      page.availableExistingDepartments('WEST').map((department) => department.departmentCode),
    ).toEqual(['HR']);
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

  it('preserves the expanded division after creating and linking departments', async () => {
    const { harness } = await createPage();
    const page = await harness.navigateByUrl('/company-master/NORTH', CompanyDetailsPage);
    await harness.fixture.whenStable();

    const firstPanel = (harness.routeNativeElement as HTMLElement).querySelector(
      'mat-expansion-panel',
    ) as HTMLElement;
    firstPanel
      .querySelector('mat-expansion-panel-header')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    harness.fixture.detectChanges();

    page.openNewDepartment(page.divisions()[0]);
    page.newDepartmentForm.controls.departmentCode.setValue('OPS');
    page.newDepartmentForm.controls.name.setValue('Operations');
    page.saveNewDepartment();
    await harness.fixture.whenStable();

    let updatedPanel = (harness.routeNativeElement as HTMLElement).querySelector(
      'mat-expansion-panel',
    ) as HTMLElement;
    expect(
      updatedPanel.querySelector('mat-expansion-panel-header')?.getAttribute('aria-expanded'),
    ).toBe('true');

    page.openExistingDepartments(page.divisions()[0]);
    await harness.fixture.whenStable();
    page.selectedExistingDepartmentCodes.setValue(['HR']);
    page.saveExistingDepartments();
    await harness.fixture.whenStable();

    updatedPanel = (harness.routeNativeElement as HTMLElement).querySelector(
      'mat-expansion-panel',
    ) as HTMLElement;
    expect(
      updatedPanel.querySelector('mat-expansion-panel-header')?.getAttribute('aria-expanded'),
    ).toBe('true');
  });
});
