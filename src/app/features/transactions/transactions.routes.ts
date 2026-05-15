import { AppRoute } from '../../core/models/interfaces/app-route.interface';

export const transactionsRoutes: AppRoute[] = [
  {
    path: '',
    data: {
      title: 'Transactions',
    },
    loadComponent: () =>
      import('./pages/transactions-list/transactions-list.component').then(
        (m) => m.TransactionsListComponent
      ),
  },
  {
    path: 'new',
    data: { title: 'Create Transaction' },
    loadComponent: () =>
      import('./pages/create-transaction/create-transaction.component').then(
        (m) => m.CreateTransactionComponent
      ),
  },
];
