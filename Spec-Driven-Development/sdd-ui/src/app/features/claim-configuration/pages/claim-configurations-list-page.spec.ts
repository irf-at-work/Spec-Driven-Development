import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ClaimConfigurationApiService } from '../services/claim-configuration-api.service';
import { ClaimConfigurationFeedbackService } from '../services/claim-configuration-feedback.service';
import { ClaimConfigurationsListPage } from './claim-configurations-list-page';

describe('Claim Configurations list page', () => {
  const record = {
    ccmCompCode: 'CCM001',
    ccmCode: 'CCM-A',
    ccmName: 'Claims',
    ccmShortName: 'CLM',
    moduleName: 'Claims',
    createdBy: 'ADMIN',
    createdDate: '2026-11-11T09:00:00',
    updatedBy: 'EDITOR',
    updatedDate: '2026-11-11T10:00:00',
  };
  let list: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    list = vi.fn().mockResolvedValue({
      items: [record],
      page: 1,
      pageSize: 10,
      totalCount: 21,
    });
    TestBed.configureTestingModule({
      imports: [ClaimConfigurationsListPage],
      providers: [
        provideRouter([]),
        {
          provide: ClaimConfigurationApiService,
          useValue: { list, delete: vi.fn() },
        },
        {
          provide: ClaimConfigurationFeedbackService,
          useValue: {
            confirmDeleteClaimConfiguration: vi.fn(),
            showSuccess: vi.fn(),
          },
        },
      ],
    });
  });

  it('renders the CCM columns and uses the server-paged default size', async () => {
    const fixture = TestBed.createComponent(ClaimConfigurationsListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const rendered = fixture.nativeElement as HTMLElement;
    expect(list).toHaveBeenCalledWith(
      1,
      10,
      expect.objectContaining({ sortBy: 'Code', sortDirection: 'Ascending' }),
    );
    expect(rendered.textContent).toContain('Claim Config Code');
    expect(rendered.textContent).toContain('Claim Config Name');
    expect(rendered.textContent).toContain('Short Name');
    expect(rendered.textContent).toContain('Module Name');
    expect(rendered.textContent).toContain('CCM-A');
    expect(rendered.querySelector('a[aria-label="Edit CCM-A"] svg path')).not.toBeNull();
    expect(rendered.querySelector('button[aria-label="Delete CCM-A"] svg path')).not.toBeNull();
    expect(rendered.querySelector('button[aria-label="Audit details for CCM-A"]')).not.toBeNull();
    expect(rendered.querySelector('[aria-label="Page 2"]')).not.toBeNull();
  });

  it('shows a distinct error state when loading fails', async () => {
    list.mockRejectedValueOnce(new HttpErrorResponse({ status: 500 }));
    const fixture = TestBed.createComponent(ClaimConfigurationsListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const rendered = fixture.nativeElement as HTMLElement;
    expect(rendered.textContent).toContain('The claim configurations could not be loaded.');
    expect(rendered.querySelector('[role="alert"]')).not.toBeNull();
  });
});
