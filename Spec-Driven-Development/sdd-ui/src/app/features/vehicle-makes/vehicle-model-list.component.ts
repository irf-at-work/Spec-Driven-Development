import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  VehicleModelDto,
  VehicleModelsClient,
} from '../../generated/api-client';
import { ColumnFilterChange, ColumnFilterComponent } from '../../shared/column-filter/column-filter.component';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';
import { NotificationService } from '../../shared/notifications/notification.service';

@Component({
  selector: 'app-vehicle-model-list',
  imports: [
    MatPaginatorModule,
    MatProgressBar,
    MatTableModule,
    ColumnFilterComponent,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-model-list.component.html',
  styleUrl: './vehicle-model-list.component.css',
})
export class VehicleModelListComponent {
  private readonly router = inject(Router);
  private readonly modelsClient = inject(VehicleModelsClient);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly makeCode = input.required<string>();
  readonly makeEditable = input<boolean>(false);

  protected readonly pageSize = 10;
  protected readonly items = signal<VehicleModelDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly loading = signal(false);

  // Column filters state (Model Code, Model Name, Short Name, Status)
  protected readonly modelCodeFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'contains' });
  protected readonly modelNameFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'contains' });
  protected readonly shortNameFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'contains' });
  protected readonly statusFilter = signal<{ value: string; operator: string }>({ value: '', operator: 'equals' });

  protected readonly columns = computed(() => {
    return this.makeEditable()
      ? ['modelCode', 'modelName', 'shortName', 'status', 'actions']
      : ['modelCode', 'modelName', 'shortName', 'status'];
  });

  protected readonly hasActiveFilter = computed(() => {
    return !!(
      this.modelCodeFilter().value ||
      this.modelNameFilter().value ||
      this.shortNameFilter().value ||
      this.statusFilter().value
    );
  });

  protected readonly emptyMessage = computed(() => {
    if (this.hasActiveFilter()) {
      return 'No models match your filters. Try adjusting or clearing the filter values.';
    }
    return this.makeEditable()
      ? 'No models have been added for this make yet. Use Add to create the first model.'
      : 'No models have been added for this make.';
  });

  constructor() {
    effect(() => {
      const code = this.makeCode();
      if (code) {
        untracked(() => {
          this.pageIndex.set(0);
          this.load();
        });
      }
    });
  }

  hasUnsavedChanges(): boolean {
    return false; // Models are now managed on separate pages, so the list itself is never dirty
  }

  protected load(): void {
    const code = this.makeCode();
    if (!code) {
      this.items.set([]);
      this.totalCount.set(0);
      return;
    }

    this.loading.set(true);

    const activeVal = this.statusFilter().value ? this.statusFilter().value === 'true' : undefined;
    const activeOp = this.statusFilter().value ? this.statusFilter().operator : undefined;

    this.modelsClient
      .list(
        code,
        this.pageIndex() + 1,
        this.modelCodeFilter().value || undefined,
        this.modelCodeFilter().value ? this.modelCodeFilter().operator : undefined,
        this.modelNameFilter().value || undefined,
        this.modelNameFilter().value ? this.modelNameFilter().operator : undefined,
        this.shortNameFilter().value || undefined,
        this.shortNameFilter().value ? this.shortNameFilter().operator : undefined,
        activeVal,
        activeOp,
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
          this.notifications.error('The vehicle models could not be loaded.', 'Load error');
        },
      });
  }

  protected onFilterChange(column: 'modelCode' | 'modelName' | 'shortName' | 'status', change: ColumnFilterChange): void {
    if (column === 'modelCode') this.modelCodeFilter.set(change);
    else if (column === 'modelName') this.modelNameFilter.set(change);
    else if (column === 'shortName') this.shortNameFilter.set(change);
    else if (column === 'status') this.statusFilter.set(change);

    this.pageIndex.set(0);
    this.load();
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.load();
  }

  protected addModel(): void {
    void this.router.navigate(['/vehicle-makes', this.makeCode(), 'models', 'new']);
  }

  protected editModel(model: VehicleModelDto): void {
    void this.router.navigate(['/vehicle-makes', this.makeCode(), 'models', model.modelCode, 'edit']);
  }

  protected async deleteModel(model: VehicleModelDto): Promise<void> {
    const code = model.modelCode;
    const confirmed = await this.notifications.confirm({
      title: `Delete vehicle model ${code}?`,
      text: 'This deletion is permanent and cannot be undone.',
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Cancel',
      isDanger: true,
    });

    if (!confirmed) {
      return;
    }

    this.modelsClient
      .delete(this.makeCode(), code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.success('Vehicle model deleted.');
          this.load();
        },
        error: () => {
          this.notifications.error('The vehicle model could not be deleted.', 'Delete failed');
        },
      });
  }
}
