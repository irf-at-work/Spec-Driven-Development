import { Routes } from '@angular/router';

export const routes: Routes = [
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
