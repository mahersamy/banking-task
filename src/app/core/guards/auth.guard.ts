import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LOCALSTORAGE_KEY } from '../constants/localstorage-key.const';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storage = inject(StorageService);
  const token = storage.get<string>(LOCALSTORAGE_KEY.AUTH_TOKEN);

  if (token) return true;

  return router.createUrlTree(['/auth/login']);
};