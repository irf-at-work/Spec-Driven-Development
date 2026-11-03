import { Component, HostListener, computed, effect, input, output, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CodeFilterOperator } from '../../../api/generated/models/code-filter-operator';

export type CodeFilterColumn =
  | 'code'
  | 'codeDescription'
  | 'codeType'
  | 'value1'
  | 'value2'
  | 'docCode'
  | 'docName'
  | 'docDescription'
  | 'setupFor'
  | 'applicableFor'
  | 'productFrom'
  | 'productTo'
  | 'pcmFrom'
  | 'pcmTo'
  | 'ccmFrom'
  | 'ccmTo'
  | 'mandatoryYn'
  | 'activeYn';

export interface CodeColumnFilterValue {
  operator: CodeFilterOperator;
  value: string;
}

type SelectedOperator = CodeFilterOperator | 'NoFilter';

const operatorOptions: { value: SelectedOperator; label: string }[] = [
  { value: 'NoFilter', label: 'No Filter' },
  { value: 'StartsWith', label: 'Starts With' },
  { value: 'EndsWith', label: 'Ends With' },
  { value: 'Contains', label: 'Contains' },
  { value: 'DoesNotContain', label: 'Does Not Contain' },
  { value: 'EqualTo', label: 'Equal To' },
  { value: 'NotEqualTo', label: 'Not Equal To' },
];

@Component({
  selector: 'app-column-filter-control',
  standalone: true,
  imports: [OverlayModule],
  styleUrl: './column-filter-control.css',
  templateUrl: './column-filter-control.html',
})
export class ColumnFilterControl {
  readonly column = input.required<CodeFilterColumn>();
  readonly label = input.required<string>();
  readonly filter = input<CodeColumnFilterValue | null>(null);
  readonly draftValue = input('');
  readonly filterChange = output<CodeColumnFilterValue | null>();
  readonly draftValueChange = output<string>();

  protected readonly isOpen = signal(false);
  protected readonly selectedOperator = signal<SelectedOperator>('NoFilter');
  protected readonly operatorOptions = operatorOptions;
  protected readonly overlayPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
  ];
  protected readonly canApply = computed(
    () => this.selectedOperator() === 'NoFilter' || this.draftValue().trim().length > 0,
  );
  protected get panelId(): string {
    return `filter-panel-${this.column()}`;
  }

  protected get valueId(): string {
    return `filter-value-${this.column()}`;
  }

  constructor() {
    effect(() => {
      const currentFilter = this.filter();
      if (currentFilter !== null) {
        this.selectedOperator.set(currentFilter.operator);
      } else {
        this.selectedOperator.set('NoFilter');
      }
    });
  }

  protected toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected selectOperator(operator: SelectedOperator): void {
    this.selectedOperator.set(operator);
    if (operator === 'NoFilter') {
      this.draftValueChange.emit('');
    }
  }

  protected onValueInput(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.draftValueChange.emit(event.target.value);
    }
  }

  protected apply(): void {
    const selected = this.selectedOperator();
    if (selected === 'NoFilter') {
      this.filterChange.emit(null);
    } else if (this.draftValue().trim()) {
      this.filterChange.emit({ operator: selected, value: this.draftValue() });
    } else {
      return;
    }

    this.isOpen.set(false);
  }

  protected closePanel(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closePanel();
  }
}
