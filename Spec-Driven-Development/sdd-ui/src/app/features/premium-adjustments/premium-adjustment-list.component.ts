import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { PremiumAdjustmentsClient, AdjustmentCodeListItemDto } from '../../generated/api-client';
import { isApiProblemError } from '../../core/api-problem';
import {
  ColumnFilterChange,
  ColumnFilterComponent,
} from '../../shared/column-filter/column-filter.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { NotificationService } from '../../shared/notifications/notification.service';

type TextColumn = 'codeType' | 'code' | 'companyCode' | 'name' | 'shortName';
interface Filter {
  value: string;
  operator: string;
}

function isTextColumn(value: string): value is TextColumn {
  return ['codeType', 'code', 'companyCode', 'name', 'shortName'].includes(value);
}

@Component({
  selector: 'app-premium-adjustment-list',
  imports: [
    MatPaginatorModule,
    MatProgressBar,
    MatSortModule,
    MatTableModule,
    ColumnFilterComponent,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './premium-adjustment-list.component.html',
  styleUrl: './premium-adjustment-list.component.css',
})
export class PremiumAdjustmentListComponent {
  private readonly client = inject(PremiumAdjustmentsClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(NotificationService);

  protected readonly pageSize = 10;
  protected readonly columns = [
    'codeType',
    'code',
    'companyCode',
    'name',
    'shortName',
    'status',
    'actions',
  ];
  protected readonly items = signal<AdjustmentCodeListItemDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly filters = signal<Record<TextColumn, Filter>>({
    codeType: { value: '', operator: 'contains' },
    code: { value: '', operator: 'contains' },
    companyCode: { value: '', operator: 'contains' },
    name: { value: '', operator: 'contains' },
    shortName: { value: '', operator: 'contains' },
  });
  protected readonly activeFilter = signal<Filter>({ value: '', operator: 'equals' });
  protected readonly sortColumn = signal<TextColumn>('codeType');
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly loading = signal(false);
  protected readonly loadFailed = signal(false);

  protected readonly hasActiveFilter = computed(
    () =>
      Object.values(this.filters()).some((filter) => !!filter.value) || !!this.activeFilter().value,
  );
  protected readonly emptyMessage = computed(() =>
    this.hasActiveFilter()
      ? 'No premium adjustments match your filters. Try adjusting or clearing the filter values.'
      : 'There are no premium adjustments yet. Select Add to create the first one.',
  );

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    const text = this.filters();
    const active = this.activeFilter();
    const activeValue = active.value ? active.value === 'true' : undefined;

    this.client
      .list(
        this.pageIndex() + 1,
        text.codeType.value || undefined,
        text.codeType.value ? text.codeType.operator : undefined,
        text.code.value || undefined,
        text.code.value ? text.code.operator : undefined,
        text.companyCode.value || undefined,
        text.companyCode.value ? text.companyCode.operator : undefined,
        text.name.value || undefined,
        text.name.value ? text.name.operator : undefined,
        text.shortName.value || undefined,
        text.shortName.value ? text.shortName.operator : undefined,
        activeValue,
        active.value ? active.operator : undefined,
        this.sortColumn(),
        this.sortDirection(),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.items.set(result.items ?? []);
          this.totalCount.set(result.totalCount ?? 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadFailed.set(true);
        },
      });
  }

  protected onTextFilterChange(column: TextColumn, change: ColumnFilterChange): void {
    this.filters.update((filters) => ({ ...filters, [column]: change }));
    this.pageIndex.set(0);
    this.load();
  }

  protected onActiveFilterChange(change: ColumnFilterChange): void {
    this.activeFilter.set(change);
    this.pageIndex.set(0);
    this.load();
  }

  protected onSort(sort: Sort): void {
    if (!sort.direction || !isTextColumn(sort.active)) {
      this.sortColumn.set('codeType');
      this.sortDirection.set('asc');
    } else {
      this.sortColumn.set(sort.active);
      this.sortDirection.set(sort.direction);
    }
    this.pageIndex.set(0);
    this.load();
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.load();
  }

  protected add(): void {
    void this.router.navigate(['/premium-adjustments/new']);
  }

  protected open(item: AdjustmentCodeListItemDto): void {
    void this.router.navigate(['/premium-adjustments/view'], {
      state: { codeType: item.codeType, code: item.code, companyCode: item.companyCode },
    });
  }

  protected async delete(item: AdjustmentCodeListItemDto): Promise<void> {
    const confirmed = await this.notifications.confirm({
      title: 'Delete premium adjustment?',
      text: 'This deletion is permanent and cannot be undone. Turning Active off is the reversible alternative.',
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) {
      return;
    }

    this.client
      .delete(item.codeType, item.code, item.companyCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.success('Premium adjustment deleted.');
          if (this.items().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((page) => page - 1);
          }
          this.load();
        },
        error: (error: unknown) => {
          if (isApiProblemError(error) && error.problem.status === 404) {
            this.notifications.info(
              'This premium adjustment was already deleted. The list has been refreshed.',
            );
            this.load();
            return;
          }
          this.notifications.error(
            'The premium adjustment could not be deleted. Please refresh the list and try again.',
          );
        },
      });
  }
}
