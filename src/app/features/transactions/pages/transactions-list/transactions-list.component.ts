import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DashboardFacade } from '../../../dashboard/data/dashboard.facade';
import { TransactionsFacade } from '../../data/transactions.facade';
import { SortField, SortDirection } from '../../data/models/transaction.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { exportToCsv } from '../../../../core/utils/export-csv.util';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    DatePickerModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionsListComponent implements OnInit {
  readonly facade = inject(TransactionsFacade);
  readonly dashboard = inject(DashboardFacade);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  filterForm = this.fb.group({
    dateFrom: [null],
    dateTo: [null],
    type: [null],
    category: [null],
  });

  ngOnInit(): void {
    this.facade.loadAll();

    // Re-hydrate state from Path Params on refresh
    this.route.paramMap.subscribe(params => {
      const cif = params.get('id');
      const accId = params.get('accountId');
      if (cif) this.dashboard.loadCustomerDetail(cif);
      if (accId) this.dashboard.selectAccount(accId);
    });
  }

  goBack(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.router.navigate(['/dashboard/customers', customerId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  applyFilter(): void {
    this.facade.setFilter(this.filterForm.getRawValue() as any);
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.facade.resetFilter();
  }

  sort(field: SortField): void {
    const current = this.facade.sortField();
    const dir: SortDirection =
      current === field && this.facade.sortDir() === 'asc' ? 'desc' : 'asc';
    this.facade.setSort(field, dir);
  }

  exportCsv(): void {
    exportToCsv(
      this.facade.transactions(),
      [
        { label: 'ID', key: 'id' },
        { label: 'Date', key: 'date' },
        { label: 'Type', key: 'type' },
        { label: 'Amount', key: 'amount' },
        { label: 'Merchant', key: 'merchant' },
        { label: 'Category', key: 'category' },
      ],
      'transactions'
    );
  }

  readonly categoryOptions = computed(() => [
    { label: 'All Categories', value: null },
    ...this.facade.categories().map(c => ({ label: c, value: c }))
  ]);
}
