import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CodeRecord } from '../../../api/generated/models/code-record';
import { CodesApiService } from '../services/codes-api.service';
import { CodesFeedbackService } from '../services/codes-feedback.service';
import { CreationAuditDetails } from '../components/creation-audit-details';

@Component({
  selector: 'app-codes-list-page',
  standalone: true,
  imports: [CreationAuditDetails, MatButtonModule, MatPaginatorModule, MatTableModule, RouterLink],
  styleUrl: './codes-list-page.css',
  templateUrl: './codes-list-page.html',
})
export class CodesListPage implements OnInit {
  private readonly codesApi = inject(CodesApiService);
  private readonly feedback = inject(CodesFeedbackService);

  protected readonly columns = ['code', 'description', 'type', 'value1', 'value2', 'actions'];
  protected readonly records = signal<CodeRecord[]>([]);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly totalCount = signal(0);
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly deleteError = signal('');
  protected readonly isDeleting = signal(false);
  protected readonly successMessage = this.feedback.successMessage;
  protected readonly feedbackService = this.feedback;

  ngOnInit(): void {
    void this.loadPage(1);
  }

  protected async loadPage(page: number, pageSize = this.pageSize()): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const result = await this.codesApi.list(page, pageSize);
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

  protected onPageChange(event: PageEvent): void {
    void this.loadPage(event.pageIndex + 1, event.pageSize);
  }

  protected async deleteRecord(record: CodeRecord): Promise<void> {
    if (
      this.isDeleting() ||
      !window.confirm(
        `Delete code "${record.code}" with Code Type "${record.codeType}"? This action cannot be undone.`,
      )
    ) {
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
}
