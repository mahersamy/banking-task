import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'customer/:cif',
    loadComponent: () => import('./pages/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent)
  }
];
