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
import { Subject, debounceTime } from 'rxjs';
import { isApiProblemError } from '../../core/api-problem';
import { NotificationService } from '../../shared/notifications/notification.service';
import {
  ClaimConfigurationListItem,
  ClaimConfigurationListService,
} from './claim-configuration-list.service';
import {
  ColumnFilterChange,
  ColumnFilterComponent,
} from '../../shared/column-filter/column-filter.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';

type TextColumn = 'ccmCode' | 'name' | 'shortName' | 'module';
type Filter = { value: string; operator: string };

function isTextColumn(value: string): value is TextColumn {
  return ['ccmCode', 'name', 'shortName', 'module'].includes(value);
}

@Component({
  selector: 'app-claim-configuration-list',
  imports: [
    MatPaginatorModule,
    MatProgressBar,
    MatSortModule,
    MatTableModule,
    ColumnFilterComponent,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './claim-configuration-list.component.html',
  styleUrl: './claim-configuration-list.component.css',
})
export class ClaimConfigurationListComponent {
  private readonly service = inject(ClaimConfigurationListService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(NotificationService);
  private readonly textFilterChanges = new Subject<{ column: TextColumn; change: ColumnFilterChange }>();

  protected readonly pageSizeOptions = [10, 25, 50];
  protected readonly pageSize = signal(10);
  protected readonly columns = ['ccmCode', 'name', 'shortName', 'module', 'status', 'actions'];
  protected readonly items = signal<ClaimConfigurationListItem[]>([]);
  protected readonly moduleNames = signal<Record<string, string>>({});
  protected readonly writesEnabled = signal(false);
  protected readonly totalCount = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly filters = signal<Record<TextColumn, Filter>>({
    ccmCode: { value: '', operator: 'contains' },
    name: { value: '', operator: 'contains' },
    shortName: { value: '', operator: 'contains' },
    module: { value: '', operator: 'contains' },
  });
  protected readonly activeFilter = signal<Filter>({ value: '', operator: 'equals' });
  protected readonly sortColumn = signal<TextColumn>('ccmCode');
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly loading = signal(false);
  protected readonly loadFailed = signal(false);
  protected readonly hasActiveFilter = computed(
    () => Object.values(this.filters()).some((filter) => !!filter.value) || !!this.activeFilter().value,
  );
  protected readonly emptyMessage = computed(() =>
    this.hasActiveFilter()
      ? 'No claim configurations match your filters. Adjust or clear a filter and try again.'
      : 'There are no claim configurations to display.',
  );

  constructor() {
    this.textFilterChanges
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ column, change }) => this.applyTextFilter(column, change));
    this.service.writeStatus().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (status) => this.writesEnabled.set(status.enabled),
      error: () => this.writesEnabled.set(false),
    });
    this.service.choices('module').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (choices) => this.moduleNames.set(Object.fromEntries(choices.map((choice) => [choice.code, choice.description]))),
      error: () => this.moduleNames.set({}),
    });
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.service
      .list({
        page: this.pageIndex() + 1,
        pageSize: this.pageSize(),
        sortBy: this.sortColumn(),
        sortDirection: this.sortDirection(),
        filters: this.filters(),
        active: this.activeFilter(),
      })
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
    this.textFilterChanges.next({ column, change });
  }

  protected onActiveFilterChange(change: ColumnFilterChange): void {
    this.activeFilter.set(change);
    this.pageIndex.set(0);
    this.load();
  }

  protected onSort(sort: Sort): void {
    if (!sort.direction || !isTextColumn(sort.active)) {
      this.sortColumn.set('ccmCode');
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
    this.pageSize.set(event.pageSize);
    this.load();
  }

  protected open(item: ClaimConfigurationListItem): void {
    void this.router.navigate(['/claim-configurations', item.ccmCode], {
      state: { ccmCode: item.ccmCode },
    });
  }

  protected add(): void {
    void this.router.navigate(['/claim-configurations/new']);
  }

  protected moduleName(item: ClaimConfigurationListItem): string {
    return item.module ? this.moduleNames()[item.module] ?? item.module : '—';
  }

  protected async delete(item: ClaimConfigurationListItem): Promise<void> {
    const confirmed = await this.notifications.confirm({
      title: `Delete claim configuration ${item.ccmCode}?`,
      text: 'This permanently deletes the configuration. Linked products must be removed first; their records will not be changed.',
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;

    this.service.delete(item.ccmCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.notifications.success('Claim configuration deleted.');
        if (this.items().length === 1 && this.pageIndex() > 0) this.pageIndex.update((page) => page - 1);
        this.load();
      },
      error: (error: unknown) => {
        if (isApiProblemError(error) && error.problem.status === 404) {
          this.notifications.info('This claim configuration was already deleted. The list has been refreshed.');
          this.load();
        } else if (isApiProblemError(error) && error.problem.status === 409) {
          this.notifications.error('Remove the linked products before deleting this claim configuration.', 'Cannot delete configuration');
        } else if (isApiProblemError(error) && error.problem.status === 503) {
          this.notifications.error('Deletes are disabled until claim configuration writes are enabled.', 'Delete unavailable');
        } else {
          this.notifications.error('The claim configuration could not be deleted. Please refresh the list and try again.', 'Delete failed');
        }
      },
    });
  }

  private applyTextFilter(column: TextColumn, change: ColumnFilterChange): void {
    this.filters.update((filters) => ({ ...filters, [column]: change }));
    this.pageIndex.set(0);
    this.load();
  }
}
