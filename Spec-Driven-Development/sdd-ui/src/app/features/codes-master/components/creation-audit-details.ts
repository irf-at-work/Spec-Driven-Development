import { Component, computed, input, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

interface AuditRecord {
  code?: string;
  ccmCode?: string;
  docCode?: string;
  createdBy?: string | null;
  createdDate?: string | null;
  updatedBy?: string | null;
  updatedDate?: string | null;
}

@Component({
  selector: 'app-creation-audit-details',
  standalone: true,
  imports: [OverlayModule],
  styleUrl: './creation-audit-details.css',
  templateUrl: './creation-audit-details.html',
})
export class CreationAuditDetails {
  readonly record = input.required<AuditRecord>();
  protected readonly isOpen = signal(false);
  protected readonly overlayPositions: ConnectedPosition[] = [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  ];
  protected readonly details = computed(() => {
    const record = this.record();
    const creator = record.createdBy ?? 'Not recorded';
    const createdDate = this.formatDisplayDate(record.createdDate);
    const updater = record.updatedBy ?? 'Not recorded';
    const updatedDate = this.formatDisplayDate(record.updatedDate);
    return `Created By: ${creator}; Created Date: ${createdDate}; Updated By: ${updater}; Updated Date: ${updatedDate}`;
  });
  protected readonly ariaLabel = computed(
    () =>
      `Audit details for ${
        this.record().code ?? this.record().ccmCode ?? this.record().docCode ?? 'record'
      }`,
  );

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  protected open(): void {
    this.cancelClose();
    this.isOpen.set(true);
  }

  protected close(): void {
    this.cancelClose();
    this.isOpen.set(false);
  }

  protected scheduleClose(): void {
    this.cancelClose();
    this.closeTimer = setTimeout(() => this.isOpen.set(false), 150);
  }

  protected cancelClose(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
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
