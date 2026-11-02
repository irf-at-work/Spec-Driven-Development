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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, map, of, switchMap, tap } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyDto } from '../../api/generated/model/companyDto';
import { CreateCompanyRequest } from '../../api/generated/model/createCompanyRequest';
import { UpdateCompanyRequest } from '../../api/generated/model/updateCompanyRequest';
import { CompanyFields } from '../../shared/company-fields/company-fields';

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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
    this.saving.set(true);
    const request = this.editing()
      ? this.api.apiCompaniesCompanyCodePut({
          companyCode: value.companyCode,
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
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasDateParts(value: object): boolean {
  return 'day' in value && 'month' in value && 'year' in value;
}
