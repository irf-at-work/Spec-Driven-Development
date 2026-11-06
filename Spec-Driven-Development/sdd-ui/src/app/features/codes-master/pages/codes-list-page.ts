import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CodeRecord } from '../../../api/generated/models/code-record';
import { ListCodes$Params } from '../../../api/generated/fn/operations/list-codes';
import { CodeSortColumn } from '../../../api/generated/models/code-sort-column';
import { CodesApiService } from '../services/codes-api.service';
import { CodesFeedbackService } from '../services/codes-feedback.service';
import { CreationAuditDetails } from '../components/creation-audit-details';
import { PageNumberNavigation } from '../../../shared/page-number-navigation';
import {
  CodeColumnFilterValue,
  CodeFilterColumn,
  ColumnFilterControl,
} from '../components/column-filter-control';

@Component({
  selector: 'app-codes-list-page',
  standalone: true,
  imports: [
    ColumnFilterControl,
    CreationAuditDetails,
    MatButtonModule,
    MatSortModule,
    MatTableModule,
    PageNumberNavigation,
    RouterLink,
  ],
  styleUrl: './codes-list-page.css',
  templateUrl: './codes-list-page.html',
})
export class CodesListPage implements OnInit {
  private readonly codesApi = inject(CodesApiService);
  private readonly feedback = inject(CodesFeedbackService);

  protected readonly columns = ['code', 'description', 'type', 'value1', 'value2', 'actions'];
  protected readonly filters = signal<Partial<Record<CodeFilterColumn, CodeColumnFilterValue>>>({});
  protected readonly filterDraftValues = signal<Partial<Record<CodeFilterColumn, string>>>({});
  protected readonly hasActiveFilters = computed(() => Object.keys(this.filters()).length > 0);
  protected readonly records = signal<CodeRecord[]>([]);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly sortActive = signal('code');
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
      const result = await this.codesApi.list(page, pageSize, this.filterParams());
      this.records.set(result.items);
      this.page.set(result.page);
      this.pageSize.set(result.pageSize);
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
    this.filterDraftValues.update((currentValues) => ({
      ...currentValues,
      [column]: value,
    }));
  }

  protected clearAllFilters(): void {
    if (!this.hasActiveFilters()) {
      return;
    }

    this.filters.set({});
    this.filterDraftValues.set({});
    void this.loadPage(1);
  }

  protected async deleteRecord(record: CodeRecord): Promise<void> {
    if (this.isDeleting()) {
      return;
    }

    const confirmed = await this.feedback.confirmDelete(record.code, record.codeType);
    if (!confirmed) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set('');
    try {
      await this.codesApi.delete(record.code, record.codeType);
      this.feedback.showSuccess('Code deleted successfully.');
      const nextPage =
        this.records().length === 1 && this.page() > 1 ? this.page() - 1 : this.page();
      await this.loadPage(nextPage);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.deleteError.set(
        error.status === 409
          ? 'This code cannot be deleted because another record depends on it.'
          : 'The code could not be deleted. Please try again.',
      );
    } finally {
      this.isDeleting.set(false);
    }
  }

  private filterParams(): ListCodes$Params {
    const activeFilters = this.filters();
    return {
      codeOperator: activeFilters.code?.operator,
      codeValue: activeFilters.code?.value,
      codeDescriptionOperator: activeFilters.codeDescription?.operator,
      codeDescriptionValue: activeFilters.codeDescription?.value,
      codeTypeOperator: activeFilters.codeType?.operator,
      codeTypeValue: activeFilters.codeType?.value,
      value1Operator: activeFilters.value1?.operator,
      value1Value: activeFilters.value1?.value,
      value2Operator: activeFilters.value2?.operator,
      value2Value: activeFilters.value2?.value,
      sortBy: this.toSortColumn(this.sortActive()) ?? 'Code',
      sortDirection: this.sortDirection() === 'desc' ? 'Descending' : 'Ascending',
    };
  }

  private toSortColumn(active: string): CodeSortColumn | null {
    switch (active) {
      case 'code':
        return 'Code';
      case 'description':
        return 'CodeDescription';
      case 'type':
        return 'CodeType';
      case 'value1':
        return 'Value1';
      case 'value2':
        return 'Value2';
      default:
        return null;
    }
  }
}
