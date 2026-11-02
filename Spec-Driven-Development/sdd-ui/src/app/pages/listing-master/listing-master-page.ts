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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import {
  ApiListItemsGetRequestParams,
  ListItemService,
} from '../../api/generated/api/listItem.service';
import { ListItemFilterOperator } from '../../api/generated/model/listItemFilterOperator';
import { ListItemListItemDto } from '../../api/generated/model/listItemListItemDto';
import { FilterChange, FilterControl } from '../../shared/filter-control/filter-control';

const FILTERS = [
  { key: 'liType', label: 'List type', operatorKey: 'liTypeOperator' },
  { key: 'liCode', label: 'List code', operatorKey: 'liCodeOperator' },
  { key: 'description', label: 'Description', operatorKey: 'descriptionOperator' },
  { key: 'shortDescription', label: 'Short description', operatorKey: 'shortDescriptionOperator' },
  { key: 'value', label: 'Value', operatorKey: 'valueOperator' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];
type OperatorKey = (typeof FILTERS)[number]['operatorKey'];
const SORTABLE_COLUMNS: readonly string[] = [...FILTERS.map(({ key }) => key), 'activeYn'];
const OPERATOR_VALUES = Object.values(ListItemFilterOperator);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
    FilterControl,
  ],
  selector: 'app-listing-master-page',
  styleUrl: './listing-master-page.css',
  templateUrl: './listing-master-page.html',
})
export class ListingMasterPage implements OnInit {
  private readonly api = inject(ListItemService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly filters = FILTERS;
  readonly displayedColumns = [...FILTERS.map(({ key }) => key), 'activeYn', 'actions'];
  readonly filterColumns = [
    ...FILTERS.map(({ key }) => `filter-${key}`),
    'filter-activeYn',
    'filter-actions',
  ];
  readonly queryState = signal<ApiListItemsGetRequestParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'liType',
    sortDirection: 'asc',
  });
  readonly unselectedFilterValues = signal<Partial<Record<FilterKey, string>>>({});
  readonly unselectedFilterOperators = signal<Partial<Record<FilterKey, ListItemFilterOperator>>>(
    {},
  );
  readonly items = signal<ListItemListItemDto[]>([]);
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

          return this.api.apiListItemsGet(query).pipe(
            tap((result) => {
              this.items.set(result.items ?? []);
              this.totalCount.set(result.totalCount ?? 0);
            }),
            catchError(() => {
              this.items.set([]);
              this.totalCount.set(0);
              this.error.set('List items could not be loaded. Please try again.');
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
    return this.unselectedFilterValues()[key] ?? this.queryState()[key] ?? '';
  }

  filterOperator(key: OperatorKey): ListItemFilterOperator | null {
    const filter = FILTERS.find((entry) => entry.operatorKey === key)!;
    return this.unselectedFilterOperators()[filter.key] ?? this.queryState()[key] ?? null;
  }

  setFilter(key: FilterKey, change: FilterChange): void {
    const filter = FILTERS.find((entry) => entry.key === key)!;
    const value = change.value.trim();
    const operator = this.validOperator(change.operator) ? change.operator : null;
    if (!operator) {
      this.unselectedFilterValues.update((values) => ({ ...values, [key]: change.value }));
      return;
    }

    this.unselectedFilterValues.update(({ [key]: _, ...values }) => values);
    this.unselectedFilterOperators.update((operators) => ({ ...operators, [key]: operator }));
    if (!value) {
      this.navigateWithQuery({ [key]: null, [filter.operatorKey]: null, page: 1 });
      return;
    }

    this.unselectedFilterOperators.update(({ [key]: _, ...operators }) => operators);
    this.navigateWithQuery({ [key]: value, [filter.operatorKey]: operator, page: 1 });
  }

  clearFilter(key: FilterKey): void {
    const filter = FILTERS.find((entry) => entry.key === key)!;
    this.unselectedFilterValues.update(({ [key]: _, ...values }) => values);
    this.unselectedFilterOperators.update(({ [key]: _, ...operators }) => operators);
    this.navigateWithQuery({ [key]: null, [filter.operatorKey]: null, page: 1 });
  }

  setActiveFilter(value: string): void {
    this.navigateWithQuery({ activeYn: value || null, page: 1 });
  }

  setSort(sort: Sort): void {
    if (sort.direction && SORTABLE_COLUMNS.includes(sort.active)) {
      this.navigateWithQuery({ sortBy: sort.active, sortDirection: sort.direction, page: 1 });
    }
  }

  setPage(event: PageEvent): void {
    this.navigateWithQuery({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }

  openItem(item: ListItemListItemDto): void {
    void this.router.navigate(['/listing-master', item.liType, item.liCode], {
      queryParamsHandling: 'preserve',
    });
  }

  historyText(item: ListItemListItemDto): string {
    return `Created by ${item.createdBy || 'Unknown'}${item.lastUpdatedBy ? `; last updated by ${item.lastUpdatedBy}` : ''}`;
  }

  private readQueryState(params: ParamMap): ApiListItemsGetRequestParams {
    const state: ApiListItemsGetRequestParams = {
      page: this.positiveInteger(params.get('page'), 1),
      pageSize: this.pageSize(params.get('pageSize')),
      sortBy: this.sortColumn(params.get('sortBy')),
      sortDirection: params.get('sortDirection') === 'desc' ? 'desc' : 'asc',
    };

    for (const { key, operatorKey } of FILTERS) {
      const value = params.get(key);
      const operator = params.get(operatorKey);
      if (value && this.validOperator(operator)) {
        state[key] = value;
        state[operatorKey] = operator;
      }
    }

    const activeYn = params.get('activeYn');
    if (activeYn === 'Y' || activeYn === 'N') state.activeYn = activeYn;
    return state;
  }

  private validOperator(value: string | null): value is ListItemFilterOperator {
    return value !== null && OPERATOR_VALUES.includes(value as ListItemFilterOperator);
  }

  private positiveInteger(value: string | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private pageSize(value: string | null): number {
    const parsed = this.positiveInteger(value, 10);
    return [10, 25, 50].includes(parsed) ? parsed : 10;
  }

  private sortColumn(value: string | null): string {
    return value && SORTABLE_COLUMNS.includes(value) ? value : 'liType';
  }

  private navigateWithQuery(queryParams: Record<string, string | number | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
