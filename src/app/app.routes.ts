import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/dashboard/pages/customers-list/customers-list.component'
              ).then((m) => m.CustomersListComponent),
          },
          {
            path: 'customers/:id',
            loadComponent: () =>
              import(
                './features/dashboard/pages/customer-detail/customer-detail.component'
              ).then((m) => m.CustomerDetailComponent),
          },
          {
            path: 'customers/:id/accounts/:accountId/transactions',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/transactions/pages/transactions-list/transactions-list.component'
                  ).then((m) => m.TransactionsListComponent),
              },
              {
                path: 'new',
                loadComponent: () =>
                  import(
                    './features/transactions/pages/create-transaction/create-transaction.component'
                  ).then((m) => m.CreateTransactionComponent),
              },
            ],
          },
        ],
      },
      {
        path: 'transactions',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/transactions/pages/transactions-list/transactions-list.component'
              ).then((m) => m.TransactionsListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './features/transactions/pages/create-transaction/create-transaction.component'
              ).then((m) => m.CreateTransactionComponent),
          },
        ],
      },
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
