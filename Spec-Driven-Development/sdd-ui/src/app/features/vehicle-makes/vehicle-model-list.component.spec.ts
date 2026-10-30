import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { vi } from 'vitest';
import {
  PaginatedResultOfVehicleModelDto,
  VehicleModelDto,
  VehicleModelsClient,
  VehicleModelOptionsClient,
} from '../../generated/api-client';
import { VehicleModelListComponent } from './vehicle-model-list.component';

describe('VehicleModelListComponent', () => {
  const makeCode = 'TOYOTA';
  let fixture: ComponentFixture<VehicleModelListComponent>;
  let modelsClient: {
    list: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  async function setup(items: VehicleModelDto[] = []): Promise<void> {
    const result: PaginatedResultOfVehicleModelDto = {
      items,
      page: 1,
      pageSize: 10,
      totalCount: items.length,
    };
    const model = vehicleModel();

    modelsClient = {
      list: vi.fn(() => of(result)),
      create: vi.fn(() => of(model)),
      update: vi.fn(() => of(model)),
      delete: vi.fn(() => of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [VehicleModelListComponent],
      providers: [
        { provide: VehicleModelsClient, useValue: modelsClient },
        {
          provide: VehicleModelOptionsClient,
          useValue: {
            get: vi.fn(() =>
              of({
                variants: [],
                vehicleTypes: [],
                bodyTypes: [],
                fuelTypes: [],
                cylinders: [],
                doors: [],
                drivingTypes: [],
                bodyColours: [],
                categories: [],
              }),
            ),
          },
        },
        { provide: MatDialog, useValue: { open: vi.fn(() => ({ afterClosed: () => of(true) })) } },
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleModelListComponent);
    fixture.componentRef.setInput('makeCode', makeCode);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function buttonNamed(name: string): HTMLButtonElement {
    const button = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((candidate) => candidate.textContent?.trim() === name);
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error(`Could not find button "${name}".`);
    }
    return button;
  }

  function hasButtonNamed(name: string): boolean {
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).some(
      (candidate) => candidate.textContent?.trim() === name,
    );
  }

  function textInput(label: string): HTMLInputElement {
    const field = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-limited-text-field'),
    ).find((candidate) => candidate.textContent?.includes(label));
    const input = field?.querySelector('input');
    if (!(input instanceof HTMLInputElement)) {
      throw new Error(`Could not find text input "${label}".`);
    }
    return input;
  }

  function fill(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  it('shows models read-only until the make is switched to edit mode', async () => {
    const model = vehicleModel();
    await setup([model]);

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain(model.modelCode);
    expect(host.textContent).toContain('Active');
    expect(host.textContent).not.toContain('Add model');
    expect(host.textContent).not.toContain('Edit');
    expect(modelsClient.list).toHaveBeenCalledWith(makeCode, 1);
  });

  it('provides an empty state and keeps Add model gated by make edit mode', async () => {
    await setup();

    let host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('This make has no models yet.');
    expect(hasButtonNamed('Add model')).toBe(false);

    fixture.componentRef.setInput('makeEditable', true);
    fixture.detectChanges();

    host = fixture.nativeElement as HTMLElement;
    expect(hasButtonNamed('Add model')).toBe(true);
    buttonNamed('Add model').click();
    fixture.detectChanges();
    expect(host.textContent).toContain('Model Code');
  });

  it('validates required fields before creating a model', async () => {
    await setup();
    fixture.componentRef.setInput('makeEditable', true);
    fixture.detectChanges();
    buttonNamed('Add model').click();
    fixture.detectChanges();

    buttonNamed('Save model').click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Model Code is required.');
    expect(modelsClient.create).not.toHaveBeenCalled();
  });

  it('creates a model, locks its code during edit, and sends updates without the code', async () => {
    await setup([vehicleModel()]);
    fixture.componentRef.setInput('makeEditable', true);
    fixture.detectChanges();

    buttonNamed('Add model').click();
    fixture.detectChanges();
    fill(textInput('Model Code'), 'NEW-1');
    fill(textInput('Model Name'), 'New Model');
    fill(textInput('Short Name'), 'New');
    buttonNamed('Save model').click();
    fixture.detectChanges();

    expect(modelsClient.create).toHaveBeenCalledWith(
      makeCode,
      expect.objectContaining({ modelCode: 'NEW-1', modelName: 'New Model', active: true }),
    );

    const editButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'Edit');
    if (!(editButton instanceof HTMLButtonElement)) {
      throw new Error('Could not find the model edit button.');
    }
    editButton.click();
    fixture.detectChanges();

    expect(textInput('Model Code').disabled).toBe(true);
    fill(textInput('Model Name'), 'Updated Model');
    buttonNamed('Save changes').click();
    fixture.detectChanges();

    expect(modelsClient.update).toHaveBeenCalledWith(
      makeCode,
      'MODEL-1',
      expect.objectContaining({ modelName: 'Updated Model' }),
    );
    const updateRequest = modelsClient.update.mock.calls[0][2] as Record<string, unknown>;
    expect(updateRequest).not.toHaveProperty('modelCode');
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
