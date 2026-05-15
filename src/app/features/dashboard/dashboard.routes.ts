import { AppRoute } from '../../core/models/interfaces/app-route.interface';
import { authGuard } from '../../core/guards/auth.guard';

export const dashboardRoutes: AppRoute[] = [
  {
    path: 'dashboard',
    data: {
      label: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      sidebar: true,
      title: 'Dashboard',
    },
    loadComponent: () =>
      import('./pages/customers-list/customers-list.component').then(
        (m) => m.CustomersListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard/customers/:id',
    data: { title: 'Customer Details' },
    loadComponent: () =>
      import('./pages/customer-detail/customer-detail.component').then(
        (m) => m.CustomerDetailComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard/customers/:id/accounts/:accountId/transactions',
    loadChildren: () =>
      import('../transactions/transactions.routes').then(
        (m) => m.transactionsRoutes
      ),
    canActivate: [authGuard],
  },
];
