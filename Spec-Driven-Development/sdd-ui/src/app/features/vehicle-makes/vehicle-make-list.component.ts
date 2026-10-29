import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { isApiProblemError } from '../../core/api-problem';
import { VehicleMakeListItemDto, VehicleMakesClient } from '../../generated/api-client';
import { openConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog.component';

const SEARCH_DELAY_MS = 300;
const MESSAGE_DURATION_MS = 5000;

@Component({
  selector: 'app-vehicle-make-list',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBar,
    MatSortModule,
    MatTableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vehicle-make-list.component.html',
  styleUrl: './vehicle-make-list.component.css',
})
export class VehicleMakeListComponent {
  private readonly client = inject(VehicleMakesClient);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  // The page size is fixed by the API (constitution B8); the paginator only displays it.
  protected readonly pageSize = 10;
  protected readonly columns = ['makeCode', 'makeName', 'shortName', 'status', 'actions'];

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  protected readonly items = signal<VehicleMakeListItemDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly searchText = signal('');
  protected readonly sortColumn = signal('makeCode');
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly loading = signal(false);
  protected readonly loadFailed = signal(false);

  protected readonly emptyMessage = computed(() =>
    this.searchText()
      ? 'No vehicle makes match your search. Try a different code or name.'
      : 'There are no vehicle makes yet. Select "Add vehicle make" to create the first one.',
  );

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(SEARCH_DELAY_MS),
        map((text) => text.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((text) => {
        this.searchText.set(text);
        this.pageIndex.set(0);
        this.load();
      });

    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);

    this.client
      .list(this.pageIndex() + 1, this.searchText(), this.sortColumn(), this.sortDirection())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.items.set(result.items ?? []);
          this.totalCount.set(result.totalCount ?? 0);
          this.loading.set(false);
        },
        // The interceptor has already told the user what went wrong; this shows the page's own retry option.
        error: () => {
          this.loadFailed.set(true);
          this.loading.set(false);
        },
      });
  }

  protected onSort(sort: Sort): void {
    this.sortColumn.set(sort.active);
    this.sortDirection.set(sort.direction === 'desc' ? 'desc' : 'asc');
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

  // The code travels in the navigation state, not the address, so the address bar stays clean.
  protected open(make: VehicleMakeListItemDto): void {
    void this.router.navigate(['/vehicle-makes/view'], { state: { makeCode: make.makeCode } });
  }

  protected confirmDelete(make: VehicleMakeListItemDto): void {
    openConfirmDialog(this.dialog, {
      title: 'Delete this vehicle make?',
      message: `${make.makeName} (${make.makeCode}) will be permanently deleted. This cannot be undone.`,
      confirmLabel: 'Delete permanently',
      cancelLabel: 'Cancel',
      destructive: true,
    })
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.client.delete(make.makeCode)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Vehicle make deleted.', 'Close', { duration: MESSAGE_DURATION_MS });
          // Deleting the only row on the last page would leave an empty page, so step back one.
          if (this.items().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((index) => index - 1);
          }
          this.load();
        },
        // The interceptor has explained most problems (for example, someone else deleted it first). A make that still
        // has models is refused with a sentence written by the API, so it is shown here, then the list is refreshed.
        error: (error: unknown) => {
          if (isApiProblemError(error) && error.problem.status === 409) {
            const message = error.problem.fieldErrors['makeCode']?.[0];
            if (message) {
              this.snackBar.open(message, 'Close', { duration: MESSAGE_DURATION_MS });
            }
          }
          this.load();
        },
      });
  }
}
