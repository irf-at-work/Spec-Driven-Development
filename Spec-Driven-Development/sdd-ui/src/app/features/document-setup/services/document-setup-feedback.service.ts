import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

@Injectable({ providedIn: 'root' })
export class DocumentSetupFeedbackService {
  async confirmDiscardChanges(): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Discard unsaved changes?',
      text: 'Your changes will be lost if you leave this page.',
      showCancelButton: true,
      confirmButtonText: 'Discard',
      cancelButtonText: 'Stay',
    });

    return result.isConfirmed;
  }

  async confirmDeleteApplicableModule(damodUid: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this Applicable Module?',
      text: `Delete Applicable Module "${damodUid}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    return result.isConfirmed;
  }

  async confirmDeleteDocumentSetup(docCode: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this document setup?',
      text: `Delete document setup "${docCode}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
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

  showError(message: string): void {
    void Swal.fire({
      icon: 'error',
      title: 'Unable to complete action',
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
