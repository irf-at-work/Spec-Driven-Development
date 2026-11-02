import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import {
  PaginatedResultOfVehicleModelDto,
  VehicleModelDto,
  VehicleModelsClient,
} from '../../generated/api-client';
import { NotificationService } from '../../shared/notifications/notification.service';
import { VehicleModelListComponent } from './vehicle-model-list.component';

describe('VehicleModelListComponent', () => {
  const makeCode = 'TOYOTA';
  let fixture: ComponentFixture<VehicleModelListComponent>;
  let modelsClient: {
    list: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let notifications: {
    error: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
    confirm: ReturnType<typeof vi.fn>;
  };

  async function setup(items: VehicleModelDto[] = []): Promise<void> {
    const result: PaginatedResultOfVehicleModelDto = {
      items,
      page: 1,
      pageSize: 10,
      totalCount: items.length,
    };

    modelsClient = {
      list: vi.fn(() => of(result)),
      delete: vi.fn(() => of(undefined)),
    };
    router = { navigate: vi.fn(() => Promise.resolve(true)) };
    notifications = {
      error: vi.fn(),
      success: vi.fn(),
      confirm: vi.fn(() => Promise.resolve(true)),
    };

    await TestBed.configureTestingModule({
      imports: [VehicleModelListComponent],
      providers: [
        { provide: VehicleModelsClient, useValue: modelsClient },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notifications },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleModelListComponent);
    fixture.componentRef.setInput('makeCode', makeCode);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  // Icon buttons have no visible text; they are named by their aria-label.
  function findButton(name: string): HTMLButtonElement | undefined {
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find(
      (candidate) => (candidate.getAttribute('aria-label') ?? candidate.textContent?.trim()) === name,
    );
  }

  function buttonNamed(name: string): HTMLButtonElement {
    const button = findButton(name);
    if (!button) {
      throw new Error(`Could not find button "${name}".`);
    }
    return button;
  }

  function makeEditable(): void {
    fixture.componentRef.setInput('makeEditable', true);
    fixture.detectChanges();
  }

  it('shows models read-only until the make is switched to edit mode', async () => {
    const model = vehicleModel();
    await setup([model]);

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain(model.modelCode);
    expect(host.textContent).toContain('Active');
    expect(findButton('Add model')).toBeUndefined();
    expect(findButton('Edit MODEL-1')).toBeUndefined();
    // The generated client also receives the (unset) filter arguments, so only the first two matter here.
    expect(modelsClient.list.mock.calls[0].slice(0, 2)).toEqual([makeCode, 1]);
  });

  it('provides an empty state and keeps Add model gated by make edit mode', async () => {
    await setup();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('No models have been added for this make.');
    expect(findButton('Add model')).toBeUndefined();

    makeEditable();

    expect(host.textContent).toContain('Use Add to create the first model.');
    expect(findButton('Add model')).toBeDefined();
  });

  it('opens the add-model page from Add model', async () => {
    await setup();
    makeEditable();

    buttonNamed('Add model').click();

    expect(router.navigate).toHaveBeenCalledWith(['/vehicle-makes', makeCode, 'models', 'new']);
  });

  it('opens the edit page for a model from its Edit button', async () => {
    await setup([vehicleModel()]);
    makeEditable();

    buttonNamed('Edit MODEL-1').click();

    expect(router.navigate).toHaveBeenCalledWith([
      '/vehicle-makes',
      makeCode,
      'models',
      'MODEL-1',
      'edit',
    ]);
  });

  it('deletes a model only after the user confirms, then reloads the list', async () => {
    await setup([vehicleModel()]);
    makeEditable();

    buttonNamed('Delete MODEL-1').click();
    await fixture.whenStable();

    expect(notifications.confirm).toHaveBeenCalled();
    expect(modelsClient.delete).toHaveBeenCalledWith(makeCode, 'MODEL-1');
    expect(modelsClient.list).toHaveBeenCalledTimes(2);
  });

  it('does not delete when the user cancels', async () => {
    await setup([vehicleModel()]);
    makeEditable();
    notifications.confirm.mockResolvedValue(false);

    buttonNamed('Delete MODEL-1').click();
    await fixture.whenStable();

    expect(modelsClient.delete).not.toHaveBeenCalled();
  });
});

function vehicleModel(): VehicleModelDto {
  return {
    makeCode: 'TOYOTA',
    modelCode: 'MODEL-1',
    modelName: 'Model One',
    shortName: 'One',
    remarks: null,
    arabicModelName: null,
    arabicShortName: null,
    arabicRemarks: null,
    variant: null,
    vehicleType: null,
    weight: null,
    loadCapacity: null,
    bodyType: null,
    fuelType: null,
    engineCapacity: null,
    cylinders: null,
    seats: null,
    passengers: null,
    drivers: null,
    doors: null,
    makeYear: null,
    drivingType: null,
    bodyColour: null,
    value: null,
    category: null,
    active: true,
    createdBy: 'admin',
    lastChangedBy: 'admin',
  };
}
