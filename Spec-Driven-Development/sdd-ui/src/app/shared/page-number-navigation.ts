import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-page-number-navigation',
  standalone: true,
  styleUrl: './page-number-navigation.css',
  templateUrl: './page-number-navigation.html',
})
export class PageNumberNavigation {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly pageChange = output<number>();

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const count = Math.min(5, total);
    const first = Math.min(Math.max(1, this.page()), Math.max(1, total - count + 1));
    return Array.from({ length: count }, (_, index) => first + index);
  });
}
