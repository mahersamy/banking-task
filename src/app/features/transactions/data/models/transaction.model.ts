export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: cardType;
  amount: number;
  merchant: string;
  category: string;
}

export interface TransactionFilter {
  dateFrom:  Date | null;
  dateTo:    Date | null;
  type:      cardType | null;
  category:  string | null;
}

export enum cardType {
    CREDIT = 'Credit',
    DEBIT = 'Debit',
}

export type SortField     = 'date' | 'amount';
export type SortDirection = 'asc' | 'desc';
