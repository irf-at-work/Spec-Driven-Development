import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injectable,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  catchError,
  concatMap,
  EMPTY,
  finalize,
  forkJoin,
  from,
  map,
  type Observable,
  of,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyStructureService } from '../../api/generated/api/companyStructure.service';
import { CompanyDto } from '../../api/generated/model/companyDto';
import { CreateCompanyRequest } from '../../api/generated/model/createCompanyRequest';
import { UpdateCompanyRequest } from '../../api/generated/model/updateCompanyRequest';
import { DivisionDto } from '../../api/generated/model/divisionDto';
import { CompanyFields } from '../../shared/company-fields/company-fields';
import { MatSelectModule } from '@angular/material/select';

type CompanyFormControls = {
  companyCode: FormControl<string>;
  companyName: FormControl<string>;
  shortName: FormControl<string>;
  address1: FormControl<string>;
  address2: FormControl<string>;
  address3: FormControl<string>;
  incorporationDate: FormControl<Date | null>;
  referenceNumber: FormControl<string>;
  licenceIssueDate: FormControl<Date | null>;
  licenceExpiryDate: FormControl<Date | null>;
  companyInCharge: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  website: FormControl<string>;
};

type CompanyFormValue = {
  [Key in keyof CompanyFormControls]: CompanyFormControls[Key] extends FormControl<infer Value>
    ? Value
    : never;
};

type DivisionFormControls = {
  divisionCode: FormControl<string>;
  name: FormControl<string>;
  shortName: FormControl<string>;
  address1: FormControl<string>;
  address2: FormControl<string>;
  address3: FormControl<string>;
  inCharge: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
};

type DepartmentFormControls = {
  departmentCode: FormControl<string>;
  name: FormControl<string>;
  shortName: FormControl<string>;
  divisionCodes: FormControl<string[]>;
};

type CompanySetupStep = 'basic' | 'division' | 'department';

const FIELD_ORDER: readonly (keyof CompanyFormControls)[] = [
  'companyCode',
  'companyName',
  'shortName',
  'address1',
  'address2',
  'address3',
  'incorporationDate',
  'referenceNumber',
  'licenceIssueDate',
  'licenceExpiryDate',
  'companyInCharge',
  'phone',
  'email',
  'website',
];

const DATE_INPUT_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

const COMPANY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: DATE_INPUT_FORMAT,
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: DATE_INPUT_FORMAT,
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};

