import { Injectable, inject } from '@angular/core';
import { Api } from '../../../api/generated/api';
import {
  createCode,
  deleteCode,
  getCode,
  listCodes,
  updateCode,
} from '../../../api/generated/functions';
import { CodeRecord } from '../../../api/generated/models/code-record';
import { CodeWrite } from '../../../api/generated/models/code-write';
import { PaginatedResult } from '../../../api/generated/models/paginated-result';
import { ListCodes$Params } from '../../../api/generated/fn/operations/list-codes';

@Injectable({ providedIn: 'root' })
export class CodesApiService {
  private readonly api = inject(Api);

  list(page: number, pageSize: number, filters: ListCodes$Params): Promise<PaginatedResult> {
    return this.api.invoke(listCodes, { ...filters, page, pageSize });
  }

  get(code: string, codeType: string): Promise<CodeRecord> {
    return this.api.invoke(getCode, { code, codeType });
  }

  create(body: CodeWrite): Promise<CodeRecord> {
    return this.api.invoke(createCode, { body });
  }

  update(code: string, codeType: string, body: CodeWrite): Promise<CodeRecord> {
    return this.api.invoke(updateCode, { code, codeType, body });
  }

  delete(code: string, codeType: string): Promise<void> {
    return this.api.invoke(deleteCode, { code, codeType });
  }
}
