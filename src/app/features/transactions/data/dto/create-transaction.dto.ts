export interface CreateTransactionDto {
  type: 'Debit' | 'Credit';
  amount: number;
  date: string;
  merchant: string;
  category: string;
}
