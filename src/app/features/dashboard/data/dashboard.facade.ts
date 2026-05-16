import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { DashboardApiService } from './dashboard-api.service';
import { Customer } from './models/customer.model';
import { Account } from './models/account.model';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly api        = inject(DashboardApiService);
  private readonly queryClient = inject(QueryClient);

  // ── Queries ──────────────────────────────────────────────

  customersQuery = injectQuery(() => ({
    queryKey: ['customers'],
    queryFn: () => lastValueFrom(this.api.getCustomers()),
    staleTime: 5 * 60 * 1000,
  }));

  accountsQuery = injectQuery(() => ({
    queryKey: ['accounts'],
    queryFn: () => lastValueFrom(this.api.getAccounts()),
    staleTime: 5 * 60 * 1000,
  }));

  private readonly _selectedCif = signal<string | null>(null);

  customerDetailQuery = injectQuery(() => ({
    queryKey: ['customerDetail', this._selectedCif()],
    queryFn: () => {
      const cif = this._selectedCif();
      if (!cif) return Promise.resolve(null);
      return lastValueFrom(this.api.getCustomer(cif));
    },
    enabled: !!this._selectedCif(),
    staleTime: 5 * 60 * 1000,
  }));

  // ── Public State ─────────────────────────────────────────

  readonly customers              = computed(() => this.customersQuery.data() ?? []);
  readonly isCustomersLoading     = this.customersQuery.isLoading;
  readonly customersError         = this.customersQuery.error;

  readonly accounts               = computed(() => this.accountsQuery.data() ?? []);
  readonly isAccountsLoading      = this.accountsQuery.isLoading;

  readonly selectedCustomerDetail = computed(() => this.customerDetailQuery.data() ?? null);
  
  // We can merge loading states if needed by old components
  readonly isLoading = computed(() => 
    this.customersQuery.isLoading() || 
    this.accountsQuery.isLoading() || 
    this.customerDetailQuery.isLoading()
  );

  readonly error = computed(() => 
    this.customersQuery.error()?.message || 
    this.accountsQuery.error()?.message || 
    this.customerDetailQuery.error()?.message || 
    null
  );

  private readonly _selectedAccountId = signal<string | null>(null);
  
  readonly selectedAccount = computed(() => {
    const id = this._selectedAccountId();
    return id ? (this.accounts().find(a => a.id === id) ?? null) : null;
  });

  // Derived — filters accounts for the selected CIF
  readonly customerAccounts = computed(() => {
    const cif = this._selectedCif();
    if (!cif) return [];
    return this.accounts().filter(a => a.customerId === cif);
  });

  // For the customer list to highlight the selected row
  readonly selectedCustomer = computed(() => {
    const cif = this._selectedCif();
    return cif ? (this.customers().find(c => c.CIF === cif) ?? null) : null;
  });

  // ── Actions ──────────────────────────────────────────────

  selectCustomer(customer: Customer): void {
    this._selectedCif.set(customer.CIF);
  }

  loadCustomerDetail(CIF: string): void {
    // Just setting the signal triggers the query to fetch if not cached
    this._selectedCif.set(CIF);
  }

  selectAccount(accountId: string): void {
    this._selectedAccountId.set(accountId);
  }

  clearSelection(): void {
    this._selectedCif.set(null);
    this._selectedAccountId.set(null);
  }

  updateAccountBalance(accountId: string, delta: number): void {
    // Update accounts cache
    this.queryClient.setQueryData(['accounts'], (old: Account[] | undefined) => {
      if (!old) return [];
      return old.map(a =>
        a.id === accountId
          ? { ...a, balance: parseFloat((a.balance + delta).toFixed(2)) }
          : a
      );
    });

    // We also need to update the customerDetail cache because it contains an accounts array
    const cif = this._selectedCif();
    if (cif) {
      this.queryClient.setQueryData(['customerDetail', cif], (old: any) => {
        if (!old) return null;
        return {
          ...old,
          accounts: old.accounts.map((a: Account) => 
            a.id === accountId
              ? { ...a, balance: parseFloat((a.balance + delta).toFixed(2)) }
              : a
          )
        };
      });
    }
  }
}