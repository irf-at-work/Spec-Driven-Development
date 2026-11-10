import { Injectable, inject } from '@angular/core';
import { Api } from '../../../api/generated/api';
import {
  createApplicableProduct,
  createClaimConfiguration,
  deleteApplicableProduct,
  deleteClaimConfiguration,
  getApplicableProduct,
  getClaimConfiguration,
  getClaimConfigurationLookups,
  listApplicableProducts,
  listClaimConfigurations,
  updateApplicableProduct,
  updateClaimConfiguration,
} from '../../../api/generated/functions';
import { ApplicableProductRecord } from '../../../api/generated/models/applicable-product-record';
import { ApplicableProductSummary } from '../../../api/generated/models/applicable-product-summary';
import { ApplicableProductUpdate } from '../../../api/generated/models/applicable-product-update';
import { ApplicableProductWrite } from '../../../api/generated/models/applicable-product-write';
import { ClaimConfigurationLookupOption } from '../../../api/generated/models/claim-configuration-lookup-option';
import { ClaimConfigurationRecord } from '../../../api/generated/models/claim-configuration-record';
import { ClaimConfigurationUpdate } from '../../../api/generated/models/claim-configuration-update';
import { ClaimConfigurationWrite } from '../../../api/generated/models/claim-configuration-write';
import { ListClaimConfigurations$Params } from '../../../api/generated/fn/operations/list-claim-configurations';
import { PaginatedClaimConfigurationResult } from '../../../api/generated/models/paginated-claim-configuration-result';

@Injectable({ providedIn: 'root' })
export class ClaimConfigurationApiService {
  private readonly api = inject(Api);

  list(
    page: number,
    pageSize: 10 | 15 | 20 | 50,
    filters: ListClaimConfigurations$Params,
  ): Promise<PaginatedClaimConfigurationResult> {
    return this.api.invoke(listClaimConfigurations, { ...filters, page, pageSize });
  }

  get(ccmCode: string): Promise<ClaimConfigurationRecord> {
    return this.api.invoke(getClaimConfiguration, { ccmCode });
  }

  create(body: ClaimConfigurationWrite): Promise<ClaimConfigurationRecord> {
    return this.api.invoke(createClaimConfiguration, { body });
  }

  update(ccmCode: string, body: ClaimConfigurationUpdate): Promise<ClaimConfigurationRecord> {
    return this.api.invoke(updateClaimConfiguration, { ccmCode, body });
  }

  delete(ccmCode: string): Promise<void> {
    return this.api.invoke(deleteClaimConfiguration, { ccmCode });
  }

  lookups(liType: string): Promise<ClaimConfigurationLookupOption[]> {
    return this.api.invoke(getClaimConfigurationLookups, { liType });
  }

  products(ccmCode: string): Promise<ApplicableProductSummary[]> {
    return this.api.invoke(listApplicableProducts, { ccmCode });
  }

  createProduct(ccmCode: string, body: ApplicableProductWrite): Promise<ApplicableProductRecord> {
    return this.api.invoke(createApplicableProduct, { ccmCode, body });
  }

  getProduct(ccmCode: string, productCode: string): Promise<ApplicableProductRecord> {
    return this.api.invoke(getApplicableProduct, { ccmCode, productCode });
  }

  updateProduct(
    ccmCode: string,
    productCode: string,
    body: ApplicableProductUpdate,
  ): Promise<ApplicableProductRecord> {
    return this.api.invoke(updateApplicableProduct, { ccmCode, productCode, body });
  }

  deleteProduct(ccmCode: string, productCode: string): Promise<void> {
    return this.api.invoke(deleteApplicableProduct, { ccmCode, productCode });
  }
}
