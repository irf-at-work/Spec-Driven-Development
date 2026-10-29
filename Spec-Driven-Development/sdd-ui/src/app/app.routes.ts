import { Routes } from '@angular/router';
import { CompanyMasterPage } from './pages/company-master/company-master-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { ListingMasterPage } from './pages/listing-master/listing-master-page';
import { DashboardLayout } from './layout/dashboard-layout';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage, pathMatch: 'full' },
      { path: 'company-master', component: CompanyMasterPage },
      { path: 'listing-master', component: ListingMasterPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
