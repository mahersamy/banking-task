import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/customers-list/customers-list.component')
        .then(m => m.CustomersListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'customers/:id',
    loadComponent: () =>
      import('./pages/customer-detail/customer-detail.component')
        .then(m => m.CustomerDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'customers/:id/accounts/:accountId/transactions',
    loadChildren: () =>
      import('../transactions/transactions.routes')
        .then(m => m.transactionsRoutes),
    canActivate: [authGuard],
  },
];
