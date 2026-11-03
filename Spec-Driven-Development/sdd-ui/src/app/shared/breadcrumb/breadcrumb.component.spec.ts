import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({ template: '' })
class BlankPageComponent {}

describe('BreadcrumbComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'vehicle-makes', component: BlankPageComponent, data: { breadcrumb: 'makes' } },
          {
            path: 'vehicle-makes/:makeCode/models/new',
            component: BlankPageComponent,
            data: { breadcrumb: 'model-new' },
          },
          { path: 'elsewhere', component: BlankPageComponent },
        ]),
      ],
    });
  });

  async function showTrailFor(url: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the trail for the page, with every step but the last as a link', async () => {
    const page = await showTrailFor('/vehicle-makes/TOY/models/new');

    const text = Array.from(page.querySelectorAll('li')).map((item) => item.textContent?.replace('›', '').trim());
    expect(text).toEqual(['Master Data', 'Vehicle Makes', 'TOY', 'Add model']);

    const links = Array.from(page.querySelectorAll('a')).map((link) => link.textContent?.trim());
    expect(links).toEqual(['Vehicle Makes', 'TOY']);
  });

  it('marks the current page for screen readers', async () => {
    const page = await showTrailFor('/vehicle-makes');

    const current = page.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('Vehicle Makes');
  });

  it('is a labelled navigation landmark', async () => {
    const page = await showTrailFor('/vehicle-makes');

    expect(page.querySelector('nav')?.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('shows nothing on a page that has not named itself', async () => {
    const page = await showTrailFor('/elsewhere');

    expect(page.querySelector('nav')).toBeNull();
  });
});
