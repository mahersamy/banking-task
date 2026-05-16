import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Transaction, SortField, SortDirection } from '../../data/models/transaction.model';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { TxAmountPipe } from '../../../../shared/pipes/tx-amount.pipe';
import { TxDatePipe } from '../../../../shared/pipes/tx-date.pipe';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TableModule, PaginationComponent, TxAmountPipe, TxDatePipe],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss'
})
export class TransactionTableComponent {
  transactions = input<Transaction[]>([]);
  totalRecords = input<number>(0);
  rows = input<number>(10);
  page = input<number>(1);
  sortField = input<SortField>('date');
  sortDir = input<SortDirection>('desc');

  sortChange = output<SortField>();
  pageChange = output<number>();
  rowsChange = output<number>();

  onSort(field: SortField): void {
    this.sortChange.emit(field);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onRowsChange(rows: number): void {
    this.rowsChange.emit(rows);
  }
}
