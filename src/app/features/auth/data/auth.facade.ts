import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthState } from './auth.state';
import { LoginDto } from '../models/dto/login.dto';
import { AuthApi } from './auth-api.service';
import { LoginResponseDto } from '../models/dto/login-response.dto';
import { LOCALSTORAGE_ROUTE } from '../../../core/constants/localstorage-key.const';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(AuthApi);
  private readonly state = inject(AuthState);
  private readonly router = inject(Router);

  // Expose signals directly to components
  readonly isLoading = this.state.isLoading;
  readonly isAuthenticated = this.state.isAuthenticated;
  readonly error = this.state.error;

  login(credentials: LoginDto): void {
    this.state.setLoading(true);
    this.state.setError(null);


    this.api
      .login(credentials)
      .subscribe({
        next: (res: LoginResponseDto) => {
          this.state.setAuthenticated(true);
          localStorage.setItem(LOCALSTORAGE_ROUTE.AUTH_TOKEN, res.token)
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.state.setError(error.message);
          this.state.setLoading(false);
        }
      });


  }

  logout(): void {
    localStorage.removeItem(LOCALSTORAGE_ROUTE.AUTH_TOKEN);
    this.state.reset();
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(LOCALSTORAGE_ROUTE.AUTH_TOKEN);
  }
}