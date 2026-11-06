import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DocumentSetupSortColumn } from '../../../api/generated/models/document-setup-sort-column';
import { DocumentSetupSummary } from '../../../api/generated/models/document-setup-summary';
import { ListDocumentSetups$Params } from '../../../api/generated/fn/operations/list-document-setups';
import { CreationAuditDetails } from '../../codes-master/components/creation-audit-details';
import { PageNumberNavigation } from '../../../shared/page-number-navigation';
import {
  DocumentSetupApiService,
  DocumentSetupPageSize,
} from '../services/document-setup-api.service';
import { DocumentSetupFeedbackService } from '../services/document-setup-feedback.service';
import {
  CodeColumnFilterValue,
  CodeFilterColumn,
  ColumnFilterControl,
} from '../../codes-master/components/column-filter-control';

function isDocumentSetupPageSize(value: number): value is DocumentSetupPageSize {
  return value === 10 || value === 15 || value === 20 || value === 50;
}

@Component({
  selector: 'app-document-setups-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColumnFilterControl,
    CreationAuditDetails,
    MatButtonModule,
    MatSortModule,
    MatTableModule,
    PageNumberNavigation,
    RouterLink,
  ],
  styleUrl: './document-setups-list-page.css',
  templateUrl: './document-setups-list-page.html',
})
export class DocumentSetupsListPage implements OnInit {
  private readonly documentSetupApi = inject(DocumentSetupApiService);
  private readonly feedback = inject(DocumentSetupFeedbackService);

  protected readonly columns = [
    'docCode',
    'docName',
    'description',
    'setupFor',
    'activeYn',
    'actions',
  ];
  protected readonly filters = signal<Partial<Record<CodeFilterColumn, CodeColumnFilterValue>>>({});
  protected readonly filterDraftValues = signal<Partial<Record<CodeFilterColumn, string>>>({});
  protected readonly hasActiveFilters = computed(() => Object.keys(this.filters()).length > 0);
  protected readonly records = signal<DocumentSetupSummary[]>([]);
  protected readonly page = signal(1);
  protected readonly pageSize = signal<DocumentSetupPageSize>(10);
  protected readonly sortActive = signal('docCode');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly totalCount = signal(0);
  protected readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly deletingCode = signal<string | null>(null);

  ngOnInit(): void {
    void this.loadPage(1);
  }

  protected async loadPage(
    page: number,
    pageSize: DocumentSetupPageSize = this.pageSize(),
  ): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const result = await this.documentSetupApi.list(page, pageSize, this.filterParams());
      if (!isDocumentSetupPageSize(result.pageSize)) {
        throw new RangeError(`Unsupported page size in response: ${result.pageSize}.`);
      }

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

  protected async deleteRecord(record: DocumentSetupSummary): Promise<void> {
    if (this.deletingCode() !== null) {
      return;
    }

    if (!(await this.feedback.confirmDeleteDocumentSetup(record.docCode))) {
      return;
    }

    this.deletingCode.set(record.docCode);
    try {
      await this.documentSetupApi.delete(record.docCode, record.version);
      this.feedback.showSuccess('Document setup deleted successfully.');
      const nextPage =
        this.records().length === 1 && this.page() > 1 ? this.page() - 1 : this.page();
      await this.loadPage(nextPage);
    } catch (error: unknown) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      this.feedback.showError(
        error.status === 409
          ? 'This document setup cannot be deleted while Applicable Modules exist, or it changed. Reload and review it first.'
          : error.status === 404
            ? 'The document setup no longer exists. Reload the listing.'
            : 'The document setup could not be deleted. Please try again.',
      );
    } finally {
      this.deletingCode.set(null);
    }
  }

  protected onPageNumberChange(page: number): void {
    void this.loadPage(page);
  }

  protected onSortChange(sort: Sort): void {
    if (
      this.toSortColumn(sort.active) === null ||
      (sort.direction !== 'asc' && sort.direction !== 'desc')
    ) {
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

  protected setupForLabel(value: string | null | undefined): string {
    switch (value) {
      case '101':
        return 'File Upload';
      case '102':
        return 'Doc Print';
      default:
        return value ?? '';
    }
  }

  private filterParams(): ListDocumentSetups$Params {
    const activeFilters = this.filters();
    return {
      sortBy: this.toSortColumn(this.sortActive()) ?? 'DocCode',
      sortDirection: this.sortDirection() === 'desc' ? 'Descending' : 'Ascending',
      docCodeOperator: activeFilters.docCode?.operator,
      docCodeValue: activeFilters.docCode?.value,
      docNameOperator: activeFilters.docName?.operator,
      docNameValue: activeFilters.docName?.value,
      docDescriptionOperator: activeFilters.docDescription?.operator,
      docDescriptionValue: activeFilters.docDescription?.value,
      setupForOperator: activeFilters.setupFor?.operator,
      setupForValue: activeFilters.setupFor?.value,
    };
  }

  private toSortColumn(active: string): DocumentSetupSortColumn | null {
    const columns: Record<string, DocumentSetupSortColumn> = {
      docCode: 'DocCode',
      docName: 'DocName',
      description: 'DocDescription',
      setupFor: 'SetupFor',
      activeYn: 'ActiveYn',
    };

    return columns[active] ?? null;
  }
}