@Injectable()
class CompanyDateAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (value instanceof Date) {
      return this.isValid(value) ? new Date(value.getTime()) : null;
    }
    if (typeof value !== 'string' || value.trim() === '') {
      return null;
    }

    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
    if (!match) {
      return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const date = new Date(year, month, day);
    return this.isValid(date) &&
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
      ? date
      : null;
  }

  override format(date: Date, displayFormat: object): string {
    if (hasDateParts(displayFormat)) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}-${month}-${date.getFullYear()}`;
    }
    return super.format(date, displayFormat);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    CompanyFields,
  ],
  providers: [
    { provide: DateAdapter, useClass: CompanyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: COMPANY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  selector: 'app-company-form',
  styleUrl: './company-form.css',
  templateUrl: './company-form.html',
})
export class CompanyForm implements OnInit {
  private readonly api = inject(CompanyService);
  private readonly structureApi = inject(CompanyStructureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private shortNameEdited = false;

  readonly form = new FormGroup<CompanyFormControls>({
    companyCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(12)],
    }),
    companyName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    shortName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(30)],
    }),
    address1: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address2: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    address3: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    incorporationDate: new FormControl<Date | null>(null),
    referenceNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(20)],
    }),
    licenceIssueDate: new FormControl<Date | null>(null),
    licenceExpiryDate: new FormControl<Date | null>(null),
    companyInCharge: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(60)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(10), Validators.pattern(/^\d{10}$/)],
    }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    website: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
  });
  readonly editing = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly step = signal<CompanySetupStep>('basic');
  readonly companyCode = signal<string | null>(null);
  readonly divisionOptions = signal<DivisionDto[]>([]);
  readonly savedDivisionCodes = signal<Set<string>>(new Set());
  readonly collapsedDivisions = signal<Set<number>>(new Set());
  readonly divisionForms = new FormArray<FormGroup<DivisionFormControls>>([]);
  readonly departmentForms = new FormArray<FormGroup<DepartmentFormControls>>([]);

  ngOnInit(): void {
    this.form.controls.companyName.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => {
        if (!this.editing() && !this.shortNameEdited) {
          this.form.controls.shortName.setValue(name.slice(0, 30), { emitEvent: false });
        }
      });
    this.form.controls.shortName.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.shortNameEdited = true;
      });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const requestedStep = params.get('step');
      const companyCode = params.get('companyCode');
      if (requestedStep === 'basic' && companyCode) {
        this.companyCode.set(companyCode);
        this.step.set('basic');
        return;
      }
      if (!companyCode || (requestedStep !== 'division' && requestedStep !== 'department')) {
        this.companyCode.set(null);
        this.step.set('basic');
        return;
      }

      this.companyCode.set(companyCode);
      this.step.set(requestedStep);
      if (requestedStep === 'department' && this.departmentForms.length === 0) {
        this.addDepartment();
      }
      this.loadDivisions(companyCode, requestedStep === 'division');
    });

    this.route.paramMap
      .pipe(
        map((params) => params.get('companyCode')),
        switchMap((companyCode) => {
          this.editing.set(Boolean(companyCode));
          this.shortNameEdited = false;
          if (!companyCode) {
            return of(null);
          }

          this.loading.set(true);
          this.loadError.set(null);
          return this.api.apiCompaniesCompanyCodeGet({ companyCode }).pipe(
            tap((company) => this.populateForm(company)),
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

  fieldError(field: keyof CompanyFormControls): string | null {
    const control = this.form.controls[field];
    if (!control.invalid || (!control.dirty && !control.touched)) {
      return null;
    }

    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (control.hasError('duplicate')) {
      return 'This company code already exists.';
    }
    if (control.hasError('server')) {
      const serverError: unknown = control.getError('server');
      return typeof serverError === 'string' ? serverError : 'The value was rejected.';
    }
    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.getError('maxlength').requiredLength} characters.`;
    }
    if (control.hasError('pattern')) {
      return 'Enter a 10-digit phone number.';
    }
    if (control.hasError('matDatepickerParse')) {
      return 'Enter a valid date in DD-MM-YYYY format.';
    }

    return 'Enter a valid value.';
  }

  save(): void {
    this.error.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    const value = this.form.getRawValue();
    const setupCompanyCode = this.companyCode();
    this.saving.set(true);
    const request =
      this.editing() || setupCompanyCode
        ? this.api.apiCompaniesCompanyCodePut({
            companyCode: setupCompanyCode ?? value.companyCode,
            updateCompanyRequest: this.toUpdateRequest(value),
          })
        : this.api.apiCompaniesPost({ createCompanyRequest: this.toCreateRequest(value) });

    request
      .pipe(
        catchError((error: unknown) => {
          this.applyApiError(error);
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((company) => {
        void this.router.navigate(['/company-master', company.companyCode], {
          queryParamsHandling: 'preserve',
        });
      });
  }

  saveAndAddDivision(): void {
    this.error.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const companyCode = this.companyCode();
    const request = companyCode
      ? this.api.apiCompaniesCompanyCodePut({
          companyCode,
          updateCompanyRequest: this.toUpdateRequest(value),
        })
      : this.api.apiCompaniesPost({ createCompanyRequest: this.toCreateRequest(value) });
    request
      .pipe(
        catchError((error: unknown) => {
          this.applyApiError(error);
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((company) => this.navigateToStep('division', company.companyCode));
  }

  resetStep(): void {
    this.error.set(null);
    switch (this.step()) {
      case 'basic':
        this.shortNameEdited = false;
        this.form.reset({
          companyCode: '',
          companyName: '',
          shortName: '',
          address1: '',
          address2: '',
          address3: '',
          incorporationDate: null,
          referenceNumber: '',
          licenceIssueDate: null,
          licenceExpiryDate: null,
          companyInCharge: '',
          phone: '',
          email: '',
          website: '',
        });
        break;
      case 'division':
        this.divisionForms.clear();
        this.collapsedDivisions.set(new Set());
        break;
      case 'department':
        this.departmentForms.clear();
        break;
    }
  }

  addDivision(): void {
    this.divisionForms.push(
      new FormGroup<DivisionFormControls>({
        divisionCode: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(12)],
        }),
        name: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        shortName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.maxLength(30)],
        }),
        address1: new FormControl('', {
          nonNullable: true,
          validators: [Validators.maxLength(100)],
        }),
        address2: new FormControl('', {
          nonNullable: true,
          validators: [Validators.maxLength(100)],
        }),
        address3: new FormControl('', {
          nonNullable: true,
          validators: [Validators.maxLength(100)],
        }),
        inCharge: new FormControl('', {
          nonNullable: true,
          validators: [Validators.maxLength(60)],
        }),
        phone: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(20)] }),
        email: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
      }),
    );
    this.error.set(null);
  }

  removeDivision(index: number): void {
    const divisionCode = this.divisionForms.at(index).controls.divisionCode.value;
    if (this.savedDivisionCodes().has(divisionCode)) {
      const confirmed =
        typeof window !== 'undefined' &&
        window.confirm(
          'Delete this saved division? The server will prevent deletion while departments remain assigned.',
        );
      const companyCode = this.companyCode();
      if (!confirmed || !companyCode) {
        return;
      }

      this.structureApi
        .apiCompaniesCompanyCodeDivisionsDivisionCodeDelete({ companyCode, divisionCode })
        .pipe(
          catchError((error: unknown) => {
            this.applyStructureError(error);
            return EMPTY;
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.divisionForms.removeAt(index);
          this.collapsedDivisions.set(new Set());
          this.divisionOptions.update((divisions) =>
            divisions.filter((division) => division.divisionCode !== divisionCode),
          );
          this.savedDivisionCodes.update((codes) => {
            const updated = new Set(codes);
            updated.delete(divisionCode);
            return updated;
          });
        });
      return;
    }

    const confirmed =
      typeof window !== 'undefined' &&
      window.confirm('Delete this unsaved division card? Its entered details will be lost.');
    if (confirmed) {
      this.divisionForms.removeAt(index);
      this.collapsedDivisions.set(new Set());
    }
  }

  toggleDivision(index: number): void {
    this.setDivisionCollapsed(index, !this.isDivisionCollapsed(index));
  }

  setDivisionCollapsed(index: number, collapsed: boolean): void {
    const collapsedDivisions = new Set(this.collapsedDivisions());
    if (collapsed) {
      collapsedDivisions.add(index);
    } else {
      collapsedDivisions.delete(index);
    }
    this.collapsedDivisions.set(collapsedDivisions);
  }

  isDivisionCollapsed(index: number): boolean {
    return this.collapsedDivisions().has(index);
  }

  isSavedDivision(index: number): boolean {
    return this.savedDivisionCodes().has(this.divisionForms.at(index).controls.divisionCode.value);
  }

  saveDivisionAndExit(): void {
    this.saveDivisions('exit');
  }

  saveDivisionAndAddDepartment(): void {
    if (this.divisionForms.length === 0) {
      this.error.set('Add at least one division before continuing to Department.');
      return;
    }
    this.saveDivisions('department');
  }

  addDepartment(): void {
    this.departmentForms.push(
      new FormGroup<DepartmentFormControls>({
        departmentCode: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(12)],
        }),
        name: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
        shortName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.maxLength(30)],
        }),
        divisionCodes: new FormControl([], {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
    this.error.set(null);
  }

  saveDepartments(): void {
    this.error.set(null);
    const companyCode = this.companyCode();
    if (!companyCode) {
      this.error.set('Save the company details before adding departments.');
      return;
    }
    if (this.departmentForms.length === 0) {
      this.error.set('Add at least one department before saving.');
      return;
    }
    this.departmentForms.controls.forEach((department) => department.markAllAsTouched());
    if (this.departmentForms.invalid) {
      this.error.set('Complete the required department details and choose at least one division.');
      return;
    }

    const requests = this.departmentForms.getRawValue();
    this.saving.set(true);
    from(requests)
      .pipe(
        concatMap((request) =>
          this.structureApi.apiCompaniesCompanyCodeDepartmentsPost({
            companyCode,
            createDepartmentRequest: {
              departmentCode: request.departmentCode,
              name: request.name,
              shortName: request.shortName || null,
              divisionCodes: request.divisionCodes,
            },
          }),
        ),
        toArray(),
        catchError((error: unknown) => {
          this.applyStructureError(error);
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.navigateToCompanyDetails(companyCode);
      });
  }

  backToDivision(): void {
    const companyCode = this.companyCode();
    if (companyCode) {
      this.navigateToStep('division', companyCode);
    }
  }

  private saveDivisions(destination: 'exit' | 'department'): void {
    this.error.set(null);
    const companyCode = this.companyCode();
    if (!companyCode) {
      this.error.set('Save the company details before adding divisions.');
      return;
    }
    this.divisionForms.controls.forEach((division) => division.markAllAsTouched());
    if (this.divisionForms.invalid) {
      this.error.set('Complete the required division details before saving.');
      return;
    }

    const values = this.divisionForms.getRawValue();
    const savedCodes = new Set(this.savedDivisionCodes());
    const createDivisions = values
      .filter((division) => !savedCodes.has(division.divisionCode))
      .map((division) => ({
        divisionCode: division.divisionCode,
        name: division.name,
        shortName: division.shortName || null,
        address1: division.address1 || null,
        address2: division.address2 || null,
        address3: division.address3 || null,
        inCharge: division.inCharge || null,
        phone: division.phone || null,
        email: division.email || null,
      }));
    const updateDivisions = values.filter((division) => savedCodes.has(division.divisionCode));
    const saveRequests: Observable<unknown>[] = [];

    if (createDivisions.length > 0) {
      saveRequests.push(
        this.structureApi
          .apiCompaniesCompanyCodeDivisionsPost({
            companyCode,
            createDivisionsRequest: { divisions: createDivisions },
          })
          .pipe(map(() => undefined)),
      );
    }

    for (const division of updateDivisions) {
      saveRequests.push(
        this.structureApi
          .apiCompaniesCompanyCodeDivisionsDivisionCodePut({
            companyCode,
            divisionCode: division.divisionCode,
            updateDivisionRequest: {
              name: division.name,
              shortName: division.shortName || null,
              address1: division.address1 || null,
              address2: division.address2 || null,
              address3: division.address3 || null,
              inCharge: division.inCharge || null,
              phone: division.phone || null,
              email: division.email || null,
              active: 'Y',
            },
          })
          .pipe(map(() => undefined)),
      );
    }

    if (saveRequests.length === 0) {
      if (destination === 'department') {
        this.navigateToStep('department', companyCode);
      } else {
        this.navigateToCompanyDetails(companyCode);
      }
      return;
    }

    this.saving.set(true);
    forkJoin(saveRequests)
      .pipe(
        catchError((error: unknown) => {
          this.applyStructureError(error);
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.savedDivisionCodes.update((codes) => {
          const next = new Set(codes);
          for (const division of values) {
            next.add(division.divisionCode);
          }
          return next;
        });
        if (destination === 'department') {
          this.navigateToStep('department', companyCode);
        } else {
          this.navigateToCompanyDetails(companyCode);
        }
      });
  }

  backToBasic(): void {
    const companyCode = this.companyCode();
    this.step.set('basic');
    this.error.set(null);
    void this.router.navigate(['/company-master/new'], {
      queryParams: { step: 'basic', companyCode },
      queryParamsHandling: 'merge',
    });
  }

  private navigateToCompanyDetails(companyCode: string): void {
    void this.router.navigate(['/company-master', companyCode], {
      queryParams: { step: null, companyCode: null },
      queryParamsHandling: 'merge',
    });
  }

  private navigateToStep(step: Exclude<CompanySetupStep, 'basic'>, companyCode: string): void {
    this.companyCode.set(companyCode);
    this.step.set(step);
    if (step === 'department' && this.departmentForms.length === 0) {
      this.addDepartment();
    }
    this.loadDivisions(companyCode, step === 'division');
    void this.router.navigate(['/company-master/new'], {
      queryParams: { step, companyCode },
      queryParamsHandling: 'merge',
    });
  }

  private loadDivisions(companyCode: string, populateDivisionForms: boolean): void {
    this.structureApi
      .apiCompaniesCompanyCodeDivisionsGet({ companyCode })
      .pipe(
        tap((divisions) => {
          this.divisionOptions.set(divisions);
          if (populateDivisionForms && this.divisionForms.length === 0) {
            for (const division of divisions) {
              this.divisionForms.push(this.toDivisionForm(division));
            }
            this.savedDivisionCodes.set(
              new Set(divisions.map((division) => division.divisionCode)),
            );
          }
          if (this.step() === 'department' && this.departmentForms.length === 0) {
            this.addDepartment();
          }
        }),
        catchError((error: unknown) => {
          this.applyStructureError(error);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private toDivisionForm(division: DivisionDto): FormGroup<DivisionFormControls> {
    const form = new FormGroup<DivisionFormControls>({
      divisionCode: new FormControl(division.divisionCode, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(12)],
      }),
      name: new FormControl(division.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      shortName: new FormControl(division.shortName ?? '', { nonNullable: true }),
      address1: new FormControl(division.address1 ?? '', { nonNullable: true }),
      address2: new FormControl(division.address2 ?? '', { nonNullable: true }),
      address3: new FormControl(division.address3 ?? '', { nonNullable: true }),
      inCharge: new FormControl(division.inCharge ?? '', { nonNullable: true }),
      phone: new FormControl(division.phone ?? '', { nonNullable: true }),
      email: new FormControl(division.email ?? '', { nonNullable: true }),
    });
    form.disable({ emitEvent: false });
    return form;
  }

  private populateForm(company: CompanyDto): void {
    this.form.patchValue(
      {
        companyCode: company.companyCode,
        companyName: company.companyName,
        shortName: company.shortName ?? '',
        address1: company.address1 ?? '',
        address2: company.address2 ?? '',
        address3: company.address3 ?? '',
        incorporationDate: this.parseDateOnly(company.incorporationDate),
        referenceNumber: company.referenceNumber ?? '',
        licenceIssueDate: this.parseDateOnly(company.licenceIssueDate),
        licenceExpiryDate: this.parseDateOnly(company.licenceExpiryDate),
        companyInCharge: company.companyInCharge ?? '',
        phone: company.phone ?? '',
        email: company.email ?? '',
        website: company.website ?? '',
      },
      { emitEvent: false },
    );
    this.form.controls.companyCode.disable({ emitEvent: false });
    this.form.controls.companyName.disable({ emitEvent: false });
  }

  private toCreateRequest(value: CompanyFormValue): CreateCompanyRequest {
    return {
      companyCode: value.companyCode,
      companyName: value.companyName,
      shortName: value.shortName || null,
      address1: value.address1 || null,
      address2: value.address2 || null,
      address3: value.address3 || null,
      incorporationDate: this.toDateOnly(value.incorporationDate),
      referenceNumber: value.referenceNumber || null,
      licenceIssueDate: this.toDateOnly(value.licenceIssueDate),
      licenceExpiryDate: this.toDateOnly(value.licenceExpiryDate),
      companyInCharge: value.companyInCharge || null,
      phone: value.phone || null,
      email: value.email || null,
      website: value.website || null,
    };
  }

  private toUpdateRequest(value: CompanyFormValue): UpdateCompanyRequest {
    return {
      shortName: value.shortName || null,
      address1: value.address1 || null,
      address2: value.address2 || null,
      address3: value.address3 || null,
      incorporationDate: this.toDateOnly(value.incorporationDate),
      referenceNumber: value.referenceNumber || null,
      licenceIssueDate: this.toDateOnly(value.licenceIssueDate),
      licenceExpiryDate: this.toDateOnly(value.licenceExpiryDate),
      companyInCharge: value.companyInCharge || null,
      phone: value.phone || null,
      email: value.email || null,
      website: value.website || null,
    };
  }

  private toDateOnly(value: Date | null): string | null {
    if (!value) {
      return null;
    }

    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }

  private parseDateOnly(value: string | null | undefined): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const parsed = new Date(year, month, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month && parsed.getDate() === day
      ? parsed
      : null;
  }

  private focusFirstInvalidField(): void {
    const firstInvalid = FIELD_ORDER.find((field) => this.form.controls[field].invalid);
    if (!firstInvalid) {
      return;
    }

    const host: HTMLElement = this.elementRef.nativeElement;
    const element = host.querySelector<HTMLElement>(`[formControlName="${firstInvalid}"]`);
    if (element) {
      if (typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      element.focus();
    }
  }

  private applyApiError(error: unknown): void {
    if (!(error instanceof HttpErrorResponse)) {
      this.error.set('The company could not be saved. Please try again.');
      return;
    }

    let fieldErrorFound = false;
    const body = error.error;
    if (isRecord(body) && isRecord(body['errors'])) {
      for (const [name, messages] of Object.entries(body['errors'])) {
        const field = FIELD_ORDER.find(
          (candidate) => candidate.toLowerCase() === name.toLowerCase(),
        );
        const message = Array.isArray(messages)
          ? messages.filter((item): item is string => typeof item === 'string').join(' ')
          : '';
        if (field && message) {
          const control = this.form.controls[field];
          control.setErrors({ ...control.errors, server: message });
          control.markAsTouched();
          fieldErrorFound = true;
        }
      }
    }

    if (error.status === 409 && !this.editing()) {
      this.form.controls.companyCode.setErrors({
        ...this.form.controls.companyCode.errors,
        duplicate: true,
      });
      this.form.controls.companyCode.markAsTouched();
      fieldErrorFound = true;
    }

    if (!fieldErrorFound) {
      this.error.set(
        isRecord(body) && typeof body['detail'] === 'string'
          ? body['detail']
          : 'The company could not be saved. Please try again.',
      );
    }

    this.focusFirstInvalidField();
  }

  private applyStructureError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      const body = error.error;
      if (isRecord(body) && isRecord(body['errors'])) {
        const messages = Object.values(body['errors'])
          .flatMap((value) => (Array.isArray(value) ? value : []))
          .filter((value): value is string => typeof value === 'string');
        if (messages.length > 0) {
          this.error.set(messages.join(' '));
          return;
        }
      }
      this.error.set(
        isRecord(body) && typeof body['detail'] === 'string'
          ? body['detail']
          : 'The company structure could not be saved. Check the details and try again.',
      );
      return;
    }
    this.error.set('The company structure could not be saved. Please try again.');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasDateParts(value: object): boolean {
  return 'day' in value && 'month' in value && 'year' in value;
}
