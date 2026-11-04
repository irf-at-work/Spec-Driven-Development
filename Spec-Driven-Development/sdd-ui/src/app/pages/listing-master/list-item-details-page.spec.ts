import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ListItemService } from '../../api/generated/api/listItem.service';
import { ListItemDetailsPage } from './list-item-details-page';

@Component({ standalone: true, template: '<h1>List item listing</h1>' })
class ListingStub {}

describe('ListItemDetailsPage', () => {
  const item = {
    liType: 'COUNTRY',
    liCode: 'AE',
    description: 'United Arab Emirates',
    descriptionL2: 'الإمارات العربية المتحدة',
    shortDescription: 'UAE',
    shortDescriptionL2: 'UAE L2',
    value: '971',
    activeYn: 'Y',
    flex01: 'Extra 1',
    flex02: 'Extra 2',
    createdBy: 'Admin',
    createdAt: '2024-01-01T22:30:00Z',
    lastUpdatedBy: 'Editor',
    lastUpdatedAt: '2024-02-03T00:00:00Z',
  };

  async function createPage(
    api = {
      apiListItemsLiTypeLiCodeGet: vi.fn(() => of(item)),
      apiListItemsLiTypeLiCodePut: vi.fn(({ updateListItemRequest }) =>
        of({ ...item, ...updateListItemRequest }),
      ),
      apiListItemsLiTypeLiCodeDelete: vi.fn(() => of(undefined)),
    },
  ) {
    await TestBed.configureTestingModule({
      imports: [ListItemDetailsPage],
      providers: [
        provideRouter([
          { path: 'listing-master', component: ListingStub },
          { path: 'listing-master/:liType/:liCode', component: ListItemDetailsPage },
        ]),
        { provide: ListItemService, useValue: api },
      ],
    }).compileComponents();
    return { api, harness: await RouterTestingHarness.create() };
  }

  it('displays all business and audit fields in view mode', async () => {
    const { harness } = await createPage();
    await harness.navigateByUrl('/listing-master/COUNTRY/AE', ListItemDetailsPage);
    await harness.fixture.whenStable();
    const root = harness.routeNativeElement as HTMLElement;

    expect(root.querySelector('#list-item-details-title')?.textContent?.trim()).toBe(
      'List Item Master',
    );
    expect(root.querySelector('a[routerLink="/listing-master"] mat-icon svg')).not.toBeNull();
    expect(root.querySelector('.details-actions button mat-icon svg')).not.toBeNull();
    expect(root.querySelector('.details-actions .destructive-action mat-icon svg')).not.toBeNull();
    expect(root.textContent).toContain('United Arab Emirates');
    expect(root.textContent).toContain('الإمارات العربية المتحدة');
    expect(root.textContent).toContain('Extra 1');
    expect(root.textContent).toContain('02-01-2024');
    expect(root.textContent).toContain('03-02-2024');
    expect(root.querySelector('app-list-item-form')).toBeNull();
    expect(root.querySelectorAll('.details-grid dd.mat-mdc-tooltip-trigger')).toHaveLength(14);
    expect(getComputedStyle(root.querySelector('.details-grid')!).gridTemplateColumns).toBe(
      'repeat(3, minmax(0, 1fr))',
    );
  });

  it('edits on the same page, keeps identity read-only, saves changes, and supports cancel', async () => {
    const { api, harness } = await createPage();
    const page = await harness.navigateByUrl('/listing-master/COUNTRY/AE', ListItemDetailsPage);
    await harness.fixture.whenStable();
    const router = TestBed.inject(Router);
    const startUrl = router.url;

    const edit = harness.routeNativeElement?.querySelector('button') as HTMLButtonElement;
    edit.click();
    harness.fixture.detectChanges();
    const root = harness.routeNativeElement as HTMLElement;
    const typeInput = root.querySelector('input[formControlName="liType"]') as HTMLInputElement;
    const description = root.querySelector(
      'input[formControlName="description"]',
    ) as HTMLInputElement;
    expect(typeInput.readOnly).toBe(true);
    expect(typeInput.value).toBe('COUNTRY');
    description.value = 'Changed description';
    description.dispatchEvent(new Event('input', { bubbles: true }));
    harness.fixture.detectChanges();

    const form = root.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    expect(api.apiListItemsLiTypeLiCodePut).toHaveBeenCalledWith(
      expect.objectContaining({
        liType: 'COUNTRY',
        liCode: 'AE',
        updateListItemRequest: expect.objectContaining({ description: 'Changed description' }),
      }),
    );
    expect(router.url).toBe(startUrl);
    expect(page.editing()).toBe(false);

    page.startEditing();
    harness.fixture.detectChanges();
    const editInput = harness.routeNativeElement?.querySelector(
      'input[formControlName="description"]',
    ) as HTMLInputElement;
    expect(editInput.value).toBe('Changed description');
    const cancel = Array.from(harness.routeNativeElement?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent?.includes('Cancel'),
    );
    cancel?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    harness.fixture.detectChanges();
    expect(page.editing()).toBe(false);
  });

  it('keeps entered values visible when an update fails', async () => {
    const api = {
      apiListItemsLiTypeLiCodeGet: vi.fn(() => of(item)),
      apiListItemsLiTypeLiCodePut: vi.fn(() => throwError(() => new Error('failure'))),
      apiListItemsLiTypeLiCodeDelete: vi.fn(() => of(undefined)),
    };
    const { harness } = await createPage(api);
    const page = await harness.navigateByUrl('/listing-master/COUNTRY/AE', ListItemDetailsPage);
    await harness.fixture.whenStable();
    page.startEditing();
    harness.fixture.detectChanges();
    const input = harness.routeNativeElement?.querySelector(
      'input[formControlName="description"]',
    ) as HTMLInputElement;
    input.value = 'Preserve this value';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = harness.routeNativeElement?.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    expect(page.editing()).toBe(true);
    expect(input.value).toBe('Preserve this value');
    expect(api.apiListItemsLiTypeLiCodePut).toHaveBeenCalledWith(
      expect.objectContaining({
        updateListItemRequest: expect.objectContaining({ description: 'Preserve this value' }),
      }),
    );
    expect(harness.routeNativeElement?.querySelector('[role="alert"]')?.textContent).toContain(
      'still available to retry',
    );
  });
});
