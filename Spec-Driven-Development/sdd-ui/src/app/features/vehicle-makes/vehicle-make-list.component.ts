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
import { isApiProblemError } from '../../core/api-problem';
import { VehicleMakeListItemDto, VehicleMakesClient } from '../../generated/api-client';
import { ColumnFilterChange, ColumnFilterComponent } from '../../shared/column-filter/column-filter.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { NotificationService } from '../../shared/notifications/notification.service';

@Component({
  selector: 'app-vehicle-make-list',
  imports: [
    MatPaginatorModule,
    MatProgressBar,
    MatSortModule,
    MatTableModule,
    ColumnFilterComponent,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-make-list.component.html',
  styleUrl: './vehicle-make-list.component.css',
})
export class VehicleMakeListComponent {
  private readonly client = inject(VehicleMakesClient);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = 10;
  protected readonly columns = ['makeCode', 'makeName', 'shortName', 'status', 'actions'];

  protected readonly items = signal<VehicleMakeListItemDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly pageIndex = signal(0);

  // Column filters state
  protected readonly makeCodeFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'contains' });
  protected readonly makeNameFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'contains' });
  protected readonly shortNameFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'contains' });
  protected readonly statusFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'equals' });

  protected readonly sortColumn = signal('makeCode');
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly loading = signal(false);
  protected readonly loadFailed = signal(false);

  protected readonly hasActiveFilter = computed(() => {
    return !!(
      this.makeCodeFilter().value ||
      this.makeNameFilter().value ||
      this.shortNameFilter().value ||
      this.statusFilter().value
    );
  });

  protected readonly emptyMessage = computed(() =>
    this.hasActiveFilter()
      ? 'No vehicle makes match your filters. Try adjusting or clearing the filter values.'
      : 'There are no vehicle makes yet. Select Add to create the first one.',
  );

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);

    const activeVal = this.statusFilter().value ? this.statusFilter().value === 'true' : undefined;
    const activeOp = this.statusFilter().value ? this.statusFilter().operator : undefined;

    this.client
      .list(
        this.pageIndex() + 1,
        this.makeCodeFilter().value || undefined,
        this.makeCodeFilter().value ? this.makeCodeFilter().operator : undefined,
        this.makeNameFilter().value || undefined,
        this.makeNameFilter().value ? this.makeNameFilter().operator : undefined,
        this.shortNameFilter().value || undefined,
        this.shortNameFilter().value ? this.shortNameFilter().operator : undefined,
        activeVal,
        activeOp,
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

  protected onFilterChange(column: 'makeCode' | 'makeName' | 'shortName' | 'status', change: ColumnFilterChange): void {
    if (column === 'makeCode') this.makeCodeFilter.set(change);
    else if (column === 'makeName') this.makeNameFilter.set(change);
    else if (column === 'shortName') this.shortNameFilter.set(change);
    else if (column === 'status') this.statusFilter.set(change);

    // Returning to page 1 on filter changes is required by FR-030
    this.pageIndex.set(0);
    this.load();
  }

  protected onSort(sort: Sort): void {
    if (!sort.direction) {
      this.sortColumn.set('makeCode');
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
    void this.router.navigate(['/vehicle-makes/new']);
  }

  protected open(make: VehicleMakeListItemDto): void {
    void this.router.navigate(['/vehicle-makes/view'], { state: { makeCode: make.makeCode } });
  }

  protected async confirmDelete(make: VehicleMakeListItemDto): Promise<void> {
    const code = make.makeCode;
    const confirmed = await this.notifications.confirm({
      title: `Delete vehicle make ${code}?`,
      text: 'This deletion is permanent and cannot be undone.',
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Cancel',
      isDanger: true,
    });

    if (!confirmed) {
      return;
    }

    this.client
      .delete(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.success('Vehicle make deleted.');
          this.load();
        },
        error: (err: unknown) => {
          if (isApiProblemError(err) && err.problem.status === 409) {
            const makeErrors = err.problem.fieldErrors['makeCode'];
            const message = Array.isArray(makeErrors) && makeErrors.length > 0
              ? makeErrors[0]
              : 'This make still has models. Delete its models first.';
            this.notifications.error(message, 'Cannot delete make');
          } else {
            this.notifications.error('The vehicle make could not be deleted.', 'Delete failed');
          }
        },
      });
  }
}
