import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimConfigurationDetail, ClaimConfigurationListService } from './claim-configuration-list.service';
import { IconButtonComponent } from '../../shared/icon-button/icon-button.component';

@Component({
  selector: 'app-claim-configuration-detail',
  imports: [IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Claim Configuration Details</h1>
          @if (configuration(); as item) {
            <p class="subtitle">{{ item.ccmCode }} · {{ item.name }}</p>
          }
        </div>
        <app-icon-button action="back" tooltip="Back to claim configurations"
          accessibleName="Back to claim configurations" (clicked)="back()" />
        <app-icon-button action="edit" tooltip="Edit claim configuration"
          accessibleName="Edit claim configuration" (clicked)="edit()" />
      </header>

      @if (loading()) {
        <p role="status">Loading claim configuration…</p>
      } @else if (loadFailed()) {
        <p role="alert">The claim configuration could not be loaded. Return to the list and try again.</p>
      } @else if (configuration(); as item) {
        <dl class="details">
          <dt>CCM Code</dt><dd>{{ item.ccmCode }}</dd>
          <dt>Claim Config Name</dt><dd>{{ item.name }}</dd>
          <dt>Short Name</dt><dd>{{ item.shortName || '—' }}</dd>
          <dt>Arabic Name</dt><dd dir="rtl">{{ item.nameL2 || '—' }}</dd>
          <dt>Arabic Short Name</dt><dd dir="rtl">{{ item.shortNameL2 || '—' }}</dd>
          <dt>Module</dt><dd>{{ item.module || '—' }}</dd>
          <dt>Accounting Posting Type</dt><dd>{{ item.accountingPostingType || '—' }}</dd>
          <dt>Accounting Exchange Rate Type</dt><dd>{{ item.accountingExchangeRateType || '—' }}</dd>
          <dt>Rounding Type</dt><dd>{{ item.roundingType || '—' }}</dd>
          <dt>Rounding Value</dt><dd>{{ item.roundingValue ?? '—' }}</dd>
          <dt>Applicable Currency Type</dt><dd>{{ item.applicableCurrencyType || '—' }}</dd>
          <dt>Default Estimated Closure Reason</dt><dd>{{ item.defaultEstimatedClosureReasonCode || '—' }}</dd>
          <dt>Recovery Code for Deduction</dt><dd>{{ item.defaultRecoveryDeductionCode || '—' }}</dd>
          <dt>Print Before Approval</dt><dd>{{ item.printBeforeApproval ? 'Yes' : 'No' }}</dd>
          <dt>Reprint</dt><dd>{{ item.reprint ? 'Yes' : 'No' }}</dd>
          <dt>Claim Accounting Document Generation</dt><dd>{{ item.claimAccountingDocumentGeneration ? 'Yes' : 'No' }}</dd>
          <dt>Claim Coinsurance Accounting Document Generation</dt><dd>{{ item.claimCoinsuranceAccountingDocumentGeneration ? 'Yes' : 'No' }}</dd>
          <dt>Status</dt><dd>{{ item.active ? 'Active' : 'Inactive' }}</dd>
          <dt>Created By</dt><dd>{{ item.createdBy || '—' }}</dd>
          <dt>Created At</dt><dd>{{ item.createdAt || '—' }}</dd>
          <dt>Updated By</dt><dd>{{ item.updatedBy || '—' }}</dd>
          <dt>Updated At</dt><dd>{{ item.updatedAt || '—' }}</dd>
        </dl>
      }
    </section>
  `,
  styles: `
    .page { margin: 0 auto; padding: 24px 24px 48px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
    h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 600; color: var(--sdd-text); }
    .subtitle { margin: 0; color: var(--sdd-muted); }
    .details { display: grid; grid-template-columns: minmax(190px, 260px) minmax(0, 1fr); gap: 12px 20px; }
    dt { font-weight: 600; }
    dd { margin: 0; overflow-wrap: anywhere; }
    @media (max-width: 640px) { .details { grid-template-columns: 1fr; gap: 4px; } dd { margin-bottom: 10px; } }
  `,
})
export class ClaimConfigurationDetailComponent {
  private readonly service = inject(ClaimConfigurationListService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly configuration = signal<ClaimConfigurationDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);

  constructor() {
    const ccmCode = this.route.snapshot.paramMap.get('ccmCode');
    if (!ccmCode) {
      this.loading.set(false);
      this.loadFailed.set(true);
      return;
    }
    this.service.get(ccmCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => { this.configuration.set(value); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadFailed.set(true); },
    });
  }

  protected back(): void {
    void this.router.navigate(['/claim-configurations']);
  }

  protected edit(): void {
    const code = this.configuration()?.ccmCode;
    if (code) void this.router.navigate(['/claim-configurations', code, 'edit']);
  }
}
