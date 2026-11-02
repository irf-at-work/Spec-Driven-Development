import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { ListingMasterPage } from './pages/listing-master/listing-master-page';
import { DashboardLayout } from './layout/dashboard-layout';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage, pathMatch: 'full' },
      {
        path: 'company-master',
        loadComponent: () =>
          import('./pages/company-master/company-master-page').then(
            (module) => module.CompanyMasterPage,
          ),
      },
      {
        path: 'company-master/new',
        loadComponent: () =>
          import('./pages/company-master/company-form').then((module) => module.CompanyForm),
      },
      {
        path: 'company-master/:companyCode/edit',
        loadComponent: () =>
          import('./pages/company-master/company-details-page').then(
            (module) => module.CompanyDetailsPage,
          ),
        data: { startInEditMode: true },
      },
      {
        path: 'company-master/:companyCode',
        loadComponent: () =>
          import('./pages/company-master/company-details-page').then(
            (module) => module.CompanyDetailsPage,
          ),
      },
      {
        path: 'listing-master/new',
        loadComponent: () =>
          import('./pages/listing-master/list-item-create-page').then(
            (module) => module.ListItemCreatePage,
          ),
      },
      {
        path: 'listing-master/:liType/:liCode',
        loadComponent: () =>
          import('./pages/listing-master/list-item-details-page').then(
            (module) => module.ListItemDetailsPage,
          ),
      },
      { path: 'listing-master', component: ListingMasterPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
