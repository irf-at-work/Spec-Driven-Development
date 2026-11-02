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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyDto } from '../../api/generated/model/companyDto';
import { UpdateCompanyRequest } from '../../api/generated/model/updateCompanyRequest';
import { CompanyFields } from '../../shared/company-fields/company-fields';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
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

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
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

  historyText(company: CompanyDto): string {
    return `Created by ${company.createdBy || 'Unknown'}; last updated by ${company.lastUpdatedBy || 'Unknown'}`;
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
