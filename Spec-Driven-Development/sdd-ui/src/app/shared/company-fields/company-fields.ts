import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  selector: 'app-company-fields',
  styleUrl: './company-fields.css',
  templateUrl: './company-fields.html',
})
export class CompanyFields {
  readonly form = input.required<FormGroup>();
  readonly mode = input<'add' | 'view' | 'edit'>('add');
  readonly company = input<Record<string, string | null | undefined>>({});
  readonly datePickerMode = input(false);
  readonly errorFor = input<(field: string) => string | null>(() => null);
  readonly formatDate = input<(value: string | null | undefined) => string>((value) => value ?? '');

  readonly addressFields = [
    { name: 'address1', label: 'Address 1', maxLength: 100 },
    { name: 'address2', label: 'Address 2', maxLength: 100 },
    { name: 'address3', label: 'Address 3', maxLength: 100 },
  ];
  readonly dateFields = [
    { name: 'incorporationDate', label: 'Incorporation date' },
    { name: 'licenceIssueDate', label: 'Licence issue date' },
    { name: 'licenceExpiryDate', label: 'Licence expiry date' },
  ];
  readonly contactFields = [
    { name: 'companyInCharge', label: 'Company in charge', maxLength: 60 },
    { name: 'phone', label: 'Phone', maxLength: 10 },
    { name: 'email', label: 'Email', maxLength: 100 },
    { name: 'website', label: 'Website', maxLength: 100 },
  ];
}
