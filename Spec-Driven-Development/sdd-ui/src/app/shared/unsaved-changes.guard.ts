import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { NotificationService } from './notifications/notification.service';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/** Asks before leaving a page that has changes which were not saved (Back, a link, or the browser's back button). */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = async (page) => {
  if (!page.hasUnsavedChanges()) {
    return true;
  }

  const notifications = inject(NotificationService);
  return await notifications.confirm({
    title: 'Discard your changes?',
    text: 'You have changes that have not been saved. If you leave now, they will be lost.',
    confirmButtonText: 'Discard changes',
    cancelButtonText: 'Keep editing',
    isDanger: true,
  });
};
