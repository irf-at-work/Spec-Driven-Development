import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

@Injectable({ providedIn: 'root' })
export class CodesFeedbackService {
  async confirmDelete(code: string, codeType: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this code?',
      text: `Delete code "${code}" with Code Type "${codeType}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--app-accent-strong')
        .trim(),
    });

    return result.isConfirmed;
  }

  showSuccess(message: string): void {
    void Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  showRequiredFieldsValidation(fields: string[]): void {
    void Swal.fire({
      icon: 'warning',
      title: 'Required fields',
      text: `${fields.join(', ')} ${fields.length === 1 ? 'is' : 'are'} required.`,
      confirmButtonText: 'OK',
    });
  }
}
