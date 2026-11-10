import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, reduce } from 'rxjs';
import { API_BASE_URL } from '../../generated/api-client';

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

export interface ClaimConfigurationChoicePage<T = ClaimConfigurationChoice> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface AvailableProduct {
  productCode: string;
  productType: string;
  description: string;
}

export type AssociatedProduct = AvailableProduct;

export interface ClaimConfigurationWriteStatus {
  enabled: boolean;
  message: string;
  companyCode: string;
}

export type ClaimConfigurationSaveRequest = Omit<
  ClaimConfigurationDetail,
  'companyCode' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'
>;

@Injectable({ providedIn: 'root' })
export class ClaimConfigurationListService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private apiUrl(path: string): string {
    const base = this.apiBaseUrl.replace(/\/+$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

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

    return this.http.get<ClaimConfigurationPage>(this.apiUrl('/api/claim-configurations'), { params });
  }

  get(ccmCode: string): Observable<ClaimConfigurationDetail> {
    return this.http.get<ClaimConfigurationDetail>(
      this.apiUrl(`/api/claim-configurations/${encodeURIComponent(ccmCode)}`),
    );
  }

  writeStatus(): Observable<ClaimConfigurationWriteStatus> {
    return this.http.get<ClaimConfigurationWriteStatus>(this.apiUrl('/api/claim-configurations/write-status'));
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
    return this.http.post<ClaimConfigurationDetail>(this.apiUrl('/api/claim-configurations'), request);
  }

  update(
    ccmCode: string,
    request: ClaimConfigurationSaveRequest,
  ): Observable<ClaimConfigurationDetail> {
    return this.http.put<ClaimConfigurationDetail>(
      this.apiUrl(`/api/claim-configurations/${encodeURIComponent(ccmCode)}`),
      request,
    );
  }

  delete(ccmCode: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl(`/api/claim-configurations/${encodeURIComponent(ccmCode)}`));
  }

  availableProducts(
    page: number,
    pageSize = 10,
  ): Observable<ClaimConfigurationChoicePage<AvailableProduct>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ClaimConfigurationChoicePage<AvailableProduct>>(
      this.apiUrl('/api/claim-configurations/available-products'),
      { params },
    );
  }

  associatedProducts(
    ccmCode: string,
    page: number,
    pageSize = 5,
  ): Observable<ClaimConfigurationChoicePage<AssociatedProduct>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ClaimConfigurationChoicePage<AssociatedProduct>>(
      this.apiUrl(`/api/claim-configurations/${encodeURIComponent(ccmCode)}/products`),
      { params },
    );
  }

  addProduct(ccmCode: string, productCode: string): Observable<void> {
    return this.http.post<void>(
      this.apiUrl(`/api/claim-configurations/${encodeURIComponent(ccmCode)}/products`),
      { productCode },
    );
  }

  deleteProduct(ccmCode: string, productCode: string): Observable<void> {
    return this.http.delete<void>(
      this.apiUrl(`/api/claim-configurations/${encodeURIComponent(ccmCode)}/products/${encodeURIComponent(productCode)}`),
    );
  }

  configurationsForProduct(
    productCode: string,
    page: number,
    pageSize = 10,
  ): Observable<ClaimConfigurationPage> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ClaimConfigurationPage>(
      this.apiUrl(`/api/products/${encodeURIComponent(productCode)}/claim-configurations`),
      { params },
    );
  }

  private choicePage(field: string, page: number): Observable<ClaimConfigurationChoicePage> {
    const params = new HttpParams().set('page', page).set('pageSize', 10);
    return this.http.get<ClaimConfigurationChoicePage>(
      this.apiUrl(`/api/claim-configuration-options/${encodeURIComponent(field)}`),
      { params },
    );
  }
}
