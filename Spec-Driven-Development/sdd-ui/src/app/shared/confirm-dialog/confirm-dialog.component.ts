import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { map, Observable } from 'rxjs';

export interface ConfirmDialogData {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  /** Styles the confirm button as a warning, for actions that cannot be undone. */
  readonly destructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton type="button" [matDialogClose]="false" cdkFocusInitial>
        {{ data.cancelLabel }}
      </button>
      <button
        matButton="filled"
        type="button"
        [class.destructive]="data.destructive"
        [matDialogClose]="true"
      >
        {{ data.confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .destructive {
      --mat-button-filled-container-color: #b3261e;
      --mat-button-filled-label-text-color: #ffffff;
    }
  `,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}

/** Opens the shared yes/no dialog and emits true only when the user confirms. Closing it any other way emits false. */
export function openConfirmDialog(dialog: MatDialog, data: ConfirmDialogData): Observable<boolean> {
  return dialog
    .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
      data,
      width: '440px',
      autoFocus: false,
    })
    .afterClosed()
    .pipe(map((confirmed) => confirmed === true));
}
