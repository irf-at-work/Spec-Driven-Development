/** One step of the trail. The last step is the current page and has no link. */
export interface Crumb {
  readonly label: string;
  /** Where the step leads. Missing for the current page and for a heading that has no page of its own. */
  readonly link?: readonly string[];
  /** Navigation state sent with the link. The make page needs its code here, because the code is not in the address. */
  readonly state?: Readonly<Record<string, unknown>>;
}

/** Each route names its page, and the trail for that page is built from it. */
export type BreadcrumbPage =
  | 'makes'
  | 'make-new'
  | 'make-view'
  | 'model-new'
  | 'model-edit'
  | 'premium-adjustments'
  | 'claim-configurations'
  | 'claim-configuration-view'
  | 'claim-configuration-new'
  | 'claim-configuration-edit'
  | 'premium-adjustment-new'
  | 'premium-adjustment-view'
  | 'vehicle-model-options-import'
  | 'make-import'
  | 'premium-adjustment-import'
  | 'model-import';

export interface BreadcrumbContext {
  readonly makeCode: string | null;
  readonly modelCode: string | null;
  readonly adjustmentCode?: string | null;
}

const PAGES: readonly string[] = [
  'makes',
  'make-new',
  'make-view',
  'model-new',
  'model-edit',
  'premium-adjustments',
  'claim-configurations',
  'claim-configuration-view',
  'claim-configuration-new',
  'claim-configuration-edit',
  'premium-adjustment-new',
  'premium-adjustment-view',
  'vehicle-model-options-import',
  'make-import',
  'premium-adjustment-import',
  'model-import',
];

export function isBreadcrumbPage(value: unknown): value is BreadcrumbPage {
  return typeof value === 'string' && PAGES.includes(value);
}

const MASTER_DATA: Crumb = { label: 'Master Data' };
const VEHICLE_MAKES_LINK: Crumb = { label: 'Vehicle Makes', link: ['/vehicle-makes'] };

// The make's own page is opened by passing its code in the navigation state, exactly as the list does.
function makeStep(context: BreadcrumbContext): Crumb {
  const makeCode = context.makeCode;
  return makeCode
    ? { label: makeCode, link: ['/vehicle-makes/view'], state: { makeCode } }
    : { label: 'Vehicle make' };
}

export function buildTrail(page: BreadcrumbPage, context: BreadcrumbContext): readonly Crumb[] {
  switch (page) {
    case 'makes':
      return [MASTER_DATA, { label: 'Vehicle Makes' }];
    case 'make-new':
      return [MASTER_DATA, VEHICLE_MAKES_LINK, { label: 'Add vehicle make' }];
    case 'make-view':
      return [MASTER_DATA, VEHICLE_MAKES_LINK, { label: context.makeCode ?? 'Vehicle make' }];
    case 'model-new':
      return [MASTER_DATA, VEHICLE_MAKES_LINK, makeStep(context), { label: 'Add model' }];
    case 'model-edit':
      return [
        MASTER_DATA,
        VEHICLE_MAKES_LINK,
        makeStep(context),
        { label: context.modelCode ? `Edit ${context.modelCode}` : 'Edit model' },
      ];
    case 'premium-adjustments':
      return [MASTER_DATA, { label: 'Premium Adjustments' }];
    case 'claim-configurations':
      return [MASTER_DATA, { label: 'Claim Configurations' }];
    case 'claim-configuration-view':
      return [MASTER_DATA, { label: 'Claim Configurations', link: ['/claim-configurations'] }, { label: 'Claim Configuration Details' }];
    case 'claim-configuration-new':
      return [MASTER_DATA, { label: 'Claim Configurations', link: ['/claim-configurations'] }, { label: 'Add Claim Configuration' }];
    case 'claim-configuration-edit':
      return [MASTER_DATA, { label: 'Claim Configurations', link: ['/claim-configurations'] }, { label: 'Edit Claim Configuration' }];
    case 'premium-adjustment-new':
      return [
        MASTER_DATA,
        { label: 'Premium Adjustments', link: ['/premium-adjustments'] },
        { label: 'Add Premium Adjustment' },
      ];
    case 'premium-adjustment-view':
      return [
        MASTER_DATA,
        { label: 'Premium Adjustments', link: ['/premium-adjustments'] },
        { label: context.adjustmentCode ?? 'Adjustment Details' },
      ];
    case 'vehicle-model-options-import':
      return [MASTER_DATA, VEHICLE_MAKES_LINK, { label: 'Import dropdown choices' }];
    case 'make-import':
      return [MASTER_DATA, VEHICLE_MAKES_LINK, { label: 'Import vehicle makes' }];
    case 'premium-adjustment-import':
      return [
        MASTER_DATA,
        { label: 'Premium Adjustments', link: ['/premium-adjustments'] },
        { label: 'Import premium adjustments' },
      ];
    case 'model-import':
      return [
        MASTER_DATA,
        VEHICLE_MAKES_LINK,
        makeStep(context),
        { label: 'Import vehicle models' },
      ];
  }
}
