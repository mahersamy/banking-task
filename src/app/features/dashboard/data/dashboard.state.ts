import { Injectable, signal } from '@angular/core';
import { Customer } from './models/customer.model';
import { Account } from './models/account.model';
import { CustomerDetail } from './models/customer-detail.model';

@Injectable({ providedIn: 'root' })
export class DashboardState {
  private _customers = signal<Customer[]>([]);
  private _selectedCustomer = signal<Customer | null>(null);
  private _selectedCustomerDetail = signal<CustomerDetail | null>(null);
  private _accounts = signal<Account[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly customers = this._customers.asReadonly();
  readonly selectedCustomer = this._selectedCustomer.asReadonly();
  readonly selectedCustomerDetail = this._selectedCustomerDetail.asReadonly();
  readonly accounts = this._accounts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  setCustomers(customers: Customer[]): void {
    this._customers.set(customers);
  }

  setSelectedCustomer(customer: Customer | null): void {
    this._selectedCustomer.set(customer);
  }

  setSelectedCustomerDetail(detail: CustomerDetail | null): void {
    this._selectedCustomerDetail.set(detail);
  }

  setAccounts(accounts: Account[]): void {
    this._accounts.set(accounts);
  }

  setLoading(value: boolean): void {
    this._isLoading.set(value);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  reset(): void {
    this._customers.set([]);
    this._selectedCustomer.set(null);
    this._selectedCustomerDetail.set(null);
    this._accounts.set([]);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
