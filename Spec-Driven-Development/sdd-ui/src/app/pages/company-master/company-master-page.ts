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
import {
  CompanyFilterOperator,
  FilterChange,
  FilterControl,
} from '../../shared/filter-control/filter-control';

const FILTERS = [
  { key: 'companyName', label: 'Company name', operatorKey: 'companyNameOperator' },
  { key: 'shortName', label: 'Short name', operatorKey: 'shortNameOperator' },
  { key: 'primaryAddress', label: 'Primary address', operatorKey: 'primaryAddressOperator' },
  { key: 'referenceNumber', label: 'Reference number', operatorKey: 'referenceNumberOperator' },
  { key: 'companyInCharge', label: 'Company in charge', operatorKey: 'companyInChargeOperator' },
  { key: 'phone', label: 'Phone', operatorKey: 'phoneOperator' },
  { key: 'email', label: 'Email', operatorKey: 'emailOperator' },
  { key: 'website', label: 'Website', operatorKey: 'websiteOperator' },
] as const;

const DATE_COLUMNS = [
  { key: 'incorporationDate', label: 'Incorporation date' },
  { key: 'licenceIssueDate', label: 'Licence issue date' },
  { key: 'licenceExpiryDate', label: 'Licence expiry date' },
] as const;

const COLUMNS = [
  FILTERS[0],
  FILTERS[1],
  FILTERS[2],
  DATE_COLUMNS[0],
  FILTERS[3],
  DATE_COLUMNS[1],
  DATE_COLUMNS[2],
  FILTERS[4],
  FILTERS[5],
  FILTERS[6],
  FILTERS[7],
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];
type OperatorKey = (typeof FILTERS)[number]['operatorKey'];

const SORTABLE_COLUMNS: readonly string[] = COLUMNS.map(({ key }) => key);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
    FilterControl,
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

  readonly filters = COLUMNS;
  readonly displayedColumns = [...COLUMNS.map(({ key }) => key), 'actions'];
  readonly filterColumns = [...COLUMNS.map(({ key }) => `filter-${key}`), 'filter-actions'];
  readonly columnWidths = signal<Record<string, number>>({});
  readonly queryState = signal<ApiCompaniesGetRequestParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'companyName',
    sortDirection: 'asc',
  });
  readonly unselectedFilterValues = signal<Partial<Record<FilterKey, string>>>({});
  readonly unselectedFilterOperators = signal<Partial<Record<FilterKey, CompanyFilterOperator>>>(
    {},
  );
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

  isFilterable(key: string): key is FilterKey {
    return FILTERS.some((filter) => filter.key === key);
  }

  operatorKey(key: FilterKey): OperatorKey {
    return FILTERS.find((filter) => filter.key === key)!.operatorKey;
  }

  filterValue(key: FilterKey): string {
    return this.unselectedFilterValues()[key] ?? this.queryState()[key] ?? '';
  }

  filterOperator(key: OperatorKey): CompanyFilterOperator | null {
    const filter = FILTERS.find((entry) => entry.operatorKey === key)!;
    return this.unselectedFilterOperators()[filter.key] ?? this.queryState()[key] ?? null;
  }

  setFilter(key: FilterKey, change: FilterChange): void {
    const filter = FILTERS.find((entry) => entry.key === key)!;
    const value = change.value.trim();

    if (!change.operator) {
      this.unselectedFilterValues.update((values) => ({ ...values, [key]: change.value }));
      return;
    }
    const operator = change.operator;

    this.unselectedFilterValues.update(({ [key]: _, ...values }) => values);
    this.unselectedFilterOperators.update((operators) => ({
      ...operators,
      [key]: operator,
    }));

    if (!value) {
      this.navigateWithQuery({ [key]: null, [filter.operatorKey]: null, page: 1 });
      return;
    }

    this.unselectedFilterOperators.update(({ [key]: _, ...operators }) => operators);
    this.navigateWithQuery({
      [key]: value,
      [filter.operatorKey]: operator,
      page: 1,
    });
  }

  clearFilter(key: FilterKey): void {
    const filter = FILTERS.find((entry) => entry.key === key)!;
    this.unselectedFilterValues.update(({ [key]: _, ...values }) => values);
    this.unselectedFilterOperators.update(({ [key]: _, ...operators }) => operators);
    this.navigateWithQuery({ [key]: null, [filter.operatorKey]: null, page: 1 });
  }

  resizeColumn(column: string, width: number): void {
    this.columnWidths.update((widths) => ({ ...widths, [column]: Math.max(100, width) }));
  }

  columnWidth(column: string): string | null {
    const width = this.columnWidths()[column];
    return width ? `${width}px` : null;
  }

  startResize(column: string, event: PointerEvent): void {
    const header = (event.target as HTMLElement).closest('th');
    if (!header) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = header.getBoundingClientRect().width;
    const move = (moveEvent: PointerEvent) =>
      this.resizeColumn(column, startWidth + moveEvent.clientX - startX);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
  }

  keyboardResize(column: string, event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const header = (event.target as HTMLElement).closest('th');
    const current = this.columnWidths()[column] ?? header?.getBoundingClientRect().width ?? 160;
    this.resizeColumn(column, current + (event.key === 'ArrowRight' ? 16 : -16));
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
    return `Created by ${company.createdBy || 'Unknown'}${company.lastUpdatedBy ? `; last updated by ${company.lastUpdatedBy}` : ''}`;
  }

  private readQueryState(params: ParamMap): ApiCompaniesGetRequestParams {
    const state: ApiCompaniesGetRequestParams = {
      page: this.positiveInteger(params.get('page'), 1),
      pageSize: this.positiveInteger(params.get('pageSize'), 10),
      sortBy: this.sortColumn(params.get('sortBy')),
      sortDirection: params.get('sortDirection') === 'desc' ? 'desc' : 'asc',
    };

    for (const { key, operatorKey } of FILTERS) {
      const value = params.get(key);
      const operator = params.get(operatorKey);
      if (
        value &&
        operator &&
        ['StartsWith', 'EndsWith', 'Contains', 'DoesNotContain', 'Equals', 'NotEquals'].includes(
          operator,
        )
      ) {
        state[key] = value;
        state[operatorKey] = operator as CompanyFilterOperator;
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
