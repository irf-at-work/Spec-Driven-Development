import { Injectable, inject } from '@angular/core';
import { ClaimConfigurationLookupOption } from '../../../api/generated/models/claim-configuration-lookup-option';
import { ClaimConfigurationApiService } from './claim-configuration-api.service';

export const claimConfigurationLookupTypes = [
  'CCM_MODULE',
  'CCM_POST_TYPE',
  'CCM_EXCH_RATE',
  'CCM_ROUND_TYPE',
  'CCM_CURR_TYPE',
  'CCM_CLO_REASON',
  'CCM_DFLT_RECV_DEDU',
] as const;

export type ClaimConfigurationLookupType = (typeof claimConfigurationLookupTypes)[number];
export type ClaimConfigurationLookupRequestType = ClaimConfigurationLookupType | 'CCM_PRODUCT';

@Injectable({ providedIn: 'root' })
export class ClaimConfigurationOptionsService {
  private readonly api = inject(ClaimConfigurationApiService);

  get(type: ClaimConfigurationLookupRequestType): Promise<ClaimConfigurationLookupOption[]> {
    return this.api.lookups(type);
  }
}
