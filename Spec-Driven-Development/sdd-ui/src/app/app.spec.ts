import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DashboardLayout } from './layout/dashboard-layout';

describe('DashboardLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayout],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('renders the shared dashboard shell and routed content outlet', async () => {
    const fixture = TestBed.createComponent(DashboardLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('a[aria-label="Broker Portal home"]')).not.toBeNull();
    expect(compiled.querySelector('[aria-label="Masters"]')).not.toBeNull();
  });

  it('opens exactly the Company Master and List Item Master menu entries', async () => {
    const fixture = TestBed.createComponent(DashboardLayout);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const menu = await loader.getHarness(MatMenuHarness);

    await menu.open();
    const labels = await Promise.all((await menu.getItems()).map((item) => item.getText()));

    expect(labels).toEqual(['Company Master', 'List Item Master']);
  });

  it('defines dashboard, company CRUD and listing destinations', () => {
    const destinations = routes[0].children?.map((route) => route.path);

    expect(destinations).toEqual([
      '',
      'company-master',
      'company-master/new',
      'company-master/:companyCode/edit',
      'company-master/:companyCode',
      'listing-master/new',
      'listing-master/:liType/:liCode',
      'listing-master',
    ]);
  });
});
