import { TestBed } from '@angular/core/testing';
import { FilterControl } from './filter-control';

describe('FilterControl', () => {
  it('renders all operators and emits typed changes and clear events accessibly', async () => {
    await TestBed.configureTestingModule({ imports: [FilterControl] }).compileComponents();
    const fixture = TestBed.createComponent(FilterControl);
    fixture.componentRef.setInput('label', 'Company name');
    fixture.componentRef.setInput('value', 'North');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select[aria-label="Company name operator"]',
    ) as HTMLSelectElement | null;
    expect(select).not.toBeNull();
    if (!select) {
      throw new Error('Operator select was not rendered.');
    }
    expect(select.value).toBe('');
    expect(
      Array.from(select.options).some((option) => option.textContent?.includes('Choose operator')),
    ).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Company name operator');
    expect(
      fixture.nativeElement
        .querySelector('.operator-control')
        .classList.contains('operator-active'),
    ).toBe(false);
    expect(
      getComputedStyle(fixture.nativeElement.querySelector('.operator-control')).borderRadius,
    ).toBe('var(--radius-sm)');
    expect(fixture.nativeElement.querySelector('.operator-control path').getAttribute('fill')).toBe(
      'none',
    );
    expect(fixture.componentInstance.operators.map((option) => option.value)).toEqual([
      'StartsWith',
      'EndsWith',
      'Contains',
      'DoesNotContain',
      'Equals',
      'NotEquals',
    ]);
    expect(
      fixture.nativeElement.querySelector('input[aria-label="Filter by company name"]'),
    ).not.toBeNull();
    expect(
      getComputedStyle(fixture.nativeElement.querySelector('.filter-control')).alignItems,
    ).toBe('center');
    expect(getComputedStyle(fixture.nativeElement.querySelector('.clear-filter')).marginTop).toBe(
      '0px',
    );

    const changed = vi.fn();
    const cleared = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    fixture.componentInstance.cleared.subscribe(cleared);
    fixture.componentInstance.emitValue('Northshore');
    expect(changed).toHaveBeenLastCalledWith({ value: 'Northshore', operator: null });
    select.value = 'Contains';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    fixture.componentRef.setInput('operator', 'Contains');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.operator-control')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.operator-control path').getAttribute('fill')).toBe(
      'currentColor',
    );
    select.value = 'StartsWith';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(changed).toHaveBeenLastCalledWith({ value: 'North', operator: 'StartsWith' });
    fixture.componentRef.setInput('operator', 'StartsWith');
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('.operator-control')
        .classList.contains('operator-active'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('.operator-control path').getAttribute('fill')).toBe(
      'currentColor',
    );

    fixture.nativeElement.querySelector('button[aria-label="Clear company name filter"]').click();
    expect(cleared).toHaveBeenCalledOnce();
  });
});
