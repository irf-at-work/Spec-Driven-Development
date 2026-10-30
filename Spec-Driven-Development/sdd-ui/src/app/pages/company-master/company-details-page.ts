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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import { CompanyService } from '../../api/generated/api/company.service';
import { CompanyDto } from '../../api/generated/model/companyDto';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
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
  readonly deleteError = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('companyCode')),
        switchMap((companyCode) => {
          if (!companyCode) {
            this.error.set('A company code is required to view company details.');
            return EMPTY;
          }

          this.company.set(null);
          this.loading.set(true);
          this.error.set(null);

          return this.api.apiCompaniesCompanyCodeGet({ companyCode }).pipe(
            tap((company) => this.company.set(company)),
            catchError(() => {
              this.error.set('Company details could not be loaded.');
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
