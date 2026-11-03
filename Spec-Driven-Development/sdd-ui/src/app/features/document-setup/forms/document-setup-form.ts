import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentSetupWrite } from '../../../api/generated/models/document-setup-write';

export function createDocumentSetupForm() {
  return new FormGroup({
    docCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    docName: new FormControl('', { nonNullable: true }),
    docDescription: new FormControl('', { nonNullable: true }),
    docSetupFor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    flex1: new FormControl('', { nonNullable: true }),
    flex2: new FormControl('', { nonNullable: true }),
    nameInArabic: new FormControl('', { nonNullable: true }),
    descriptionInArabic: new FormControl('', { nonNullable: true }),
    activeYn: new FormControl(true, { nonNullable: true }),
  });
}

export type DocumentSetupForm = ReturnType<typeof createDocumentSetupForm>;

export function toDocumentSetupWrite(form: DocumentSetupForm): DocumentSetupWrite {
  const value = form.getRawValue();
  return {
    docCode: value.docCode.trim(),
    docName: value.docName || null,
    docDescription: value.docDescription || null,
    docSetupFor: value.docSetupFor,
    flex1: value.flex1 || null,
    flex2: value.flex2 || null,
    nameInArabic: value.nameInArabic || null,
    descriptionInArabic: value.descriptionInArabic || null,
    activeYn: value.activeYn ? 'Y' : 'N',
  };
}
