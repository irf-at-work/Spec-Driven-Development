import { ChangeDetectionStrategy, Component, OnChanges, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ListItemDto } from '../../api/generated/model/listItemDto';

export interface ListItemFormValue {
  liType: string;
  liCode: string;
  description: string;
  descriptionL2: string;
  shortDescription: string;
  shortDescriptionL2: string;
  value: string;
  activeYn: string;
  flex01: string;
  flex02: string;
}

export const LIST_ITEM_FORM_FIELDS: readonly (keyof ListItemFormValue)[] = [
  'liType',
  'liCode',
  'description',
  'descriptionL2',
  'shortDescription',
  'shortDescriptionL2',
  'value',
  'activeYn',
  'flex01',
  'flex02',
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  selector: 'app-list-item-form',
  styleUrl: './list-item-form.css',
  templateUrl: './list-item-form.html',
})
export class ListItemForm implements OnChanges, OnInit {
  readonly initialItem = input<ListItemDto | null>(null);
  readonly mode = input<'create' | 'edit'>('create');
  readonly pending = input(false);
  readonly apiError = input<string | null>(null);
  readonly serverErrors = input<Partial<Record<keyof ListItemFormValue, string>>>({});
  readonly submitted = output<ListItemFormValue>();
  readonly cancelled = output<void>();

  readonly form = new FormGroup({
    liType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    liCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(12)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    descriptionL2: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    shortDescription: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(30)],
    }),
    shortDescriptionL2: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(30)],
    }),
    value: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    activeYn: new FormControl('Y', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[YN]$/)],
    }),
    flex01: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    flex02: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
  });

  ngOnInit(): void {
    const item = this.initialItem();
    if (item) this.populate(item);
  }

  ngOnChanges(): void {
    for (const field of LIST_ITEM_FORM_FIELDS) {
      const control = this.form.controls[field];
      const serverError = this.serverErrors()[field];
      const errors = control.errors ? { ...control.errors } : {};
      if (serverError) {
        control.setErrors({ ...errors, server: true });
      } else if ('server' in errors) {
        delete errors['server'];
        control.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.submitted.emit(this.form.getRawValue());
  }

  fieldError(field: keyof ListItemFormValue): string | null {
    const serverError = this.serverErrors()[field];
    if (serverError) return serverError;
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) return null;
    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('maxlength')) return 'This value is too long.';
    if (control.hasError('pattern')) return 'Choose Y (active) or N (inactive).';
    return 'This value is invalid.';
  }

  private populate(item: ListItemDto): void {
    this.form.reset({
      liType: item.liType,
      liCode: item.liCode,
      description: item.description ?? '',
      descriptionL2: item.descriptionL2 ?? '',
      shortDescription: item.shortDescription ?? '',
      shortDescriptionL2: item.shortDescriptionL2 ?? '',
      value: item.value ?? '',
      activeYn: item.activeYn ?? 'Y',
      flex01: item.flex01 ?? '',
      flex02: item.flex02 ?? '',
    });
  }
}
