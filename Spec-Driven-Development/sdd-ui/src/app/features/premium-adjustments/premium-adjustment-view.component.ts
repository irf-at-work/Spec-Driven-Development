import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AdjustmentCodeDto, PremiumAdjustmentsClient } from '../../generated/api-client';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';

interface AdjustmentKey {
  codeType: string;
  code: string;
  companyCode: string;
}

@Component({
  selector: 'app-premium-adjustment-view',
  imports: [IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Premium Adjustment Details</h1>
          <p class="subtitle">Read-only adjustment code information.</p>
        </div>
        <app-icon-button
          action="back"
          tooltip="Back to premium adjustments"
          accessibleName="Back to premium adjustments"
          (clicked)="back()"
        />
      </header>

      @if (loading()) {
        <p role="status">Loading premium adjustment…</p>
      } @else if (loadFailed()) {
        <p role="alert">
          The premium adjustment could not be loaded. Return to the list and try again.
        </p>
      } @else if (adjustment(); as item) {
        <dl class="details">
          <dt>Code Type</dt>
          <dd>{{ item.codeTypeDescription }}</dd>
          <dt>Code</dt>
          <dd>{{ item.code }}</dd>
          <dt>Company Code</dt>
          <dd>{{ item.companyCode }}</dd>
          <dt>Name</dt>
          <dd>{{ item.name }}</dd>
          <dt>Short Name</dt>
          <dd>{{ item.shortName }}</dd>
          <dt>Discount Type</dt>
          <dd>{{ item.discountType || '—' }}</dd>
          <dt>Charges Type</dt>
          <dd>{{ item.chargesType || '—' }}</dd>
          <dt>Charges Category</dt>
          <dd>{{ item.chargesCategory || '—' }}</dd>
          <dt>Status</dt>
          <dd>{{ item.active ? 'Active' : 'Inactive' }}</dd>
          <dt>Remarks</dt>
          <dd>{{ item.remarks || '—' }}</dd>
          <dt>Arabic Name</dt>
          <dd dir="rtl">{{ item.arabicName || '—' }}</dd>
          <dt>Arabic Short Name</dt>
          <dd dir="rtl">{{ item.arabicShortName || '—' }}</dd>
          <dt>Arabic Remarks</dt>
          <dd dir="rtl">{{ item.arabicRemarks || '—' }}</dd>
        </dl>
      }
    </section>
  `,
  styles: `
    .page {
      margin: 0 auto;
      padding: 24px 24px 48px;
    }
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--sdd-text);
    }
    .subtitle {
      margin: 0;
      color: var(--sdd-muted);
    }
    .details {
      display: grid;
      grid-template-columns: minmax(140px, 220px) minmax(0, 1fr);
      gap: 12px 20px;
    }
    dt {
      font-weight: 600;
    }
    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }
  `,
})
export class PremiumAdjustmentViewComponent {
  private readonly client = inject(PremiumAdjustmentsClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly adjustment = signal<AdjustmentCodeDto | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);

  constructor() {
    const key = this.adjustmentKey(window.history.state);
    if (!key) {
      this.loading.set(false);
      this.loadFailed.set(true);
      return;
    }

    this.client
      .get(key.codeType, key.code, key.companyCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (adjustment) => {
          this.adjustment.set(adjustment);
          this.loading.set(false);
        },
        error: () => {
          this.loadFailed.set(true);
          this.loading.set(false);
        },
      });
  }

  protected back(): void {
    void this.router.navigate(['/premium-adjustments']);
  }

  private adjustmentKey(state: unknown): AdjustmentKey | null {
    if (typeof state !== 'object' || state === null) {
      return null;
    }

    if (
      !('codeType' in state) ||
      !('code' in state) ||
      !('companyCode' in state) ||
      typeof state.codeType !== 'string' ||
      typeof state.code !== 'string' ||
      typeof state.companyCode !== 'string'
    ) {
      return null;
    }

    return {
      codeType: state.codeType,
      code: state.code,
      companyCode: state.companyCode,
    };
  }
}
