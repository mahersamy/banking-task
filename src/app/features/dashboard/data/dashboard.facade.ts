import { Injectable, inject } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardState } from './dashboard.state';
import { Customer } from './models/customer.model';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly api = inject(DashboardApiService);
  private readonly state = inject(DashboardState);

  // Expose signals
  readonly customers = this.state.customers;
  readonly selectedCustomer = this.state.selectedCustomer;
  readonly selectedCustomerDetail = this.state.selectedCustomerDetail;
  readonly accounts = this.state.accounts;
  readonly isLoading = this.state.isLoading;
  readonly error = this.state.error;

  loadCustomers(): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.api.getCustomers()
      .pipe(finalize(() => this.state.setLoading(false)))
      .subscribe({
        next: (customers) => {
          this.state.setCustomers(customers);
        },
        error: (err) => {
          console.error('Failed to load customers', err);
          this.state.setError('Failed to load customer data.');
        }
      });
  }

  selectCustomer(customer: Customer): void {
    this.state.setSelectedCustomer(customer);
    this.loadAccountsForCustomer(customer.CIF);
  }

  clearSelection(): void {
    this.state.setSelectedCustomer(null);
    this.state.setSelectedCustomerDetail(null);
    this.state.setAccounts([]);
  }

  loadCustomerDetail(CIF: string): void {
    this.state.setLoading(true);
    this.state.setError(null);
    this.state.setSelectedCustomerDetail(null);

    this.api.getCustomer(CIF)
      .pipe(finalize(() => this.state.setLoading(false)))
      .subscribe({
        next: (detail) => {
          this.state.setSelectedCustomerDetail(detail);
        },
        error: (err) => {
          this.state.setError(err.message ?? 'Failed to load customer detail.');
        }
      });
  }

  private loadAccountsForCustomer(customerId: string): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.api.getAccounts()
      .pipe(
        map(accounts => accounts.filter(acc => acc.customerId === customerId)),
        finalize(() => this.state.setLoading(false))
      )
      .subscribe({
        next: (filteredAccounts) => {
          this.state.setAccounts(filteredAccounts);
        },
        error: (err) => {
          console.error('Failed to load accounts', err);
          this.state.setError('Failed to load account data.');
        }
      });
  }
}
