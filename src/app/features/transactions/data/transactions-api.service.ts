import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Transaction } from './models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  private readonly http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>('/mock/transactions.json')
  }

  getCategories(): Observable<string[]> {
    return this.http
      .get<string[]>('/mock/transaction-categories.json')
  }
}
