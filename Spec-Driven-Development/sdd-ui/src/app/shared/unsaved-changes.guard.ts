import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { openConfirmDialog } from './confirm-dialog/confirm-dialog.component';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/** Asks before leaving a page that has changes which were not saved (Back, a link, or the browser's back button). */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (page) => {
  if (!page.hasUnsavedChanges()) {
    return true;
  }

  return openConfirmDialog(inject(MatDialog), {
    title: 'Discard your changes?',
    message: 'You have changes that have not been saved. If you leave now, they will be lost.',
    confirmLabel: 'Discard changes',
    cancelLabel: 'Keep editing',
    destructive: true,
  });
};
