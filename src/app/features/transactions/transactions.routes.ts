import { Routes } from '@angular/router';

export const transactionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transactions-list/transactions-list.component')
        .then(m => m.TransactionsListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/create-transaction/create-transaction.component')
        .then(m => m.CreateTransactionComponent),
  },
];
