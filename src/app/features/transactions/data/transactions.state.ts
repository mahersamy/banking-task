import { Injectable, signal } from '@angular/core';
import { Transaction, TransactionFilter, SortField, SortDirection } from './models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsState {
  private _all         = signal<Transaction[]>([]);
  private _categories  = signal<string[]>([]);
  private _loading     = signal<boolean>(false);
  private _error       = signal<string | null>(null);
  private _filter      = signal<TransactionFilter>({
    dateFrom: null, dateTo: null, type: null, category: null
  });
  private _sortField   = signal<SortField>('date');
  private _sortDir     = signal<SortDirection>('desc');

  readonly all         = this._all.asReadonly();
  readonly categories  = this._categories.asReadonly();
  readonly loading     = this._loading.asReadonly();
  readonly error       = this._error.asReadonly();
  readonly filter      = this._filter.asReadonly();
  readonly sortField   = this._sortField.asReadonly();
  readonly sortDir     = this._sortDir.asReadonly();

  setAll(v: Transaction[])              { this._all.set(v); }
  setCategories(v: string[])            { this._categories.set(v); }
  setLoading(v: boolean)                { this._loading.set(v); }
  setError(v: string | null)            { this._error.set(v); }
  setFilter(v: TransactionFilter)       { this._filter.set(v); }
  setSortField(v: SortField)            { this._sortField.set(v); }
  setSortDir(v: SortDirection)          { this._sortDir.set(v); }

  addTransaction(t: Transaction): void {
    this._all.update(prev => [t, ...prev]);
  }
}
