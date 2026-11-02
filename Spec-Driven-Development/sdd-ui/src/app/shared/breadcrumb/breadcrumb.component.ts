import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

/** The "where am I" trail shown under the header. Every step except the current page is a link back. */
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .breadcrumb {
      padding: 10px 24px;
      background: var(--sdd-surface);
      border-bottom: 1px solid var(--sdd-border);
    }

    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.9375rem;
      color: var(--sdd-muted);
    }

    li {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    a {
      color: var(--sdd-accent);
      text-decoration: none;
    }

    a:hover,
    a:focus-visible {
      text-decoration: underline;
    }

    [aria-current='page'] {
      color: var(--sdd-text);
      font-weight: 600;
    }

    .separator {
      color: var(--sdd-muted);
    }
  `,
  template: `
    @if (trail().length > 0) {
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          @for (crumb of trail(); track $index; let last = $last) {
            <li>
              @if (crumb.link && !last) {
                <a [routerLink]="crumb.link" [state]="crumb.state">{{ crumb.label }}</a>
              } @else {
                <span [attr.aria-current]="last ? 'page' : null">{{ crumb.label }}</span>
              }
              @if (!last) {
                <span class="separator" aria-hidden="true">›</span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
})
export class BreadcrumbComponent {
  protected readonly trail = inject(BreadcrumbService).trail;
}
