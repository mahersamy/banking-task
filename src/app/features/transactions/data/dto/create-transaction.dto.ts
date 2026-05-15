import { cardType } from "../models/transaction.model";

export interface CreateTransactionDto {
  type: cardType;
  amount: number;
  date: string;
  merchant: string;
  category: string;
}
