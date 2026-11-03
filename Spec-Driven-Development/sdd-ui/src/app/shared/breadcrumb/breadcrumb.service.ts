import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { readMakeCodeFromHistory, readPremiumAdjustmentKeyFromHistory } from '../navigation-state';
import { BreadcrumbContext, Crumb, buildTrail, isBreadcrumbPage } from './breadcrumb';

/**
 * Works out the trail for whichever page is showing. It reads the route itself, so no page has to remember to
 * set or clear it, and a page that is added later only needs `data: { breadcrumb: '...' }` on its route.
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);

  readonly trail = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.currentTrail()),
    ),
    { initialValue: [] as readonly Crumb[] },
  );

  private currentTrail(): readonly Crumb[] {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const page: unknown = route.data['breadcrumb'];
    if (!isBreadcrumbPage(page)) {
      return [];
    }

    const context: BreadcrumbContext = {
      // The model pages carry the make in the address; the make's own page carries it in the navigation state.
      makeCode: route.paramMap.get('makeCode') ?? readMakeCodeFromHistory(),
      modelCode: route.paramMap.get('modelCode'),
      adjustmentCode: readPremiumAdjustmentKeyFromHistory()?.code ?? null,
    };
    return buildTrail(page, context);
  }
}
