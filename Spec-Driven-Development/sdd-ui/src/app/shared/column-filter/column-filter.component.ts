import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface ColumnFilterChange {
  value: string;
  operator: string;
}

export type TextFilterOperator = 'startsWith' | 'endsWith' | 'contains' | 'equals' | 'notEquals';
export type StatusFilterOperator = 'equals' | 'notEquals';

@Component({
  selector: 'app-column-filter',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="column-filter-container" [class.status-filter]="type() === 'status'">
      @if (type() === 'text') {
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="operator-select">
          <mat-select [formControl]="operatorControl">
            <mat-option value="contains">Contains</mat-option>
            <mat-option value="startsWith">Starts with</mat-option>
            <mat-option value="endsWith">Ends with</mat-option>
            <mat-option value="equals">Equals</mat-option>
            <mat-option value="notEquals">Not equal</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="filter-input">
          <input
            matInput
            type="text"
            [placeholder]="placeholder()"
            [formControl]="textControl"
            autocomplete="off"
          />
        </mat-form-field>
      } @else {
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="operator-select">
          <mat-select [formControl]="operatorControl">
            <mat-option value="equals">Equals</mat-option>
            <mat-option value="notEquals">Not equal</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="status-select">
          <mat-select [formControl]="statusControl">
            <mat-option value="">All</mat-option>
            <mat-option value="true">Active</mat-option>
            <mat-option value="false">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      }
    </div>
  `,
  styles: `
    .column-filter-container {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
      margin-bottom: 4px;
      font-weight: normal;
    }
    .operator-select {
      width: 105px;
      font-size: 12px;
    }
    .filter-input, .status-select {
      min-width: 110px;
      flex: 1;
      font-size: 13px;
    }
    :host ::ng-deep .mat-mdc-text-field-wrapper {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
  `,
})
export class ColumnFilterComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly type = input<'text' | 'status'>('text');
  readonly placeholder = input<string>('Filter...');

  readonly filterChange = output<ColumnFilterChange>();

  protected readonly operatorControl = new FormControl<string>('contains', { nonNullable: true });
  protected readonly textControl = new FormControl<string>('', { nonNullable: true });
  protected readonly statusControl = new FormControl<string>('', { nonNullable: true });

  constructor() {
    this.textControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.emitChange(val, this.operatorControl.value);
      });

    this.statusControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.emitChange(val, this.operatorControl.value);
      });

    this.operatorControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((op) => {
        const val = this.type() === 'status' ? this.statusControl.value : this.textControl.value;
        if (val) {
          this.emitChange(val, op);
        }
      });
  }

  ngOnInit(): void {
    if (this.type() === 'status') {
      this.operatorControl.setValue('equals');
    }
  }

  private emitChange(value: string, operator: string): void {
    this.filterChange.emit({
      value: value.trim(),
      operator,
    });
  }

  reset(): void {
    this.textControl.setValue('', { emitEvent: false });
    this.statusControl.setValue('', { emitEvent: false });
    this.operatorControl.setValue(this.type() === 'status' ? 'equals' : 'contains', {
      emitEvent: false,
    });
  }
}
