import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { LOCALSTORAGE_KEY } from '../constants/localstorage-key.const';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router  = inject(Router);
  const storage = inject(StorageService);

  const token = storage.get<string>(LOCALSTORAGE_KEY.AUTH_TOKEN);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storage.remove(LOCALSTORAGE_KEY.AUTH_TOKEN);   // ✅ via service
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
