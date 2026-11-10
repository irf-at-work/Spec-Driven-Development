import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './features/document-setup/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: 'claim-configurations/add',
    loadComponent: () =>
      import('./features/claim-configuration/pages/claim-configuration-detail-page').then(
        (page) => page.ClaimConfigurationDetailPage,
      ),
  },
  {
    path: 'claim-configurations/:ccmCode/edit',
    loadComponent: () =>
      import('./features/claim-configuration/pages/claim-configuration-detail-page').then(
        (page) => page.ClaimConfigurationDetailPage,
      ),
  },
  {
    path: 'claim-configurations',
    loadComponent: () =>
      import('./features/claim-configuration/pages/claim-configurations-list-page').then(
        (page) => page.ClaimConfigurationsListPage,
      ),
  },
  {
    path: 'document-setups/add/applicable-modules/add',
    loadComponent: () =>
      import('./features/document-setup/pages/applicable-module-form-page').then(
        (page) => page.ApplicableModuleFormPage,
      ),
    data: { parentDraft: true },
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'document-setups/add',
    loadComponent: () =>
      import('./features/document-setup/pages/document-setup-add-page').then(
        (page) => page.DocumentSetupAddPage,
      ),
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'document-setups/:docCode/applicable-modules/:damodUid/edit',
    loadComponent: () =>
      import('./features/document-setup/pages/applicable-module-form-page').then(
        (page) => page.ApplicableModuleFormPage,
      ),
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'document-setups/:docCode/applicable-modules/add',
    loadComponent: () =>
      import('./features/document-setup/pages/applicable-module-form-page').then(
        (page) => page.ApplicableModuleFormPage,
      ),
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'document-setups/:docCode/edit',
    loadComponent: () =>
      import('./features/document-setup/pages/document-setup-edit-page').then(
        (page) => page.DocumentSetupEditPage,
      ),
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'document-setups',
    loadComponent: () =>
      import('./features/document-setup/pages/document-setups-list-page').then(
        (page) => page.DocumentSetupsListPage,
      ),
  },
  {
    path: 'codes/add',
    loadComponent: () =>
      import('./features/codes-master/pages/code-add-page').then((page) => page.CodeAddPage),
  },
  {
    path: 'codes/edit',
    loadComponent: () =>
      import('./features/codes-master/pages/code-edit-page').then((page) => page.CodeEditPage),
  },
  {
    path: 'codes',
    loadComponent: () =>
      import('./features/codes-master/pages/codes-list-page').then((page) => page.CodesListPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'codes' },
  { path: '**', redirectTo: 'codes' },
];
