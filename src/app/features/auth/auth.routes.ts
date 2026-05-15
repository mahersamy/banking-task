import { publicGuard } from '../../core/guards/public.guard';
import { AppRoute } from '../../core/models/interfaces/app-route.interface';

export const authRoutes: AppRoute[] = [
  {
    path: 'auth/login',
    data: { title: 'Login' },
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];