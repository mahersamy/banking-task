import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { authRoutes } from './features/auth/auth.routes';
import { transactionsRoutes } from './features/transactions/transactions.routes';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      ...dashboardRoutes,
      ...transactionsRoutes,
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
