import { Injectable, inject } from '@angular/core';
import { Api } from '../../../api/generated/api';
import {
  createApplicableModule,
  createDocumentSetup,
  deleteApplicableModule,
  deleteDocumentSetup,
  getApplicableModule,
  getDocumentSetup,
  listApplicableModules,
  listDocumentSetups,
  updateApplicableModule,
  updateDocumentSetup,
} from '../../../api/generated/functions';
import { ApplicableModuleRecord } from '../../../api/generated/models/applicable-module-record';
import { ApplicableModuleUpdate } from '../../../api/generated/models/applicable-module-update';
import { ApplicableModuleWrite } from '../../../api/generated/models/applicable-module-write';
import { ApplicableModuleSortColumn } from '../../../api/generated/models/applicable-module-sort-column';
import { CodeSortDirection } from '../../../api/generated/models/code-sort-direction';
import { DocumentSetupUpdate } from '../../../api/generated/models/document-setup-update';
import { ListDocumentSetups$Params } from '../../../api/generated/fn/operations/list-document-setups';
import { ListApplicableModules$Params } from '../../../api/generated/fn/operations/list-applicable-modules';
import { PaginatedApplicableModuleResult } from '../../../api/generated/models/paginated-applicable-module-result';
import { DocumentSetupRecord } from '../../../api/generated/models/document-setup-record';
import { DocumentSetupSummary } from '../../../api/generated/models/document-setup-summary';
import { PaginatedDocumentSetupResult } from '../../../api/generated/models/paginated-document-setup-result';
import { DocumentSetupWrite } from '../../../api/generated/models/document-setup-write';

export type DocumentSetupPageSize = NonNullable<ListDocumentSetups$Params['pageSize']>;

@Injectable({ providedIn: 'root' })
export class DocumentSetupApiService {
  private readonly api = inject(Api);

  list(
    page: number,
    pageSize: DocumentSetupPageSize,
    filters: ListDocumentSetups$Params,
  ): Promise<PaginatedDocumentSetupResult> {
    return this.api.invoke(listDocumentSetups, { ...filters, page, pageSize });
  }

  create(body: DocumentSetupWrite): Promise<DocumentSetupRecord> {
    return this.api.invoke(createDocumentSetup, { body });
  }

  get(docCode: string): Promise<DocumentSetupRecord> {
    return this.api.invoke(getDocumentSetup, { docCode });
  }

  update(docCode: string, body: DocumentSetupUpdate): Promise<DocumentSetupRecord> {
    return this.api.invoke(updateDocumentSetup, { docCode, body });
  }

  listApplicableModules(
    docCode: string,
    page: number,
    pageSize: DocumentSetupPageSize,
    sortBy: ApplicableModuleSortColumn,
    sortDirection: CodeSortDirection,
    filters: Partial<Omit<ListApplicableModules$Params, 'docCode' | 'page' | 'pageSize'>> = {},
  ): Promise<PaginatedApplicableModuleResult> {
    return this.api.invoke(listApplicableModules, {
      docCode,
      page,
      pageSize,
      sortBy,
      sortDirection,
      ...filters,
    });
  }

  getApplicableModule(docCode: string, damodUid: string): Promise<ApplicableModuleRecord> {
    return this.api.invoke(getApplicableModule, { docCode, damodUid });
  }

  createApplicableModule(
    docCode: string,
    body: ApplicableModuleWrite,
  ): Promise<ApplicableModuleRecord> {
    return this.api.invoke(createApplicableModule, { docCode, body });
  }

  updateApplicableModule(
    docCode: string,
    damodUid: string,
    body: ApplicableModuleUpdate,
  ): Promise<ApplicableModuleRecord> {
    return this.api.invoke(updateApplicableModule, { docCode, damodUid, body });
  }

  delete(docCode: string, expectedVersion: string): Promise<void> {
    return this.api.invoke(deleteDocumentSetup, { docCode, expectedVersion });
  }

  deleteApplicableModule(
    docCode: string,
    damodUid: string,
    expectedVersion: string,
  ): Promise<void> {
    return this.api.invoke(deleteApplicableModule, { docCode, damodUid, expectedVersion });
  }
}
