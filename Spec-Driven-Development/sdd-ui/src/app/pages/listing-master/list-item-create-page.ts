import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ListItemService } from '../../api/generated/api/listItem.service';
import { CreateListItemRequest } from '../../api/generated/model/createListItemRequest';
import { LIST_ITEM_FORM_FIELDS, ListItemForm, ListItemFormValue } from './list-item-form';
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemForm, MatButtonModule, RouterLink, MatIcon],
  selector: 'app-list-item-create-page',
  styleUrl: './list-item-create-page.css',
  templateUrl: './list-item-create-page.html',
})
export class ListItemCreatePage {
  private readonly api = inject(ListItemService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly validationErrors = signal<Partial<Record<keyof ListItemFormValue, string>>>({});

  create(value: ListItemFormValue): void {
    this.error.set(null);
    this.validationErrors.set({});
    this.saving.set(true);
    this.api
      .apiListItemsPost({ createListItemRequest: this.createRequest(value) })
      .pipe(
        catchError((error: unknown) => {
          const validationErrors = this.readValidationErrors(error);
          this.validationErrors.set(validationErrors);
          this.error.set(
            error instanceof HttpErrorResponse && error.status === 409
              ? 'A list item with this type and code already exists.'
              : Object.keys(validationErrors).length > 0
                ? 'Please correct the highlighted fields.'
                : 'The list item could not be created. Please try again.',
          );
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((item) => {
        void this.router.navigate(['/listing-master', item.liType, item.liCode], {
          queryParamsHandling: 'preserve',
        });
      });
  }

  private createRequest(value: ListItemFormValue): CreateListItemRequest {
    return {
      liType: value.liType,
      liCode: value.liCode,
      description: value.description || null,
      descriptionL2: value.descriptionL2 || null,
      shortDescription: value.shortDescription || null,
      shortDescriptionL2: value.shortDescriptionL2 || null,
      value: value.value || null,
      activeYn: value.activeYn,
      flex01: value.flex01 || null,
      flex02: value.flex02 || null,
    };
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
      )
        continue;
      const message = messages
        .filter((value): value is string => typeof value === 'string')
        .join(' ');
      if (message) errors[field as keyof ListItemFormValue] = message;
    }
    return errors;
  }
}
