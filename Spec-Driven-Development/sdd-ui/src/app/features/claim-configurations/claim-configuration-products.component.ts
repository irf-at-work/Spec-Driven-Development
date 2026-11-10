import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { isApiProblemError } from '../../core/api-problem';
import { NotificationService } from '../../shared/notifications/notification.service';
import {
  AssociatedProduct,
  AvailableProduct,
  ClaimConfigurationListService,
} from './claim-configuration-list.service';

@Component({
  selector: 'app-claim-configuration-products',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="product-section" aria-labelledby="applicable-products-heading">
      <header class="product-header">
        <h2 id="applicable-products-heading">Applicable Products</h2>
        <button type="button" class="primary" [disabled]="!writesEnabled()" (click)="openDialog()">Add Product</button>
      </header>

      @if (errorMessage()) { <p class="error" role="alert">{{ errorMessage() }}</p> }
      @if (loading()) { <p role="status">Loading applicable products…</p> }
      <div class="table-wrap">
        <table>
          <thead><tr><th>Product Code</th><th>Product Name</th><th>Action</th></tr></thead>
          <tbody>
            @for (product of products(); track product.productCode) {
              <tr>
                <td>{{ product.productCode }}</td>
                <td>{{ product.productType }} - {{ product.description }}</td>
                <td><button type="button" class="delete" [disabled]="!writesEnabled()" [attr.aria-label]="'Delete product ' + product.productCode" (click)="deleteProduct(product)">Delete</button></td>
              </tr>
            } @empty {
              @if (!loading()) { <tr><td colspan="3">No products are linked to this configuration.</td></tr> }
            }
          </tbody>
        </table>
      </div>
      <footer class="pager">
        <span>{{ totalCount() }} products</span>
        <div>
          <button type="button" [disabled]="loading() || page() <= 1" (click)="changePage(page() - 1)">Previous</button>
          <span>Page {{ page() }}</span>
          <button type="button" [disabled]="loading() || page() * pageSize >= totalCount()" (click)="changePage(page() + 1)">Next</button>
        </div>
      </footer>
    </section>

    @if (dialogOpen()) {
      <div class="backdrop">
        <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="available-products-title">
          <header><h2 id="available-products-title">Available Products</h2></header>
          @if (dialogError()) { <p class="error" role="alert">{{ dialogError() }}</p> }
          <label class="choice-field">
            <span>Product Code</span>
            <select name="productCode" [(ngModel)]="selectedProductCode" [disabled]="choicesLoading()">
              <option value="">Select a product</option>
              @for (choice of choices(); track choice.productCode) {
                <option [value]="choice.productCode">{{ choice.productCode }} - {{ choice.productType }} - {{ choice.description }}</option>
              }
            </select>
          </label>
          @if (choicesLoading()) { <p role="status">Loading products…</p> }
          @if (!choicesLoading() && choices().length === 0) { <p>No active products are available in STD_LIST_ITEM type CCM_PRODUCT.</p> }
          <div class="choice-pager">
            <span>Choices page {{ choicePage() }}</span>
            <button type="button" [disabled]="choicesLoading() || choicePage() <= 1" (click)="loadChoicePage(choicePage() - 1)">Previous choices</button>
            <button type="button" [disabled]="choicesLoading() || choicePage() * choicePageSize >= choiceTotal()" (click)="loadChoicePage(choicePage() + 1)">More choices</button>
          </div>
          <footer>
            <button type="button" (click)="closeDialog()">Cancel</button>
            <button type="button" class="primary" [disabled]="!selectedProductCode || adding() || choicesLoading()" (click)="addProduct()">{{ adding() ? 'Adding…' : 'Add Product' }}</button>
          </footer>
        </section>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .product-section { margin-top: 24px; padding: 20px; border: 1px solid var(--sdd-border); border-radius: 8px; background: var(--sdd-surface); }
    .product-header, .pager, .pager > div, .choice-pager, .dialog footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .product-header { margin-bottom: 14px; }
    h2 { margin: 0; font-size: 1.2rem; font-weight: 600; color: var(--sdd-text); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; border-bottom: 1px solid var(--sdd-border); text-align: start; }
    th { font-weight: 600; }
    button { min-height: 36px; padding: 6px 14px; border: 1px solid var(--sdd-border); border-radius: 4px; background: var(--sdd-surface); color: var(--sdd-text); font: inherit; cursor: pointer; }
    button.primary { border-color: var(--sdd-accent); background: var(--sdd-accent); color: white; }
    button.delete { color: var(--sdd-danger, #b3261e); }
    button:disabled { cursor: not-allowed; opacity: .55; }
    .pager { margin-top: 12px; color: var(--sdd-muted); }
    .backdrop { position: fixed; z-index: 1000; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(0 0 0 / 45%); }
    .dialog { width: min(560px, 100%); padding: 24px; border-radius: 8px; background: var(--sdd-surface); box-shadow: 0 12px 36px rgb(0 0 0 / 24%); }
    .dialog header { margin-bottom: 22px; }
    .choice-field { display: flex; flex-direction: column; gap: 7px; font-weight: 600; }
    select { width: 100%; min-height: 42px; padding: 8px; border: 1px solid var(--sdd-border); border-radius: 4px; background: var(--sdd-surface); color: var(--sdd-text); font: inherit; }
    .choice-pager { margin-top: 14px; font-size: .9rem; }
    .dialog footer { justify-content: flex-end; margin-top: 24px; }
    .error { color: var(--sdd-danger, #b3261e); }
  `,
})
export class ClaimConfigurationProductsComponent implements OnInit {
  readonly ccmCode = input.required<string>();
  readonly writesEnabled = input(false);

  private readonly service = inject(ClaimConfigurationListService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = 5;
  protected readonly choicePageSize = 10;
  protected readonly page = signal(1);
  protected readonly totalCount = signal(0);
  protected readonly products = signal<AssociatedProduct[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly dialogOpen = signal(false);
  protected readonly choicesLoading = signal(false);
  protected readonly choices = signal<AvailableProduct[]>([]);
  protected readonly choicePage = signal(1);
  protected readonly choiceTotal = signal(0);
  protected selectedProductCode = '';
  protected readonly dialogError = signal('');
  protected readonly adding = signal(false);

  ngOnInit(): void { this.loadProducts(); }

  protected loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.associatedProducts(this.ccmCode(), this.page(), this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.products.set(result.items ?? []);
          this.totalCount.set(result.totalCount ?? 0);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          if (isApiProblemError(error) && error.problem.status === 404) {
            this.errorMessage.set('This claim configuration was not found for the configured company.');
          } else if (isApiProblemError(error)) {
            this.errorMessage.set(`Applicable products could not be loaded (API ${error.problem.status}). Check the API log for this request.`);
          } else {
            this.errorMessage.set('The API could not be reached while loading applicable products.');
          }
          this.loading.set(false);
        },
      });
  }

  protected changePage(page: number): void {
    this.page.set(page);
    this.loadProducts();
  }

  protected openDialog(): void {
    this.dialogOpen.set(true);
    this.selectedProductCode = '';
    this.dialogError.set('');
    this.choices.set([]);
    this.choicePage.set(1);
    this.loadChoicePage(1);
  }

  protected loadChoicePage(page: number): void {
    this.choicesLoading.set(true);
    this.service.availableProducts(page, this.choicePageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.choicePage.set(result.page);
          this.choiceTotal.set(result.totalCount);
          this.choices.set(result.items ?? []);
          this.choicesLoading.set(false);
        },
        error: () => {
          this.dialogError.set('Product choices could not be loaded.');
          this.choicesLoading.set(false);
        },
      });
  }

  protected async closeDialog(): Promise<void> {
    if (this.selectedProductCode) {
      const confirmed = await this.notifications.confirm({
        title: 'Discard the selected product?',
        text: 'The product has not been added yet.',
        confirmButtonText: 'Discard selection',
        cancelButtonText: 'Keep selecting',
      });
      if (!confirmed) return;
    }
    this.dialogOpen.set(false);
    this.selectedProductCode = '';
  }

  protected addProduct(): void {
    if (!this.selectedProductCode) return;
    this.adding.set(true);
    this.dialogError.set('');
    this.service.addProduct(this.ccmCode(), this.selectedProductCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.adding.set(false);
          this.dialogOpen.set(false);
          this.selectedProductCode = '';
          this.notifications.success('Product linked to the claim configuration.');
          this.loadProducts();
        },
        error: (error: unknown) => {
          this.adding.set(false);
          if (isApiProblemError(error) && error.problem.status === 409) {
            this.dialogError.set('This product is already linked to the claim configuration.');
          } else if (isApiProblemError(error) && error.problem.status === 503) {
            this.dialogError.set('Writes are disabled until the CCM write gate is enabled.');
          } else {
            this.dialogError.set('The product could not be added. Check the selection and try again.');
          }
        },
      });
  }

  protected async deleteProduct(product: AssociatedProduct): Promise<void> {
    const confirmed = await this.notifications.confirm({
      title: `Remove product ${product.productCode}?`,
      text: 'This removes only the product association; it does not delete the CCM or product.',
      confirmButtonText: 'Remove association',
      cancelButtonText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;
    this.service.deleteProduct(this.ccmCode(), product.productCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.success('Product association removed.');
          if (this.products().length === 1 && this.page() > 1) this.page.update((page) => page - 1);
          this.loadProducts();
        },
        error: () => this.notifications.error('The product association could not be removed.'),
      });
  }
}
