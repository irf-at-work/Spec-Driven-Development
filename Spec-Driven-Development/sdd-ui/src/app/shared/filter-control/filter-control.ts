import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export type CompanyFilterOperator =
  'StartsWith' | 'EndsWith' | 'Contains' | 'DoesNotContain' | 'Equals' | 'NotEquals';

export interface FilterChange {
  value: string;
  operator: CompanyFilterOperator | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  selector: 'app-filter-control',
  styleUrl: './filter-control.css',
  templateUrl: './filter-control.html',
})
export class FilterControl {
  readonly label = input.required<string>();
  readonly value = input('');
  readonly operator = input<CompanyFilterOperator | null>(null);
  readonly changed = output<FilterChange>();
  readonly cleared = output<void>();

  readonly operators: ReadonlyArray<{ value: CompanyFilterOperator; label: string }> = [
    { value: 'StartsWith', label: 'Starts with' },
    { value: 'EndsWith', label: 'Ends with' },
    { value: 'Contains', label: 'Contains' },
    { value: 'DoesNotContain', label: "Doesn't contain" },
    { value: 'Equals', label: 'Equals to' },
    { value: 'NotEquals', label: 'Not equals to' },
  ];

  emitValue(value: string): void {
    this.changed.emit({ value, operator: this.operator() });
  }

  emitOperator(operator: CompanyFilterOperator | ''): void {
    this.changed.emit({ value: this.value(), operator: operator || null });
  }

  setOperatorFromEvent(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      if (target.value === '' || this.isCompanyFilterOperator(target.value)) {
        this.emitOperator(target.value);
      }
    }
  }

  clear(): void {
    this.cleared.emit();
  }

  private isCompanyFilterOperator(value: string): value is CompanyFilterOperator {
    return this.operators.some((operator) => operator.value === value);
  }
}
