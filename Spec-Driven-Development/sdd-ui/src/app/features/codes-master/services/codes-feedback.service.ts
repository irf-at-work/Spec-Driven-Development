import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CodesFeedbackService {
  readonly successMessage = signal<string | null>(null);

  showSuccess(message: string): void {
    this.successMessage.set(message);
  }

  clearSuccess(): void {
    this.successMessage.set(null);
  }
}
