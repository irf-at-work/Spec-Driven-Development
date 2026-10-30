import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './shared/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vehicle-makes' },
  {
    path: 'vehicle-makes',
    title: 'Vehicle Make Master',
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-list.component').then(
        (module) => module.VehicleMakeListComponent,
      ),
  },
  {
    path: 'vehicle-makes/new',
    title: 'Add vehicle make',
    data: { mode: 'create' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-form.component').then(
        (module) => module.VehicleMakeFormComponent,
      ),
  },
  {
    path: 'vehicle-makes/view',
    title: 'Vehicle make details',
    data: { mode: 'view' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-form.component').then(
        (module) => module.VehicleMakeFormComponent,
      ),
  },
  {
    path: 'vehicle-makes/:makeCode/models/new',
    title: 'Add vehicle model',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-model-form.component').then(
        (module) => module.VehicleModelFormComponent,
      ),
  },
  {
    path: 'vehicle-makes/:makeCode/models/:modelCode/edit',
    title: 'Edit vehicle model',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-model-form.component').then(
        (module) => module.VehicleModelFormComponent,
      ),
  },
  { path: '**', redirectTo: 'vehicle-makes' },
];
