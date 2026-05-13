import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Customer } from './models/customer.model';
import { Account } from './models/account.model';
import { CustomerDetail } from './models/customer-detail.model';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>('/mock/customers.json');
  }

  // Acts like GET /customer/:cif — returns full customer + their accounts
  getCustomer(CIF: string): Observable<CustomerDetail> {
    return forkJoin({
      customers: this.getCustomers(),
      accounts: this.getAccounts()
    }).pipe(
      map(({ customers, accounts }) => {
        const customer = customers.find(c => c.CIF === CIF);
        if (!customer) throw new Error(`Customer with CIF ${CIF} not found`);
        return {
          ...customer,
          accounts: accounts.filter(a => a.customerId === CIF)
        };
      })
    );
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('/mock/accounts.json');
  }
}
