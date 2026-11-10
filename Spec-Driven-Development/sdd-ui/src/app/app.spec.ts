import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the Master navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.master-navigation-toggle')?.textContent).toContain('Masters');
    const navigationLabels = Array.from(compiled.querySelectorAll('#master-navigation-links a')).map(
      (link) => link.textContent?.trim(),
    );
    expect(navigationLabels).toContain('Codes Master');
    expect(navigationLabels).toContain('Claim Configuration Master');
  });
});
