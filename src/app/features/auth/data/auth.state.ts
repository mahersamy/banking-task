import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  setAuthenticated(value: boolean): void {
    this._isAuthenticated.set(value);
  }

  setLoading(value: boolean): void {
    this._isLoading.set(value);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  reset(): void {
    this._isAuthenticated.set(false);
    this._isLoading.set(false);
    this._error.set(null);
  }
}