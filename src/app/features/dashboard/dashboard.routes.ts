import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'customer/:cif',
    loadComponent: () => import('./pages/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent),
    canActivate: [authGuard],
  }
];
