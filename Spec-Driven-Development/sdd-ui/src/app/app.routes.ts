import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './shared/unsaved-changes.guard';

// `breadcrumb` names the page for the trail under the header (see shared/breadcrumb).
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vehicle-makes' },
  {
    path: 'vehicle-makes',
    title: 'Vehicle Make Master',
    data: { breadcrumb: 'makes' },
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-list.component').then(
        (module) => module.VehicleMakeListComponent,
      ),
  },
  {
    path: 'vehicle-makes/new',
    title: 'Add vehicle make',
    data: { mode: 'create', breadcrumb: 'make-new' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-form.component').then(
        (module) => module.VehicleMakeFormComponent,
      ),
  },
  {
    path: 'vehicle-makes/view',
    title: 'Vehicle make details',
    data: { mode: 'view', breadcrumb: 'make-view' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-form.component').then(
        (module) => module.VehicleMakeFormComponent,
      ),
  },
  {
    path: 'vehicle-makes/:makeCode/models/new',
    title: 'Add vehicle model',
    data: { breadcrumb: 'model-new' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-model-form.component').then(
        (module) => module.VehicleModelFormComponent,
      ),
  },
  {
    path: 'vehicle-makes/:makeCode/models/:modelCode/edit',
    title: 'Edit vehicle model',
    data: { breadcrumb: 'model-edit' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-model-form.component').then(
        (module) => module.VehicleModelFormComponent,
      ),
  },
  { path: '**', redirectTo: 'vehicle-makes' },
];
