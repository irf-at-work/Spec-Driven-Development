import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicableModuleRecord } from '../../../api/generated/models/applicable-module-record';
import { ApplicableModuleWrite } from '../../../api/generated/models/applicable-module-write';

export function createApplicableModuleForm() {
  return new FormGroup({
    applicableFor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    productFrom: new FormControl('ALL', { nonNullable: true }),
    productTo: new FormControl('ALL', { nonNullable: true }),
    pcmFrom: new FormControl('ALL', { nonNullable: true }),
    pcmTo: new FormControl('ALL', { nonNullable: true }),
    ccmFrom: new FormControl('ALL', { nonNullable: true }),
    ccmTo: new FormControl('ALL', { nonNullable: true }),
    mandatoryYn: new FormControl(false, { nonNullable: true }),
    activeYn: new FormControl(true, { nonNullable: true }),
  });
}

export type ApplicableModuleForm = ReturnType<typeof createApplicableModuleForm>;

export function setApplicableModuleForm(
  form: ApplicableModuleForm,
  record: ApplicableModuleRecord,
): void {
  setApplicableModuleValues(form, record);
}

export function setApplicableModuleWriteForm(
  form: ApplicableModuleForm,
  module: ApplicableModuleWrite,
): void {
  setApplicableModuleValues(form, module);
}

function setApplicableModuleValues(
  form: ApplicableModuleForm,
  module: Pick<
    ApplicableModuleWrite,
    | 'applicableFor'
    | 'productFrom'
    | 'productTo'
    | 'pcmFrom'
    | 'pcmTo'
    | 'ccmFrom'
    | 'ccmTo'
    | 'mandatoryYn'
    | 'activeYn'
  >,
): void {
  form.reset({
    applicableFor: module.applicableFor,
    productFrom: module.productFrom ?? 'ALL',
    productTo: module.productTo ?? 'ALL',
    pcmFrom: module.pcmFrom ?? 'ALL',
    pcmTo: module.pcmTo ?? 'ALL',
    ccmFrom: module.ccmFrom ?? 'ALL',
    ccmTo: module.ccmTo ?? 'ALL',
    mandatoryYn: module.mandatoryYn === 'Y',
    activeYn: module.activeYn !== 'N',
  });
}

export function toApplicableModuleWrite(
  form: ApplicableModuleForm,
  includeRanges: boolean,
): ApplicableModuleWrite {
  const value = form.getRawValue();
  return {
    applicableFor: value.applicableFor,
    productFrom: value.productFrom || 'ALL',
    productTo: value.productTo || 'ALL',
    pcmFrom: value.pcmFrom || 'ALL',
    pcmTo: value.pcmTo || 'ALL',
    ccmFrom: value.ccmFrom || 'ALL',
    ccmTo: value.ccmTo || 'ALL',
    mandatoryYn: value.mandatoryYn ? 'Y' : 'N',
    activeYn: value.activeYn ? 'Y' : 'N',
  };
}
