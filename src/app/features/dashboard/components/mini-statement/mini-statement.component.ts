import { Component, input, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsFacade } from '../../../transactions/data/transactions.facade';

@Component({
  selector: 'app-mini-statement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-statement.component.html',
  styleUrl: './mini-statement.component.scss',
})
export class MiniStatementComponent implements OnInit {
  private readonly txFacade = inject(TransactionsFacade);

  accountId = input.required<string>();

  ngOnInit(): void {
    this.txFacade.loadAll(); // safe — cached after first call
  }

  readonly lastFive = computed(() =>
    this.txFacade
      .allForAccount(this.accountId())
      .slice(0, 5)
  );
}
