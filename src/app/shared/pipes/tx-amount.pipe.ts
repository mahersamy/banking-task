import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Transaction, cardType } from '../../features/transactions/data/models/transaction.model';

@Pipe({
  name: 'txAmount',
  standalone: true,
})
export class TxAmountPipe implements PipeTransform {
  private readonly decimal = new DecimalPipe('en-US');

  transform(transaction: Transaction): string {
    const sign = transaction.type === cardType.DEBIT ? '−' : '+';
    const formatted = this.decimal.transform(transaction.amount, '1.2-2');
    return `${sign}${formatted}`;
  }
}
