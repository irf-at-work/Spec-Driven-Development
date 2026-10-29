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
    // The make to show is passed in the navigation state, not the address, so the address bar stays clean.
    path: 'vehicle-makes/view',
    title: 'Vehicle make details',
    data: { mode: 'view' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-make-form.component').then(
        (module) => module.VehicleMakeFormComponent,
      ),
  },
  { path: '**', redirectTo: 'vehicle-makes' },
];
