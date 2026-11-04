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
import { ListItemService } from '../../api/generated/api/listItem.service';
import { ListItemDto } from '../../api/generated/model/listItemDto';
import { LIST_ITEM_FORM_FIELDS, ListItemForm, ListItemFormValue } from './list-item-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemForm, MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  selector: 'app-list-item-details-page',
  styleUrl: './list-item-details-page.css',
  templateUrl: './list-item-details-page.html',
})
export class ListItemDetailsPage implements OnInit {
  private readonly api = inject(ListItemService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly item = signal<ListItemDto | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly editing = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly deleteError = signal<string | null>(null);
  readonly validationErrors = signal<Partial<Record<keyof ListItemFormValue, string>>>({});

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => ({
          liType: params.get('liType'),
          liCode: params.get('liCode'),
        })),
        switchMap(({ liType, liCode }) => {
          if (!liType || !liCode) {
            this.loadError.set('A list type and code are required to view a list item.');
            return EMPTY;
          }
          this.item.set(null);
          this.loading.set(true);
          this.loadError.set(null);
          return this.api.apiListItemsLiTypeLiCodeGet({ liType, liCode }).pipe(
            tap((item) => this.item.set(item)),
            catchError((error: unknown) => {
              this.loadError.set(
                error instanceof HttpErrorResponse && error.status === 404
                  ? 'This list item could not be found.'
                  : 'List item details could not be loaded. Please try again.',
              );
              return EMPTY;
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  save(value: ListItemFormValue): void {
    const item = this.item();
    if (!item) return;
    this.saving.set(true);
    this.error.set(null);
    this.validationErrors.set({});
    this.api
      .apiListItemsLiTypeLiCodePut({
        liType: item.liType,
        liCode: item.liCode,
        updateListItemRequest: this.updateRequest(value),
      })
      .pipe(
        catchError((error: unknown) => {
          const validationErrors = this.readValidationErrors(error);
          this.validationErrors.set(validationErrors);
          this.error.set(
            Object.keys(validationErrors).length > 0
              ? 'Please correct the highlighted fields.'
              : 'The list item could not be saved. Your changes are still available to retry.',
          );
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updated) => {
        this.item.set(updated);
        this.editing.set(false);
      });
  }

  deleteItem(): void {
    const item = this.item();
    if (!item || !window.confirm(`Delete list item ${item.liType} / ${item.liCode}?`)) return;
    this.deleting.set(true);
    this.deleteError.set(null);
    this.api
      .apiListItemsLiTypeLiCodeDelete({ liType: item.liType, liCode: item.liCode })
      .pipe(
        catchError((error: unknown) => {
          this.deleteError.set(
            error instanceof HttpErrorResponse && error.status === 409
              ? 'This list item is referenced by other records and cannot be deleted.'
              : 'The list item could not be deleted. Please try again.',
          );
          return EMPTY;
        }),
        finalize(() => this.deleting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        void this.router.navigate(['/listing-master'], { queryParamsHandling: 'preserve' });
      });
  }

  startEditing(): void {
    this.error.set(null);
    this.validationErrors.set({});
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.editing.set(false);
    this.error.set(null);
    this.validationErrors.set({});
  }

  formatAuditDate(value: string | null | undefined): string {
    if (!value) return '';
    const timestamp = new Date(value);
    if (Number.isNaN(timestamp.getTime())) return value;
    const gulfTime = new Date(timestamp.getTime() + 4 * 60 * 60 * 1000);
    const day = String(gulfTime.getUTCDate()).padStart(2, '0');
    const month = String(gulfTime.getUTCMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${gulfTime.getUTCFullYear()}`;
  }

  private readValidationErrors(error: unknown): Partial<Record<keyof ListItemFormValue, string>> {
    if (
      !(error instanceof HttpErrorResponse) ||
      typeof error.error !== 'object' ||
      error.error === null ||
      !('errors' in error.error) ||
      typeof error.error.errors !== 'object' ||
      error.error.errors === null
    ) {
      return {};
    }

    const errors: Partial<Record<keyof ListItemFormValue, string>> = {};
    for (const [field, messages] of Object.entries(error.error.errors)) {
      if (
        !LIST_ITEM_FORM_FIELDS.includes(field as keyof ListItemFormValue) ||
        !Array.isArray(messages)
      ) {
        continue;
      }
      const message = messages
        .filter((value): value is string => typeof value === 'string')
        .join(' ');
      if (message) errors[field as keyof ListItemFormValue] = message;
    }
    return errors;
  }

  private updateRequest(value: ListItemFormValue) {
    return {
      description: value.description,
      descriptionL2: value.descriptionL2,
      shortDescription: value.shortDescription,
      shortDescriptionL2: value.shortDescriptionL2,
      value: value.value,
      activeYn: value.activeYn,
      flex01: value.flex01,
      flex02: value.flex02,
    };
  }
}
