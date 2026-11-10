import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ClaimConfigurationRecord } from '../../../api/generated/models/claim-configuration-record';
import { ClaimConfigurationWrite } from '../../../api/generated/models/claim-configuration-write';

export type YesNoValue = 'Y' | 'N';

export interface ClaimConfigurationFormControls {
  ccmCode: FormControl<string>;
  ccmName: FormControl<string>;
  ccmShortName: FormControl<string>;
  nameInArabic: FormControl<string>;
  shortNameInArabic: FormControl<string>;
  module: FormControl<string>;
  postingType: FormControl<string>;
  exchangeRateType: FormControl<string>;
  roundingType: FormControl<string>;
  roundingValue: FormControl<number | null>;
  applicableCurrencies: FormControl<string>;
  defaultEstimateCloseReasonCode: FormControl<string>;
  defaultRecoveryCodeForDedl: FormControl<string>;
  printBeforeApprovalYn: FormControl<YesNoValue>;
  rePrintAllowedYn: FormControl<YesNoValue>;
  claimAccountDocumentGenerationYn: FormControl<YesNoValue>;
  sharingClaimsAccountDocumentGenerationYn: FormControl<YesNoValue>;
  activeYn: FormControl<YesNoValue>;
}

export type ClaimConfigurationFormGroup = FormGroup<ClaimConfigurationFormControls>;

export const claimConfigurationFields = [
  'ccmCode',
  'ccmName',
  'ccmShortName',
  'nameInArabic',
  'shortNameInArabic',
  'module',
  'postingType',
  'exchangeRateType',
  'roundingType',
  'roundingValue',
  'applicableCurrencies',
  'defaultEstimateCloseReasonCode',
  'defaultRecoveryCodeForDedl',
  'printBeforeApprovalYn',
  'rePrintAllowedYn',
  'claimAccountDocumentGenerationYn',
  'sharingClaimsAccountDocumentGenerationYn',
  'activeYn',
] as const;

export type ClaimConfigurationField = (typeof claimConfigurationFields)[number];

const roundingValueValidator = (control: AbstractControl<number | null>): ValidationErrors | null => {
  const value = control.value;
  if (value === null) {
    return null;
  }

  if (!Number.isFinite(value) || value < -999.99999 || value > 999.99999) {
    return { roundingValueRange: true };
  }

  const [mantissa, exponentText] = value.toString().toLowerCase().split('e');
  const fractionalDigits = (mantissa.split('.')[1]?.length ?? 0) - Number(exponentText ?? 0);
  return fractionalDigits > 5 ? { roundingValuePrecision: true } : null;
};

export function createClaimConfigurationForm(
  record?: ClaimConfigurationRecord,
): ClaimConfigurationFormGroup {
  return new FormGroup<ClaimConfigurationFormControls>({
    ccmCode: new FormControl(record?.ccmCode ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(12)],
    }),
    ccmName: new FormControl(record?.ccmName ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    ccmShortName: new FormControl(record?.ccmShortName ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(30)],
    }),
    nameInArabic: new FormControl(record?.nameInArabic ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    shortNameInArabic: new FormControl(record?.shortNameInArabic ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(30)],
    }),
    module: new FormControl(record?.module ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(2)],
    }),
    postingType: new FormControl(record?.postingType ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(1)],
    }),
    exchangeRateType: new FormControl(record?.exchangeRateType ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(1)],
    }),
    roundingType: new FormControl(record?.roundingType ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(2)],
    }),
    roundingValue: new FormControl(record?.roundingValue ?? null, {
      validators: [roundingValueValidator],
    }),
    applicableCurrencies: new FormControl(record?.applicableCurrencies ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(2)],
    }),
    defaultEstimateCloseReasonCode: new FormControl(record?.defaultEstimateCloseReasonCode ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(12)],
    }),
    defaultRecoveryCodeForDedl: new FormControl(record?.defaultRecoveryCodeForDedl ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(12)],
    }),
    printBeforeApprovalYn: new FormControl(toYesNo(record?.printBeforeApprovalYn, 'N'), {
      nonNullable: true,
    }),
    rePrintAllowedYn: new FormControl(toYesNo(record?.rePrintAllowedYn, 'N'), {
      nonNullable: true,
    }),
    claimAccountDocumentGenerationYn: new FormControl(
      toYesNo(record?.claimAccountDocumentGenerationYn, 'N'),
      { nonNullable: true },
    ),
    sharingClaimsAccountDocumentGenerationYn: new FormControl(
      toYesNo(record?.sharingClaimsAccountDocumentGenerationYn, 'N'),
      { nonNullable: true },
    ),
    activeYn: new FormControl(toYesNo(record?.activeYn, 'Y'), {
      nonNullable: true,
    }),
  });
}

export function toClaimConfigurationWrite(form: ClaimConfigurationFormGroup): ClaimConfigurationWrite {
  const values = form.getRawValue();
  return {
    ...values,
    ccmShortName: emptyToNull(values.ccmShortName),
    nameInArabic: emptyToNull(values.nameInArabic),
    shortNameInArabic: emptyToNull(values.shortNameInArabic),
    module: emptyToNull(values.module),
    postingType: emptyToNull(values.postingType),
    exchangeRateType: emptyToNull(values.exchangeRateType),
    roundingType: emptyToNull(values.roundingType),
    applicableCurrencies: emptyToNull(values.applicableCurrencies),
    defaultEstimateCloseReasonCode: emptyToNull(values.defaultEstimateCloseReasonCode),
    defaultRecoveryCodeForDedl: emptyToNull(values.defaultRecoveryCodeForDedl),
  };
}

export function toClaimConfigurationFormValue(record: ClaimConfigurationRecord) {
  return {
    ...record,
    ccmShortName: record.ccmShortName ?? '',
    nameInArabic: record.nameInArabic ?? '',
    shortNameInArabic: record.shortNameInArabic ?? '',
    module: record.module ?? '',
    postingType: record.postingType ?? '',
    exchangeRateType: record.exchangeRateType ?? '',
    roundingType: record.roundingType ?? '',
    roundingValue: record.roundingValue ?? null,
    applicableCurrencies: record.applicableCurrencies ?? '',
    defaultEstimateCloseReasonCode: record.defaultEstimateCloseReasonCode ?? '',
    defaultRecoveryCodeForDedl: record.defaultRecoveryCodeForDedl ?? '',
    printBeforeApprovalYn: toYesNo(record.printBeforeApprovalYn, 'N'),
    rePrintAllowedYn: toYesNo(record.rePrintAllowedYn, 'N'),
    claimAccountDocumentGenerationYn: toYesNo(record.claimAccountDocumentGenerationYn, 'N'),
    sharingClaimsAccountDocumentGenerationYn:
      toYesNo(record.sharingClaimsAccountDocumentGenerationYn, 'N'),
    activeYn: toYesNo(record.activeYn, 'Y'),
  };
}

function toYesNo(value: string | null | undefined, defaultValue: YesNoValue): YesNoValue {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (value === 'Y' || value === 'N') {
    return value;
  }

  throw new Error('The saved toggle value must be Y or N.');
}

function emptyToNull(value: string): string | null {
  return value === '' ? null : value;
}
