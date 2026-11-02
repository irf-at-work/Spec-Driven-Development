import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CompanyFields } from './company-fields';

describe('CompanyFields', () => {
  const createForm = () => new FormGroup({
    companyCode: new FormControl('NORTH', { nonNullable: true }),
    companyName: new FormControl('North Mutual', { nonNullable: true, validators: [Validators.required] }),
    shortName: new FormControl('North', { nonNullable: true }),
    address1: new FormControl('Bay Road', { nonNullable: true }),
    address2: new FormControl('', { nonNullable: true }),
    address3: new FormControl('', { nonNullable: true }),
    incorporationDate: new FormControl('2020-03-05', { nonNullable: true }),
    referenceNumber: new FormControl('REF-1', { nonNullable: true }),
    licenceIssueDate: new FormControl('2024-01-01', { nonNullable: true }),
    licenceExpiryDate: new FormControl('2027-01-01', { nonNullable: true }),
    companyInCharge: new FormControl('Alex', { nonNullable: true }),
    phone: new FormControl('1234567890', { nonNullable: true }),
    email: new FormControl('alex@example.test', { nonNullable: true }),
    website: new FormControl('north.example.test', { nonNullable: true }),
  });

  it('keeps fields in the same order and retains values while switching between view and edit', async () => {
    await TestBed.configureTestingModule({ imports: [CompanyFields] }).compileComponents();
    const fixture = TestBed.createComponent(CompanyFields);
    const form = createForm();
    fixture.componentRef.setInput('form', form);
    fixture.componentRef.setInput('company', {
      companyCode: 'NORTH', companyName: 'North Mutual', shortName: 'North',
      address1: 'Bay Road', incorporationDate: '2020-03-05',
    });
    fixture.componentRef.setInput('mode', 'view');
    fixture.detectChanges();

    const labels = Array.from(fixture.nativeElement.querySelectorAll('.read-field span'))
      .map((element: HTMLElement) => element.textContent?.trim());
    expect(labels).toEqual([
      'Company code', 'Company name', 'Short name', 'Address 1', 'Address 2', 'Address 3',
      'Incorporation date', 'Reference number', 'Licence issue date', 'Licence expiry date',
      'Company in charge', 'Phone', 'Email', 'Website',
    ]);

    fixture.componentRef.setInput('mode', 'edit');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[formcontrolname="companyName"]')).not.toBeNull();
    expect(form.controls.companyName.value).toBe('North Mutual');
    expect(form.controls.address1.value).toBe('Bay Road');
  });
});
