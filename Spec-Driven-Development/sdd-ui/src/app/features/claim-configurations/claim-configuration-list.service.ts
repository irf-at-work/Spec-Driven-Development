import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, reduce } from 'rxjs';

export interface ClaimConfigurationListItem {
  companyCode: string;
  ccmCode: string;
  name: string;
  shortName: string;
  module: string | null;
  active: boolean;
}

export interface ClaimConfigurationPage {
  items: ClaimConfigurationListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ClaimConfigurationDetail {
  companyCode: string;
  ccmCode: string;
  name: string;
  shortName?: string | null;
  nameL2?: string | null;
  shortNameL2?: string | null;
  module?: string | null;
  accountingPostingType?: string | null;
  accountingExchangeRateType?: string | null;
  roundingType?: string | null;
  roundingValue?: number | null;
  applicableCurrencyType?: string | null;
  defaultEstimatedClosureReasonCode?: string | null;
  defaultRecoveryDeductionCode?: string | null;
  printBeforeApproval: boolean;
  reprint: boolean;
  claimAccountingDocumentGeneration: boolean;
  claimCoinsuranceAccountingDocumentGeneration: boolean;
  active: boolean;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
}

export interface ClaimConfigurationListQuery {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, { value: string; operator: string }>;
  active: { value: string; operator: string };
}

export interface ClaimConfigurationChoice {
  code: string;
  description: string;
}

export interface ClaimConfigurationChoicePage {
  items: ClaimConfigurationChoice[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ClaimConfigurationWriteStatus {
  enabled: boolean;
  message: string;
  companyCode: string;
}

export type ClaimConfigurationSaveRequest = Omit<ClaimConfigurationDetail, 'companyCode' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>;

@Injectable({ providedIn: 'root' })
export class ClaimConfigurationListService {
  private readonly http = inject(HttpClient);

  list(query: ClaimConfigurationListQuery): Observable<ClaimConfigurationPage> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize)
      .set('sortBy', query.sortBy)
      .set('sortDirection', query.sortDirection);

    for (const [field, filter] of Object.entries(query.filters)) {
      if (filter.value.trim()) {
        params = params.set(field, filter.value.trim()).set(`${field}Operator`, filter.operator);
      }
    }

    if (query.active.value) {
      params = params
        .set('active', query.active.value)
        .set('activeOperator', query.active.operator);
    }

    return this.http.get<ClaimConfigurationPage>('/api/claim-configurations', { params });
  }

  get(ccmCode: string): Observable<ClaimConfigurationDetail> {
    return this.http.get<ClaimConfigurationDetail>(
      `/api/claim-configurations/${encodeURIComponent(ccmCode)}`,
    );
  }

  writeStatus(): Observable<ClaimConfigurationWriteStatus> {
    return this.http.get<ClaimConfigurationWriteStatus>('/api/claim-configurations/write-status');
  }

  choices(field: string): Observable<ClaimConfigurationChoice[]> {
    return this.choicePage(field, 1).pipe(
      expand((result) =>
        result.page * result.pageSize < result.totalCount
          ? this.choicePage(field, result.page + 1)
          : EMPTY,
      ),
      reduce((all, result) => [...all, ...(result.items ?? [])], [] as ClaimConfigurationChoice[]),
    );
  }

  create(request: ClaimConfigurationSaveRequest): Observable<ClaimConfigurationDetail> {
    return this.http.post<ClaimConfigurationDetail>('/api/claim-configurations', request);
  }

  update(ccmCode: string, request: ClaimConfigurationSaveRequest): Observable<ClaimConfigurationDetail> {
    return this.http.put<ClaimConfigurationDetail>(
      `/api/claim-configurations/${encodeURIComponent(ccmCode)}`,
      request,
    );
  }

  delete(ccmCode: string): Observable<void> {
    return this.http.delete<void>(`/api/claim-configurations/${encodeURIComponent(ccmCode)}`);
  }

  private choicePage(field: string, page: number): Observable<ClaimConfigurationChoicePage> {
    const params = new HttpParams().set('page', page).set('pageSize', 10);
    return this.http.get<ClaimConfigurationChoicePage>(
      `/api/claim-configuration-options/${encodeURIComponent(field)}`,
      { params },
    );
  }
}
