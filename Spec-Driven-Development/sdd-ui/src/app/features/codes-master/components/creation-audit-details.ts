import { Component, computed, input, signal } from '@angular/core';
import { CodeRecord } from '../../../api/generated/models/code-record';

@Component({
  selector: 'app-creation-audit-details',
  standalone: true,
  styleUrl: './creation-audit-details.css',
  templateUrl: './creation-audit-details.html',
})
export class CreationAuditDetails {
  readonly record = input.required<CodeRecord>();
  protected readonly isOpen = signal(false);
  protected readonly details = computed(() => {
    const record = this.record();
    const creator = record.createdBy ?? 'Not recorded';
    const date = this.formatDisplayDate(record.createdDate);
    return `Created By: ${creator}; Created Date: ${date}`;
  });

  protected open(): void {
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  private formatDisplayDate(value: string | null | undefined): string {
    if (!value) {
      return 'Not recorded';
    }

    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable';
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric',
    })
      .format(date)
      .replaceAll(' ', '-')
      .replaceAll('.', '');
  }
}
