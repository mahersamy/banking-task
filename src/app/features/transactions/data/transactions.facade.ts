import { Injectable, inject, computed, signal, DestroyRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransactionsApiService } from './transactions-api.service';
import { TransactionsState } from './transactions.state';
import { DashboardFacade } from '../../dashboard/data/dashboard.facade';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionFilter, SortField, SortDirection, cardType } from './models/transaction.model';
import { v4 as uuidv4 } from 'uuid';
import { formatDateToYYYYMMDD } from '../../../core/utils/date.util';

@Injectable({ providedIn: 'root' })
export class TransactionsFacade {
  private readonly api = inject(TransactionsApiService);
  private readonly state = inject(TransactionsState);
  private readonly dashboard = inject(DashboardFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly categories = this.state.categories;
  readonly filter = this.state.filter;
  readonly sortField = this.state.sortField;
  readonly sortDir = this.state.sortDir;

  readonly transactions = computed(() => {
    const accountId = this.dashboard.selectedAccount()?.id;
    let list = this.state.all();

    if (accountId) {
      list = list.filter((t: Transaction) => t.accountId === accountId);
    }

    const f = this.state.filter();

    // Filter
    if (f.dateFrom) {
      const fromStr = formatDateToYYYYMMDD(f.dateFrom);
      list = list.filter(t => t.date >= fromStr);
    }
    if (f.dateTo) {
      const toStr = formatDateToYYYYMMDD(f.dateTo);
      list = list.filter(t => t.date <= toStr);
    }
    if (f.type) list = list.filter(t => t.type === f.type);
    if (f.category) list = list.filter(t => t.category === f.category);

    // Sort
    const field = this.state.sortField();
    const dir = this.state.sortDir() === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      if (field === 'date') return dir * a.date.localeCompare(b.date);
      if (field === 'amount') return dir * (a.amount - b.amount);
      return 0;
    });
  });


  // monthly debit and credit
  readonly monthlyDebit = computed(() => {
    const month = new Date().toISOString().slice(0, 7); // e.g. "2025-12"
    return this.transactions()
      .filter(t => t.type === cardType.DEBIT && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  });

  readonly monthlyCredit = computed(() => {
    const month = new Date().toISOString().slice(0, 7);
    return this.transactions()
      .filter(t => t.type === cardType.CREDIT && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  });

  readonly topCategory = computed(() => {
    const month = new Date().toISOString().slice(0, 7);
    const debits = this.transactions()
      .filter(t => t.type === cardType.DEBIT && t.date.startsWith(month));

    if (!debits.length) return null;

    const totals = debits.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    // returns [categoryName, totalAmount] e.g. ["Groceries", 450.75]
  });

  loadAll(): void {
    if (this.state.all().length) return; // already cached

    this.state.setLoading(true);
    forkJoin({
      transactions: this.api.getTransactions(),
      categories: this.api.getCategories(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.state.setLoading(false))
      )
      .subscribe({
        next: ({ transactions, categories }) => {
          this.state.setAll(transactions);
          this.state.setCategories(categories);
        },
        error: () => this.state.setError('Failed to load transactions.'),
      });
  }

  setFilter(filter: TransactionFilter): void {
    this.state.setFilter(filter);
  }

  resetFilter(): void {
    this.state.setFilter({ dateFrom: null, dateTo: null, type: null, category: null });
  }

  setSort(field: SortField, dir: SortDirection): void {
    this.state.setSortField(field);
    this.state.setSortDir(dir);
  }

  createTransaction(dto: CreateTransactionDto, onSuccess?: () => void): void {
    const account = this.dashboard.selectedAccount();
    if (!account) return;

    // Business Rule 3.1 — Debit must not exceed balance
    if (dto.type === cardType.DEBIT && dto.amount > account.balance) {
      this.state.setError('Debit amount exceeds account balance.');
      return;
    }

    this.state.setLoading(true);

    // Simulate API delay to show loading state
    setTimeout(() => {
      const dateStr = formatDateToYYYYMMDD(dto.date);

      const newTransaction: Transaction = {
        id: `TRN_${uuidv4()}`,   // Business Rule 3.4 — client-side ID
        accountId: account.id,
        date: dateStr,
        type: dto.type,
        amount: dto.amount,
        merchant: dto.merchant,
        category: dto.category,
      };

      // Business Rules 3.2 & 3.3 — update balance
      const delta = dto.type === cardType.DEBIT ? -dto.amount : dto.amount;
      this.dashboard.updateAccountBalance(account.id, delta);

      this.state.addTransaction(newTransaction);
      this.state.setLoading(false);
      this.resetFilter();
      onSuccess?.();
    }, 800);
  }



  allForAccount(accountId: string): Transaction[] {
    return [...this.state.all()]
      .filter(t => t.accountId === accountId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }
}
