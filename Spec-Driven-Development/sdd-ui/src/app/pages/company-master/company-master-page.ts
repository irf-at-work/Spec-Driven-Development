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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import {
  ApiCompaniesGetRequestParams,
  CompanyService,
} from '../../api/generated/api/company.service';
import { CompanyListItemDto } from '../../api/generated/model/companyListItemDto';

const FILTERS = [
  { key: 'companyName', label: 'Company name' },
  { key: 'shortName', label: 'Short name' },
  { key: 'primaryAddress', label: 'Primary address' },
  { key: 'incorporationDate', label: 'Incorporation date', type: 'date' },
  { key: 'referenceNumber', label: 'Reference number' },
  { key: 'licenceIssueDate', label: 'Licence issue date', type: 'date' },
  { key: 'licenceExpiryDate', label: 'Licence expiry date', type: 'date' },
  { key: 'companyInCharge', label: 'Company in charge' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'website', label: 'Website' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

const SORTABLE_COLUMNS: readonly string[] = FILTERS.map(({ key }) => key);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
  ],
  selector: 'app-company-master-page',
  styleUrl: './company-master-page.css',
  templateUrl: './company-master-page.html',
})
export class CompanyMasterPage implements OnInit {
  private readonly api = inject(CompanyService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly filters = FILTERS;
  readonly displayedColumns = ['actions', ...FILTERS.map(({ key }) => key)];
  readonly filterColumns = ['filter-actions', ...FILTERS.map(({ key }) => `filter-${key}`)];
  readonly queryState = signal<ApiCompaniesGetRequestParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'companyName',
    sortDirection: 'asc',
  });
  readonly companies = signal<CompanyListItemDto[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => this.readQueryState(params)),
        switchMap((query) => {
          this.queryState.set(query);
          this.loading.set(true);
          this.error.set(null);

          return this.api.apiCompaniesGet(query).pipe(
            tap((result) => {
              this.companies.set(result.items ?? []);
              this.totalCount.set(result.totalCount ?? 0);
            }),
            catchError(() => {
              this.companies.set([]);
              this.totalCount.set(0);
              this.error.set('Companies could not be loaded. Please try again.');
              return EMPTY;
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  filterValue(key: FilterKey): string {
    return this.queryState()[key] ?? '';
  }

  setFilterFromEvent(key: FilterKey, event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.navigateWithQuery({ [key]: target.value || null, page: 1 });
    }
  }

  setSort(sort: Sort): void {
    if (sort.direction && SORTABLE_COLUMNS.includes(sort.active)) {
      this.navigateWithQuery({ sortBy: sort.active, sortDirection: sort.direction, page: 1 });
    }
  }

  setPage(event: PageEvent): void {
    this.navigateWithQuery({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }

  openCompany(companyCode: string): void {
    void this.router.navigate(['/company-master', companyCode], {
      queryParamsHandling: 'preserve',
    });
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) {
      return value;
    }

    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  historyText(company: CompanyListItemDto): string {
    let historyTooltip = `Created by ${company.createdBy || 'Unknown'}`;
    if (!!company.lastUpdatedBy)
      historyTooltip.concat(`last updated by ${company.lastUpdatedBy}`);
    return historyTooltip;
  }

  private readQueryState(params: ParamMap): ApiCompaniesGetRequestParams {
    const state: ApiCompaniesGetRequestParams = {
      page: this.positiveInteger(params.get('page'), 1),
      pageSize: this.positiveInteger(params.get('pageSize'), 10),
      sortBy: this.sortColumn(params.get('sortBy')),
      sortDirection: params.get('sortDirection') === 'desc' ? 'desc' : 'asc',
    };

    for (const { key } of FILTERS) {
      const value = params.get(key);
      if (value) {
        state[key] = value;
      }
    }

    return state;
  }

  private positiveInteger(value: string | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private sortColumn(value: string | null): string {
    return value && SORTABLE_COLUMNS.includes(value) ? value : 'companyName';
  }

  private navigateWithQuery(queryParams: Record<string, string | number | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
