import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PageNumberNavigation } from '../../../shared/page-number-navigation';
import { ClaimConfigurationSummary } from '../../../api/generated/models/claim-configuration-summary';
import { ClaimConfigurationSortColumn } from '../../../api/generated/models/claim-configuration-sort-column';
import {
  CodeColumnFilterValue,
  CodeFilterColumn,
  ColumnFilterControl,
} from '../../codes-master/components/column-filter-control';
import { ClaimConfigurationApiService } from '../services/claim-configuration-api.service';
import { ClaimConfigurationFeedbackService } from '../services/claim-configuration-feedback.service';
import { ListClaimConfigurations$Params } from '../../../api/generated/fn/operations/list-claim-configurations';
import { CreationAuditDetails } from '../../codes-master/components/creation-audit-details';

type ClaimConfigurationPageSize = 10 | 15 | 20 | 50;

@Component({
  selector: 'app-claim-configurations-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColumnFilterControl,
    CreationAuditDetails,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    PageNumberNavigation,
    RouterLink,
  ],
  styleUrl: './claim-configurations-list-page.css',
  templateUrl: './claim-configurations-list-page.html',
})
export class ClaimConfigurationsListPage implements OnInit {
  private readonly api = inject(ClaimConfigurationApiService);
  private readonly feedback = inject(ClaimConfigurationFeedbackService);

  protected readonly columns = ['companyCode', 'ccmCode', 'ccmName', 'shortName', 'moduleName', 'actions'];
  protected readonly filters = signal<Partial<Record<CodeFilterColumn, CodeColumnFilterValue>>>({});
  protected readonly filterDraftValues = signal<Partial<Record<CodeFilterColumn, string>>>({});
  protected readonly hasActiveFilters = computed(() => Object.keys(this.filters()).length > 0);
  protected readonly records = signal<ClaimConfigurationSummary[]>([]);
  protected readonly page = signal(1);
  protected readonly pageSize = signal<ClaimConfigurationPageSize>(10);
  protected readonly pageSizes: ClaimConfigurationPageSize[] = [10, 15, 20, 50];
  protected readonly sortActive = signal('ccmCode');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly totalCount = signal(0);
  protected readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly deleteError = signal('');
  protected readonly isDeleting = signal(false);

  ngOnInit(): void {
    void this.loadPage(1);
  }

  protected async loadPage(page: number, pageSize = this.pageSize()): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);
    try {
      const result = await this.api.list(page, pageSize, this.filterParams());
      const returnedPageSize =
        result.pageSize === 10 || result.pageSize === 15 || result.pageSize === 20 || result.pageSize === 50
          ? result.pageSize
          : null;
      if (returnedPageSize === null) {
        throw new Error('The server returned an unsupported claim configuration page size.');
      }

      this.records.set(result.items);
      this.page.set(result.page);
      this.pageSize.set(returnedPageSize);
      this.totalCount.set(result.totalCount);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.records.set([]);
      this.totalCount.set(0);
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onPageNumberChange(page: number): void {
    void this.loadPage(page);
  }

  protected onPageSizeChange(pageSize: ClaimConfigurationPageSize): void {
    void this.loadPage(1, pageSize);
  }

  protected onSortChange(sort: Sort): void {
    const sortColumn = this.toSortColumn(sort.active);
    if (sortColumn === null || (sort.direction !== 'asc' && sort.direction !== 'desc')) {
      return;
    }

    this.sortActive.set(sort.active);
    this.sortDirection.set(sort.direction);
    void this.loadPage(1);
  }

  protected onFilterChange(column: CodeFilterColumn, filter: CodeColumnFilterValue | null): void {
    this.filters.update((currentFilters) => {
      const nextFilters = { ...currentFilters };
      if (filter === null) {
        delete nextFilters[column];
      } else {
        nextFilters[column] = filter;
      }
      return nextFilters;
    });
    void this.loadPage(1);
  }

  protected onFilterDraftChange(column: CodeFilterColumn, value: string): void {
    this.filterDraftValues.update((currentValues) => ({ ...currentValues, [column]: value }));
  }

  protected clearAllFilters(): void {
    if (!this.hasActiveFilters()) {
      return;
    }

    this.filters.set({});
    this.filterDraftValues.set({});
    void this.loadPage(1);
  }

  protected async deleteRecord(record: ClaimConfigurationSummary): Promise<void> {
    if (this.isDeleting() || !(await this.feedback.confirmDeleteClaimConfiguration(record.ccmCode))) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set('');
    try {
      await this.api.delete(record.ccmCode);
      this.feedback.showSuccess('Claim configuration deleted successfully.');
      const nextPage = this.records().length === 1 && this.page() > 1 ? this.page() - 1 : this.page();
      await this.loadPage(nextPage);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.deleteError.set(
        error.status === 409
          ? 'Delete Applicable Products before deleting this claim configuration.'
          : 'The claim configuration could not be deleted. Please try again.',
      );
    } finally {
      this.isDeleting.set(false);
    }
  }

  private filterParams(): ListClaimConfigurations$Params {
    const activeFilters = this.filters();
    return {
      companyCodeOperator: activeFilters.companyCode?.operator,
      companyCodeValue: activeFilters.companyCode?.value,
      ccmCodeOperator: activeFilters.ccmCode?.operator,
      ccmCodeValue: activeFilters.ccmCode?.value,
      ccmNameOperator: activeFilters.ccmName?.operator,
      ccmNameValue: activeFilters.ccmName?.value,
      shortNameOperator: activeFilters.shortName?.operator,
      shortNameValue: activeFilters.shortName?.value,
      moduleNameOperator: activeFilters.moduleName?.operator,
      moduleNameValue: activeFilters.moduleName?.value,
      sortBy: this.toSortColumn(this.sortActive()) ?? 'Code',
      sortDirection: this.sortDirection() === 'desc' ? 'Descending' : 'Ascending',
    };
  }

  private toSortColumn(active: string): ClaimConfigurationSortColumn | null {
    switch (active) {
      case 'companyCode':
        return 'CompanyCode';
      case 'ccmCode':
        return 'Code';
      case 'ccmName':
        return 'Name';
      case 'shortName':
        return 'ShortName';
      case 'moduleName':
        return 'ModuleName';
      default:
        return null;
    }
  }
}
