import {
  createClaimConfigurationForm,
  toClaimConfigurationWrite,
} from './claim-configuration-form';

describe('Claim Configuration form', () => {
  it('requires only code and name and applies the More default', () => {
    const form = createClaimConfigurationForm();

    expect(form.controls.ccmCode.hasError('required')).toBe(true);
    expect(form.controls.ccmName.hasError('required')).toBe(true);
    expect(form.controls.ccmShortName.hasError('required')).toBe(false);
    expect(form.controls.nameInArabic.hasError('required')).toBe(false);
    expect(form.controls.shortNameInArabic.hasError('required')).toBe(false);
    expect(form.controls.module.hasError('required')).toBe(false);
    expect(form.controls.postingType.hasError('required')).toBe(false);
    expect(form.controls.exchangeRateType.hasError('required')).toBe(false);
    expect(form.controls.roundingType.hasError('required')).toBe(false);
    expect(form.controls.applicableCurrencies.hasError('required')).toBe(false);
    expect(form.controls.defaultEstimateCloseReasonCode.hasError('required')).toBe(false);
    expect(form.controls.defaultRecoveryCodeForDedl.hasError('required')).toBe(false);
    expect(form.controls.roundingValue.hasError('required')).toBe(false);
    expect(form.controls.printBeforeApprovalYn.hasError('required')).toBe(false);
    expect(form.controls.rePrintAllowedYn.hasError('required')).toBe(false);
    expect(form.controls.claimAccountDocumentGenerationYn.hasError('required')).toBe(false);
    expect(form.controls.sharingClaimsAccountDocumentGenerationYn.hasError('required')).toBe(false);
    expect(form.controls.activeYn.hasError('required')).toBe(false);
    expect(form.controls.activeYn.value).toBe('Y');
    expect(form.controls.printBeforeApprovalYn.value).toBe('N');
    expect(form.controls.rePrintAllowedYn.value).toBe('N');
    expect(form.controls.claimAccountDocumentGenerationYn.value).toBe('N');
    expect(form.controls.sharingClaimsAccountDocumentGenerationYn.value).toBe('N');
  });

  it('enforces field lengths and NUMBER(8,5) limits', () => {
    const form = createClaimConfigurationForm();
    form.controls.ccmCode.setValue('C'.repeat(13));
    form.controls.ccmName.setValue('N'.repeat(101));
    form.controls.roundingValue.setValue(1000);
    expect(form.controls.ccmCode.hasError('maxlength')).toBe(true);
    expect(form.controls.ccmName.hasError('maxlength')).toBe(true);
    expect(form.controls.roundingValue.hasError('roundingValueRange')).toBe(true);

    form.controls.roundingValue.setValue(1.000001);
    expect(form.controls.roundingValue.hasError('roundingValuePrecision')).toBe(true);

    form.controls.roundingValue.setValue(-999.99999);
    expect(form.controls.roundingValue.valid).toBe(true);
  });

  it('serializes every toggle using Y/N values', () => {
    const form = createClaimConfigurationForm();
    form.controls.ccmCode.setValue('CCM-A');
    form.controls.ccmName.setValue('Example');
    form.controls.printBeforeApprovalYn.setValue('Y');
    form.controls.rePrintAllowedYn.setValue('N');
    form.controls.claimAccountDocumentGenerationYn.setValue('Y');
    form.controls.sharingClaimsAccountDocumentGenerationYn.setValue('N');
    form.controls.activeYn.setValue('Y');

    const request = toClaimConfigurationWrite(form);

    expect(request).toMatchObject({
      printBeforeApprovalYn: 'Y',
      rePrintAllowedYn: 'N',
      claimAccountDocumentGenerationYn: 'Y',
      sharingClaimsAccountDocumentGenerationYn: 'N',
      activeYn: 'Y',
    });
  });

  it('serializes blank optional fields as null', () => {
    const form = createClaimConfigurationForm();
    form.controls.ccmCode.setValue('CCM-A');
    form.controls.ccmName.setValue('Example');

    const request = toClaimConfigurationWrite(form);

    expect(request).toMatchObject({
      ccmShortName: null,
      nameInArabic: null,
      shortNameInArabic: null,
      module: null,
      postingType: null,
      exchangeRateType: null,
      roundingType: null,
      roundingValue: null,
      applicableCurrencies: null,
      defaultEstimateCloseReasonCode: null,
      defaultRecoveryCodeForDedl: null,
    });
  });
});
