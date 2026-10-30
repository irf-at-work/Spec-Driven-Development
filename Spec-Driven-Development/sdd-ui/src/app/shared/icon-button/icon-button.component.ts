import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export type IconButtonAction = 'add' | 'open' | 'edit' | 'delete' | 'back' | 'save' | 'cancel' | 'clear';

@Component({
  selector: 'app-icon-button',
  imports: [MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [type]="type()"
      [disabled]="disabled()"
      [matTooltip]="tooltip()"
      [attr.aria-label]="accessibleName() || tooltip()"
      (click)="clicked.emit($event)"
      [class.danger]="danger()"
    >
      <span class="material-symbols-outlined">{{ iconName() }}</span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;
    }
    button.danger {
      color: var(--sdd-danger, #b3261e);
    }
    .material-symbols-outlined {
      font-size: 22px;
      line-height: 1;
    }
  `,
})
export class IconButtonComponent {
  readonly action = input.required<IconButtonAction>();
  readonly tooltip = input.required<string>();
  readonly accessibleName = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly danger = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');

  readonly clicked = output<MouseEvent>();

  protected iconName(): string {
    switch (this.action()) {
      case 'add':
        return 'add';
      case 'open':
        return 'visibility';
      case 'edit':
        return 'edit';
      case 'delete':
        return 'delete';
      case 'back':
        return 'arrow_back';
      case 'save':
        return 'check';
      case 'cancel':
        return 'close';
      case 'clear':
        return 'clear';
      default:
        return 'circle';
    }
  }
}
