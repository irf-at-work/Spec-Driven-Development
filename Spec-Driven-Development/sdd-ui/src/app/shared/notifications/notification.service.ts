import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /**
   * Shows a short, plain-text toast or alert. Never uses HTML.
   */
  success(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      text: message,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
    });
  }

  error(message: string, title = 'Error'): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'OK',
    });
  }

  info(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      text: message,
      showConfirmButton: false,
      timer: 3500,
    });
  }

  /**
   * Asks the user to confirm a permanent or destructive action.
   * Returns a promise resolving to true if confirmed, false if cancelled.
   */
  async confirm(options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDanger?: boolean;
  }): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: options.isDanger ? '#b3261e' : '#1d4e89',
      cancelButtonColor: '#4a5666',
      confirmButtonText: options.confirmButtonText ?? 'Confirm',
      cancelButtonText: options.cancelButtonText ?? 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    return result.isConfirmed;
  }
}
