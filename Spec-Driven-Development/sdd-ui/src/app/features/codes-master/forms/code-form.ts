import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodeRecord } from '../../../api/generated/models/code-record';
import { CodeWrite } from '../../../api/generated/models/code-write';

export interface CodeFormControls {
  code: FormControl<string>;
  codeType: FormControl<string>;
  codeDescription: FormControl<string>;
  shortDescription: FormControl<string>;
  longDescription: FormControl<string>;
  value1: FormControl<string>;
  value2: FormControl<string>;
  flex1: FormControl<string>;
  flex2: FormControl<string>;
  descriptionInArabic: FormControl<string>;
  shortDescriptionInArabic: FormControl<string>;
  longDescriptionInArabic: FormControl<string>;
  activeYn: FormControl<string>;
}

export type CodeFormGroup = FormGroup<CodeFormControls>;
export const codeFields = [
  'code',
  'codeType',
  'codeDescription',
  'shortDescription',
  'longDescription',
  'value1',
  'value2',
  'flex1',
  'flex2',
  'descriptionInArabic',
  'shortDescriptionInArabic',
  'longDescriptionInArabic',
  'activeYn',
] as const;
export type CodeField = (typeof codeFields)[number];
export type CodeFieldErrors = Partial<Record<CodeField, string[]>>;

export function createCodeForm(record?: CodeRecord): CodeFormGroup {
  return new FormGroup<CodeFormControls>({
    code: new FormControl(record?.code ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    codeType: new FormControl(record?.codeType ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    codeDescription: new FormControl(record?.codeDescription ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shortDescription: new FormControl(record?.shortDescription ?? '', { nonNullable: true }),
    longDescription: new FormControl(record?.longDescription ?? '', { nonNullable: true }),
    value1: new FormControl(record?.value1 ?? '', { nonNullable: true }),
    value2: new FormControl(record?.value2 ?? '', { nonNullable: true }),
    flex1: new FormControl(record?.flex1 ?? '', { nonNullable: true }),
    flex2: new FormControl(record?.flex2 ?? '', { nonNullable: true }),
    descriptionInArabic: new FormControl(record?.descriptionInArabic ?? '', { nonNullable: true }),
    shortDescriptionInArabic: new FormControl(record?.shortDescriptionInArabic ?? '', {
      nonNullable: true,
    }),
    longDescriptionInArabic: new FormControl(record?.longDescriptionInArabic ?? '', {
      nonNullable: true,
    }),
    activeYn: new FormControl(record?.activeYn ?? 'Y', { nonNullable: true }),
  });
}

export function toCodeWrite(form: CodeFormGroup): CodeWrite {
  return form.getRawValue();
}
