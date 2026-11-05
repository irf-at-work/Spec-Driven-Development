import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './shared/unsaved-changes.guard';

// `breadcrumb` names the page for the trail under the header (see shared/breadcrumb).
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vehicle-makes' },
  {
    path: 'vehicle-makes/import',
    title: 'Import Vehicle Makes',
    data: { breadcrumb: 'make-import', kind: 'vehicle' },
    loadComponent: () =>
      import('./features/master-data-import.component').then(
        (module) => module.MasterDataImportComponent,
      ),
  },
  {
    path: 'premium-adjustments/import',
    title: 'Import Premium Adjustments',
    data: { breadcrumb: 'premium-adjustment-import', kind: 'premium' },
    loadComponent: () =>
      import('./features/master-data-import.component').then(
        (module) => module.MasterDataImportComponent,
      ),
  },
  {
    path: 'vehicle-model-options/import',
    title: 'Import Vehicle Dropdown Choices',
    data: { breadcrumb: 'vehicle-model-options-import' },
    loadComponent: () =>
      import('./features/vehicle-makes/vehicle-model-options-import.component').then(
        (module) => module.VehicleModelOptionsImportComponent,
      ),
  },
  {
    path: 'premium-adjustments/new',
    title: 'Add Premium Adjustment',
    data: { mode: 'create', breadcrumb: 'premium-adjustment-new' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/premium-adjustments/premium-adjustment-form.component').then(
        (module) => module.PremiumAdjustmentFormComponent,
      ),
  },
  {
    path: 'premium-adjustments/view',
    title: 'Premium Adjustment Details',
    data: { mode: 'view', breadcrumb: 'premium-adjustment-view' },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/premium-adjustments/premium-adjustment-form.component').then(
        (module) => module.PremiumAdjustmentFormComponent,
      ),
  },
  {
    path: 'premium-adjustments',
    pathMatch: 'full',
    title: 'Premium Adjustment Master',
    data: { breadcrumb: 'premium-adjustments' },
    loadComponent: () =>
      import('./features/premium-adjustments/premium-adjustment-list.component').then(
        (module) => module.PremiumAdjustmentListComponent,
      ),
  },
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
    path: 'vehicle-makes/:makeCode/models/import',
    title: 'Import Vehicle Models',
    data: { breadcrumb: 'model-import', kind: 'model' },
    loadComponent: () =>
      import('./features/master-data-import.component').then(
        (module) => module.MasterDataImportComponent,
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
