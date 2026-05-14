import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardState } from './dashboard.state';
import { Customer } from './models/customer.model';
import { Account } from './models/account.model';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly api        = inject(DashboardApiService);
  private readonly state      = inject(DashboardState);
  private readonly destroyRef = inject(DestroyRef);

  readonly customers              = this.state.customers;
  readonly selectedCustomer       = this.state.selectedCustomer;
  readonly selectedCustomerDetail = this.state.selectedCustomerDetail;
  readonly isLoading              = this.state.isLoading;
  readonly error                  = this.state.error;

  private readonly _selectedAccount = signal<Account | null>(null);
  readonly selectedAccount          = this._selectedAccount.asReadonly();

  // ✅ Derived — always correct for whoever is selected, no stale data
  readonly customerAccounts = computed(() => {
  const cif = this.state.selectedCustomerDetail()?.CIF;

  if (!cif) return [];

  return this.state
    .accounts()
    .filter(a => a.customerId === cif);
});

  // ── Customers ────────────────────────────────────────────
  loadCustomers(): void {
    if (this.state.customers().length) return; // ✅ cache guard

    this.state.setLoading(true);
    this.state.setError(null);

    this.api.getCustomers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.state.setLoading(false))
      )
      .subscribe({
        next:  (customers) => this.state.setCustomers(customers),
        error: ()          => this.state.setError('Failed to load customers.'),
      });
  }

  // ── Accounts ─────────────────────────────────────────────
  private loadAccounts(): void {
    if (this.state.accounts().length) return; // ✅ load once, never again

    this.state.setLoading(true);

    this.api.getAccounts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.state.setLoading(false))
      )
      .subscribe({
        next: (accounts) => {
          this.state.setAccounts(accounts); // ✅ ALL accounts stored — never filtered
        },
        error: () => this.state.setError('Failed to load accounts.'),
      });
  }

  // ── Customer selection ────────────────────────────────────
  selectCustomer(customer: Customer): void {
    this.state.setSelectedCustomer(customer);
    this.loadAccounts(); // ✅ loads all once, derived signal filters for this customer
  }

  loadCustomerDetail(CIF: string): void {
    this.state.setLoading(true);
    this.state.setError(null);
    this.state.setSelectedCustomerDetail(null);

    this.api.getCustomer(CIF)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.state.setLoading(false))
      )
      .subscribe({
        next: (detail) => {
          this.state.setSelectedCustomerDetail(detail);
          this.loadAccounts(); // ✅ same — loads all once
        },
        error: (err) => this.state.setError(err.message ?? 'Failed to load detail.'),
      });
  }

  // ── Account selection ─────────────────────────────────────
  selectAccount(accountId: string): void {
    // ✅ search in ALL accounts, not filtered list
    const found = this.state.accounts().find(a => a.id === accountId) ?? null;
    this._selectedAccount.set(found);
  }

  clearSelection(): void {
    this.state.setSelectedCustomer(null);
    this.state.setSelectedCustomerDetail(null);
    this._selectedAccount.set(null);
    // ✅ do NOT clear accounts — keep them cached
  }

  // ── Balance update ────────────────────────────────────────
  updateAccountBalance(accountId: string, delta: number): void {
    // ✅ NO guard — always runs
    this.state.setAccounts(
      this.state.accounts().map(a =>
        a.id === accountId
          ? { ...a, balance: parseFloat((a.balance + delta).toFixed(2)) }
          : a
      )
    );

    // Keep selectedAccount signal in sync
    if (this._selectedAccount()?.id === accountId) {
      const updated = this.state.accounts().find(a => a.id === accountId) ?? null;
      this._selectedAccount.set(updated);
    }
  }
}