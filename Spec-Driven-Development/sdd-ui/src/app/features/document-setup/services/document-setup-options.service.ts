import { Injectable, inject } from '@angular/core';
import { CodeRecord } from '../../../api/generated/models/code-record';
import { CodesApiService } from '../../codes-master/services/codes-api.service';

const DOC_SETUP_FOR_CODE_TYPE = 'DOC_SETUP_FOR';
const APPLICABLE_FOR_CODE_TYPE = 'APPLICABLE_FOR';
const PRODUCT_CODE_TYPE = 'PRODUCT';
const PCM_CODE_TYPE = 'PCM';
const CCM_CODE_TYPE = 'CCM';
const PAGE_SIZE = 50;

export class DocumentSetupOptionsError extends Error {}

@Injectable({ providedIn: 'root' })
export class DocumentSetupOptionsService {
  private readonly codesApi = inject(CodesApiService);

  async listDocSetupForCodes(): Promise<CodeRecord[]> {
    return this.listCodesByType(DOC_SETUP_FOR_CODE_TYPE);
  }

  async listApplicableForCodes(): Promise<CodeRecord[]> {
    return this.listCodesByType(APPLICABLE_FOR_CODE_TYPE);
  }

  async listProductCodes(): Promise<CodeRecord[]> {
    return this.listCodesByType(PRODUCT_CODE_TYPE);
  }

  async listPcmCodes(): Promise<CodeRecord[]> {
    return this.listCodesByType(PCM_CODE_TYPE);
  }

  async listCcmCodes(): Promise<CodeRecord[]> {
    return this.listCodesByType(CCM_CODE_TYPE);
  }

  private async listCodesByType(codeType: string): Promise<CodeRecord[]> {
    const filters = {
      codeTypeOperator: 'EqualTo' as const,
      codeTypeValue: codeType,
      sortBy: 'Code' as const,
      sortDirection: 'Ascending' as const,
    };
    const firstPage = await this.codesApi.list(1, PAGE_SIZE, filters);
    const records = [...firstPage.items];
    const pageCount = Math.ceil(firstPage.totalCount / PAGE_SIZE);

    for (let page = 2; page <= pageCount; page += 1) {
      const result = await this.codesApi.list(page, PAGE_SIZE, filters);
      records.push(...result.items);
    }

    if (records.length !== firstPage.totalCount) {
      throw new DocumentSetupOptionsError(`The ${codeType} codes could not be fully loaded.`);
    }

    return records;
  }
}

export function formatCodeDescription(
  code: string | null | undefined,
  codes: CodeRecord[],
): string {
  if (!code) {
    return '';
  }

  const record = codes.find((option) => option.code === code);
  return record?.codeDescription || code;
}

export function formatCodeOption(code: string, codes: CodeRecord[]): string {
  const record = codes.find((option) => option.code === code);
  return record?.codeDescription ? `${code} — ${record.codeDescription}` : code;
}

export function isFixedAssetApplicableFor(
  code: string | null | undefined,
  codes: CodeRecord[],
): boolean {
  if (!code) {
    return false;
  }

  if (code.toUpperCase() === 'ASSET') {
    return true;
  }

  const record = codes.find((option) => option.code === code);
  return /\b(?:FIXED[\s_-]+)?ASSETS?\b/i.test(
    `${record?.code ?? code} ${record?.codeDescription ?? ''}`,
  );
}
