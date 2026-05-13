import { Customer } from './customer.model';
import { Account } from './account.model';

export interface CustomerDetail extends Customer {
  accounts: Account[];
}
