import { Injectable, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthState } from './auth.state';
import { LoginDto } from '../models/dto/login.dto';
import { AuthApi } from './auth-api.service';
import { LoginResponseDto } from '../models/dto/login-response.dto';
import { LOCALSTORAGE_KEY } from '../../../core/constants/localstorage-key.const';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(AuthApi);
  private readonly state = inject(AuthState);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);

  // Expose signals directly to components
  readonly isLoading = this.state.isLoading;
  readonly isAuthenticated = this.state.isAuthenticated;
  readonly error = this.state.error;
  

  login(credentials: LoginDto): void {
    this.state.setLoading(true);
    this.state.setError(null);


    this.api
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: LoginResponseDto) => {
          this.state.setAuthenticated(true);
          this.storage.set(LOCALSTORAGE_KEY.AUTH_TOKEN, res.token);
          this.state.setLoading(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.state.setError(error.message);
          this.state.setLoading(false);
        }
      });


  }

  logout(): void {
    this.storage.remove(LOCALSTORAGE_KEY.AUTH_TOKEN);
    this.state.reset();
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.storage.has(LOCALSTORAGE_KEY.AUTH_TOKEN);
  }
}