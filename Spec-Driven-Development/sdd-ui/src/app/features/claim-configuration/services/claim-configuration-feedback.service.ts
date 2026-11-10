import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

@Injectable({ providedIn: 'root' })
export class ClaimConfigurationFeedbackService {
  async confirmDeleteClaimConfiguration(ccmCode: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this claim configuration?',
      text: `Delete claim configuration "${ccmCode}"? Configurations with Applicable Products cannot be deleted.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    return result.isConfirmed;
  }

  async confirmDeleteProduct(ccmCode: string, productCode: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this Applicable Product?',
      text: `Delete Product Code "${productCode}" from claim configuration "${ccmCode}"?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    return result.isConfirmed;
  }

  showSuccess(message: string): void {
    void Swal.fire({ icon: 'success', title: 'Success', text: message, confirmButtonText: 'OK' });
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
