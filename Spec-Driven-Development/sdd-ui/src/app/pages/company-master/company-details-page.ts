import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyStructureService } from '../../api/generated/api/companyStructure.service';
import { CompanyDto } from '../../api/generated/model/companyDto';
import { DivisionDto } from '../../api/generated/model/divisionDto';
import { DepartmentDto } from '../../api/generated/model/departmentDto';
import { UpdateCompanyRequest } from '../../api/generated/model/updateCompanyRequest';
import { UpdateDivisionRequest } from '../../api/generated/model/updateDivisionRequest';
import { CompanyFields } from '../../shared/company-fields/company-fields';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    CompanyFields,
  ],
  selector: 'app-company-details-page',
  styleUrl: './company-details-page.css',
  templateUrl: './company-details-page.html',
})
export class CompanyDetailsPage implements OnInit {
  private readonly api = inject(CompanyService);
  private readonly structureApi = inject(CompanyStructureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly company = signal<CompanyDto | null>(null);
  readonly loading = signal(false);
  readonly deleting = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly deleteError = signal<string | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly divisions = signal<DivisionDto[]>([]);
  readonly companyDepartments = signal<DepartmentDto[]>([]);
  readonly collapsedDivisionCodes = signal<Set<string>>(new Set());
  readonly editingDivisionCode = signal<string | null>(null);
  readonly departmentDivisionCode = signal<string | null>(null);
  readonly departmentDialog = signal<'new' | 'existing' | null>(null);
  readonly structureError = signal<string | null>(null);
  readonly structureLoading = signal(false);
  readonly selectedExistingDepartmentCodes = new FormControl<string[]>([], { nonNullable: true });
  readonly newDepartmentForm = new FormGroup({
    departmentCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(12)],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    shortName: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(30)] }),
    inCharge: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(60)] }),
  });
  readonly divisionEditForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    shortName: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(30)] }),
    nameL2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    shortNameL2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(30)] }),
    address1: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address3: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address1L2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address2L2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address3L2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    commercialRegistrationNumber: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(20)] }),
    licenceIssueDate: new FormControl('', { nonNullable: true }),
    licenceExpiryDate: new FormControl('', { nonNullable: true }),
    inCharge: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(60)] }),
    inChargeL2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(60)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(20)] }),
    fax: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(20)] }),
    mobile: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(20)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    remarks: new FormControl('', { nonNullable: true }),
    active: new FormControl('Y', { nonNullable: true, validators: [Validators.pattern(/^[YN]$/)] }),
  });
  readonly form = new FormGroup({
    companyName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    shortName: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(30)] }),
    address1: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address3: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    incorporationDate: new FormControl('', { nonNullable: true }),
    referenceNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(20)],
    }),
    licenceIssueDate: new FormControl('', { nonNullable: true }),
    licenceExpiryDate: new FormControl('', { nonNullable: true }),
    companyInCharge: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(60)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [
        (control) => {
          const existingPhone = this.company()?.phone ?? '';
          return control.value === existingPhone
            ? null
            : Validators.pattern(/^\d{10}$/)(control);
        },
        (control) => {
          const existingPhone = this.company()?.phone ?? '';
          return control.value === existingPhone ? null : Validators.maxLength(10)(control);
        },
      ],
    }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    website: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('companyCode')),
        switchMap((companyCode) => {
          if (!companyCode) {
            this.loadError.set('A company code is required to view company details.');
            return EMPTY;
          }

          this.company.set(null);
          this.loading.set(true);
          this.loadError.set(null);

          return this.api.apiCompaniesCompanyCodeGet({ companyCode }).pipe(
            tap((company) => {
              this.company.set(company);
              this.populateForm(company);
              this.editing.set(this.route.snapshot.data['startInEditMode'] === true);
              this.loadDivisions(company.companyCode);
            }),
            catchError(() => {
              this.loadError.set('Company details could not be loaded.');
              return EMPTY;
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  toggleDivision(divisionCode: string): void {
    const collapsed = new Set(this.collapsedDivisionCodes());
    if (collapsed.has(divisionCode)) {
      collapsed.delete(divisionCode);
    } else {
      collapsed.add(divisionCode);
    }
    this.collapsedDivisionCodes.set(collapsed);
  }

  isDivisionCollapsed(divisionCode: string): boolean {
    return this.collapsedDivisionCodes().has(divisionCode);
  }

  startEditingDivision(division: DivisionDto): void {
    if (!division.divisionCode) {
      return;
    }

    this.divisionEditForm.reset({
      name: division.name ?? '',
      shortName: division.shortName ?? '',
      nameL2: division.nameL2 ?? '',
      shortNameL2: division.shortNameL2 ?? '',
      address1: division.address1 ?? '',
      address2: division.address2 ?? '',
      address3: division.address3 ?? '',
      address1L2: division.address1L2 ?? '',
      address2L2: division.address2L2 ?? '',
      address3L2: division.address3L2 ?? '',
      commercialRegistrationNumber: division.commercialRegistrationNumber ?? '',
      licenceIssueDate: division.licenceIssueDate ?? '',
      licenceExpiryDate: division.licenceExpiryDate ?? '',
      inCharge: division.inCharge ?? '',
      inChargeL2: division.inChargeL2 ?? '',
      phone: division.phone ?? '',
      fax: division.fax ?? '',
      mobile: division.mobile ?? '',
      email: division.email ?? '',
      remarks: division.remarks ?? '',
      active: division.active ?? 'Y',
    });
    this.structureError.set(null);
    this.editingDivisionCode.set(division.divisionCode);
  }

  cancelDivisionEdit(): void {
    this.editingDivisionCode.set(null);
    this.structureError.set(null);
  }

  saveDivisionEdit(): void {
    const companyCode = this.company()?.companyCode;
    const divisionCode = this.editingDivisionCode();
    if (!companyCode || !divisionCode) {
      return;
    }

    this.structureError.set(null);
    this.divisionEditForm.markAllAsTouched();
    if (this.divisionEditForm.invalid) {
      this.structureError.set('Complete the required division details before saving.');
      return;
    }

    const value = this.divisionEditForm.getRawValue();
    const request: UpdateDivisionRequest = {
      name: value.name,
      shortName: value.shortName || null,
      nameL2: value.nameL2 || null,
      shortNameL2: value.shortNameL2 || null,
      address1: value.address1 || null,
      address2: value.address2 || null,
      address3: value.address3 || null,
      address1L2: value.address1L2 || null,
      address2L2: value.address2L2 || null,
      address3L2: value.address3L2 || null,
      commercialRegistrationNumber: value.commercialRegistrationNumber || null,
      licenceIssueDate: value.licenceIssueDate || null,
      licenceExpiryDate: value.licenceExpiryDate || null,
      inCharge: value.inCharge || null,
      inChargeL2: value.inChargeL2 || null,
      phone: value.phone || null,
      fax: value.fax || null,
      mobile: value.mobile || null,
      email: value.email || null,
      remarks: value.remarks || null,
      active: value.active || 'Y',
    };

    this.structureApi
      .apiCompaniesCompanyCodeDivisionsDivisionCodePut({
        companyCode,
        divisionCode,
        updateDivisionRequest: request,
      })
      .pipe(
        catchError((error: unknown) => {
          this.structureError.set(this.structureErrorMessage(error, 'The division could not be saved.'));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updated) => {
        this.divisions.update((divisions) =>
          divisions.map((item) => item.divisionCode === divisionCode ? updated : item),
        );
        this.editingDivisionCode.set(null);
      });
  }

  openNewDepartment(division: DivisionDto): void {
    if (!division.divisionCode) {
      return;
    }
    this.newDepartmentForm.reset({ departmentCode: '', name: '', shortName: '', inCharge: '' });
    this.departmentDivisionCode.set(division.divisionCode);
    this.departmentDialog.set('new');
    this.structureError.set(null);
  }

  saveNewDepartment(): void {
    const companyCode = this.company()?.companyCode;
    const divisionCode = this.departmentDivisionCode();
    if (!companyCode || !divisionCode) {
      return;
    }

    this.structureError.set(null);
    this.newDepartmentForm.markAllAsTouched();
    if (this.newDepartmentForm.invalid) {
      this.structureError.set('Enter the required department code and name.');
      return;
    }
    const value = this.newDepartmentForm.getRawValue();
    this.structureApi
      .apiCompaniesCompanyCodeDepartmentsPost({
        companyCode,
        createDepartmentRequest: {
          departmentCode: value.departmentCode,
          name: value.name,
          shortName: value.shortName || null,
          inCharge: value.inCharge || null,
          divisionCodes: [divisionCode],
        },
      })
      .pipe(
        catchError((error: unknown) => {
          this.structureError.set(this.structureErrorMessage(error, 'The department could not be saved.'));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.departmentDialog.set(null);
      this.departmentDivisionCode.set(null);
      this.loadDivisions(companyCode);
      });
  }

  openExistingDepartments(division: DivisionDto): void {
    const companyCode = this.company()?.companyCode;
    const divisionCode = division.divisionCode;
    if (!companyCode || !divisionCode) {
      return;
    }

    this.departmentDivisionCode.set(divisionCode);
    this.selectedExistingDepartmentCodes.setValue([]);
    this.structureError.set(null);
    this.structureApi
      .apiCompaniesCompanyCodeDepartmentsGet({ companyCode })
      .pipe(
        catchError((error: unknown) => {
          this.structureError.set(
            this.structureErrorMessage(error, 'Existing departments could not be loaded.'),
          );
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((departments) => {
        this.companyDepartments.set(departments);
        this.departmentDialog.set('existing');
      });
  }

  availableExistingDepartments(divisionCode: string): DepartmentDto[] {
    const assigned = new Set(
      this.divisions()
        .find(division => division.divisionCode === divisionCode)
        ?.departments?.map(department => department.departmentCode),
    );
    return this.companyDepartments().filter(
      department => !assigned.has(department.departmentCode),
    );
  }

  saveExistingDepartments(): void {
    const companyCode = this.company()?.companyCode;
    const divisionCode = this.departmentDivisionCode();
    const departmentCodes = this.selectedExistingDepartmentCodes.value;
    if (!companyCode || !divisionCode || departmentCodes.length === 0) {
      this.structureError.set('Select at least one existing department to add.');
      return;
    }

    this.structureApi
      .apiCompaniesCompanyCodeDivisionsDivisionCodeDepartmentsPost({
        companyCode,
        divisionCode,
        linkDepartmentsRequest: { departmentCodes },
      })
      .pipe(
        catchError((error: unknown) => {
          this.structureError.set(this.structureErrorMessage(error, 'The department assignments could not be saved.'));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.departmentDialog.set(null);
        this.departmentDivisionCode.set(null);
        this.loadDivisions(companyCode);
      });
  }

  closeDepartmentDialog(): void {
    this.departmentDialog.set(null);
    this.departmentDivisionCode.set(null);
    this.structureError.set(null);
  }

  removeDepartmentAssignment(division: DivisionDto, department?: DepartmentDto): void {
    const companyCode = this.company()?.companyCode;
    const divisionCode = division.divisionCode;
    const departmentCode = department?.departmentCode;
    if (
      !companyCode ||
      !divisionCode ||
      !departmentCode ||
      !window.confirm(`Remove ${department?.name ?? departmentCode} from ${division.name}?`)
    ) {
      return;
    }

    this.structureApi
      .apiCompaniesCompanyCodeDivisionsDivisionCodeDepartmentsDepartmentCodeDelete({
        companyCode,
        divisionCode,
        departmentCode,
      })
      .pipe(
        catchError((error: unknown) => {
          this.structureError.set(
            this.structureErrorMessage(error, 'The department assignment could not be removed.'),
          );
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.divisions.update((divisions) =>
          divisions.map((item) =>
            item.divisionCode === divisionCode
              ? {
                  ...item,
                  departments: item.departments?.filter(
                    assigned => assigned.departmentCode !== departmentCode,
                  ),
                }
              : item,
          ),
        );
      });
  }

  deleteDivision(division: DivisionDto): void {
    const companyCode = this.company()?.companyCode;
    const divisionCode = division.divisionCode;
    if (
      !companyCode ||
      !divisionCode ||
      typeof window === 'undefined' ||
      !window.confirm(
        `Delete ${division.name}? Department assignments must be removed before the division can be deleted.`,
      )
    ) {
      return;
    }

    this.deleteError.set(null);
    this.structureApi
      .apiCompaniesCompanyCodeDivisionsDivisionCodeDelete({ companyCode, divisionCode })
      .pipe(
        catchError((error: unknown) => {
          this.deleteError.set(this.structureErrorMessage(error, 'The division could not be deleted.'));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.divisions.update((divisions) =>
          divisions.filter((item) => item.divisionCode !== divisionCode),
        );
      });
  }

  private loadDivisions(companyCode: string): void {
    this.structureLoading.set(true);
    this.structureError.set(null);
    this.structureApi
      .apiCompaniesCompanyCodeDivisionsGet({ companyCode })
      .pipe(
        tap((divisions) => this.divisions.set(divisions)),
        catchError((error: unknown) => {
          this.structureError.set(this.structureErrorMessage(error, 'Company divisions could not be loaded.'));
          return EMPTY;
        }),
        finalize(() => this.structureLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private structureErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse) || !isRecord(error.error)) {
      return fallback;
    }
    if (typeof error.error['detail'] === 'string') {
      return error.error['detail'];
    }
    if (isRecord(error.error['errors'])) {
      const messages = Object.values(error.error['errors'])
        .flatMap(value => Array.isArray(value) ? value : [])
        .filter((value): value is string => typeof value === 'string');
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }
    return fallback;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
  }

  formatDivisionAddress(division: DivisionDto): string {
    return [division.address1, division.address2, division.address3]
      .filter((address): address is string => Boolean(address?.trim()))
      .join(', ');
  }

  formatAuditDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const timestamp = new Date(value);
    if (Number.isNaN(timestamp.getTime())) {
      return value;
    }

    const gulfTime = new Date(timestamp.getTime() + 4 * 60 * 60 * 1000);
    const day = String(gulfTime.getUTCDate()).padStart(2, '0');
    const month = String(gulfTime.getUTCMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${gulfTime.getUTCFullYear()}`;
  }

  startEditing(): void {
    const company = this.company();
    if (!company) {
      return;
    }

    this.populateForm(company);
    this.error.set(null);
    this.editing.set(true);
  }

  cancelEditing(): void {
    const company = this.company();
    if (company) {
      this.populateForm(company);
    }
    this.error.set(null);
    this.editing.set(false);
    if (this.route.snapshot.data['startInEditMode'] === true && company) {
      void this.router.navigate(['/company-master', company.companyCode], {
        queryParamsHandling: 'preserve',
      });
    }
  }

  fieldError(field: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[field];
    if (!control.invalid || (!control.dirty && !control.touched)) {
      return null;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.getError('maxlength').requiredLength} characters.`;
    }
    if (control.hasError('pattern')) {
      return 'Enter a 10-digit phone number.';
    }
    return 'Enter a valid value.';
  }

  save(): void {
    const company = this.company();
    if (!company || !this.editing()) {
      return;
    }

    this.error.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const request: UpdateCompanyRequest = {
      companyName: value.companyName,
      shortName: value.shortName || null,
      address1: value.address1 || null,
      address2: value.address2 || null,
      address3: value.address3 || null,
      incorporationDate: value.incorporationDate || null,
      referenceNumber: value.referenceNumber || null,
      licenceIssueDate: value.licenceIssueDate || null,
      licenceExpiryDate: value.licenceExpiryDate || null,
      companyInCharge: value.companyInCharge || null,
      phone: value.phone || null,
      email: value.email || null,
      website: value.website || null,
    };

    this.saving.set(true);
    this.api
      .apiCompaniesCompanyCodePut({ companyCode: company.companyCode, updateCompanyRequest: request })
      .pipe(
        catchError((error: unknown) => {
          this.applyUpdateError(error);
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updated) => {
        this.company.set(updated);
        this.populateForm(updated);
        this.editing.set(false);
        if (this.route.snapshot.data['startInEditMode'] === true) {
          void this.router.navigate(['/company-master', updated.companyCode], {
            queryParamsHandling: 'preserve',
          });
        }
      });
  }

  private populateForm(company: CompanyDto): void {
    this.form.reset({
      companyName: company.companyName,
      shortName: company.shortName ?? '',
      address1: company.address1 ?? '',
      address2: company.address2 ?? '',
      address3: company.address3 ?? '',
      incorporationDate: company.incorporationDate ?? '',
      referenceNumber: company.referenceNumber ?? '',
      licenceIssueDate: company.licenceIssueDate ?? '',
      licenceExpiryDate: company.licenceExpiryDate ?? '',
      companyInCharge: company.companyInCharge ?? '',
      phone: company.phone ?? '',
      email: company.email ?? '',
      website: company.website ?? '',
    });
  }

  private applyUpdateError(error: unknown): void {
    let fieldErrorFound = false;
    if (error instanceof HttpErrorResponse && isRecord(error.error) && isRecord(error.error['errors'])) {
      for (const [name, messages] of Object.entries(error.error['errors'])) {
        const field = name.charAt(0).toLowerCase() + name.slice(1);
        if (!(field in this.form.controls) || !Array.isArray(messages)) {
          continue;
        }
        const message = messages.filter((item): item is string => typeof item === 'string').join(' ');
        if (message) {
          const control = this.form.controls[field as keyof typeof this.form.controls];
          control.setErrors({ ...control.errors, server: message });
          control.markAsTouched();
          fieldErrorFound = true;
        }
      }
    }

    if (error instanceof HttpErrorResponse && isRecord(error.error) && typeof error.error['detail'] === 'string') {
      this.error.set(error.error['detail']);
    } else if (fieldErrorFound) {
      this.error.set('Please correct the highlighted fields.');
    } else {
      this.error.set('The company could not be saved. Please try again.');
    }
  }

  deleteCompany(): void {
    const company = this.company();
    if (
      !company ||
      !window.confirm(`Delete ${company.companyName}? This action cannot be undone.`)
    ) {
      return;
    }

    this.deleteError.set(null);
    this.deleting.set(true);
    this.api
      .apiCompaniesCompanyCodeDelete({ companyCode: company.companyCode })
      .pipe(
        catchError((error: unknown) => {
          this.deleteError.set(
            error instanceof HttpErrorResponse && error.status === 409
              ? 'This company cannot be deleted because it is used by other records.'
              : 'The company could not be deleted. Please try again.',
          );
          return EMPTY;
        }),
        finalize(() => this.deleting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        void this.router.navigate(['/company-master'], { queryParamsHandling: 'preserve' });
      });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
