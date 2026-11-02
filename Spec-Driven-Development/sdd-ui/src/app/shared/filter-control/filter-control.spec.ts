import { TestBed } from '@angular/core/testing';
import { FilterControl } from './filter-control';

describe('FilterControl', () => {
  it('renders all operators and emits typed changes and clear events accessibly', async () => {
    await TestBed.configureTestingModule({ imports: [FilterControl] }).compileComponents();
    const fixture = TestBed.createComponent(FilterControl);
    fixture.componentRef.setInput('label', 'Company name');
    fixture.componentRef.setInput('value', 'North');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select[aria-label="Company name operator"]');
    expect(select).not.toBeNull();
    expect(fixture.componentInstance.operators.map((option) => option.value)).toEqual([
      'StartsWith', 'EndsWith', 'Contains', 'DoesNotContain', 'Equals', 'NotEquals',
    ]);
    expect(fixture.nativeElement.querySelector('input[aria-label="Filter by company name"]')).not.toBeNull();

    const changed = vi.fn();
    const cleared = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    fixture.componentInstance.cleared.subscribe(cleared);
    fixture.componentInstance.emitValue('Northshore');
    expect(changed).toHaveBeenLastCalledWith({ value: 'Northshore', operator: 'Contains' });
    select.value = 'StartsWith';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(changed).toHaveBeenLastCalledWith({ value: 'North', operator: 'StartsWith' });

    fixture.nativeElement.querySelector('button[aria-label="Clear company name filter"]').click();
    expect(cleared).toHaveBeenCalledOnce();
  });
});
