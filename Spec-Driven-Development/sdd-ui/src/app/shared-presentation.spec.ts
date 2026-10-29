import { TestBed } from '@angular/core/testing';
import { DashboardPage } from './pages/dashboard/dashboard-page';

describe('shared presentation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
    }).compileComponents();
  });

  it('uses the reusable input and table classes', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input.shared-input')).not.toBeNull();
    expect(compiled.querySelector('table.shared-table')).not.toBeNull();
  });

  it('marks the shared example section for the common theme', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shared-presentation-example')).not.toBeNull();
  });
});
