export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: 'Debit' | 'Credit';
  amount: number;
  merchant: string;
  category: string;
}

export interface TransactionFilter {
  dateFrom:  string | null;
  dateTo:    string | null;
  type:      string | null;
  category:  string | null;
}

export type SortField     = 'date' | 'amount';
export type SortDirection = 'asc' | 'desc';
