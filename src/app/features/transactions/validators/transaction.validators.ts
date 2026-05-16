import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { cardType } from '../data/models/transaction.model';

// Date must not be in the future
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // allow today
    return selected > today ? { futureDate: true } : null;
  };
}

// Max 2 decimal places
export function maxDecimalsValidator(decimals: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) return null;
    const regex = new RegExp(`^\\d+(\\.\\d{1,${decimals}})?$`);
    return regex.test(String(control.value)) ? null : { maxDecimals: true };
  };
}

// Cross-field: debit must not exceed account balance
export function exceedsBalanceValidator(getBalance: () => number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent;
    if (!form) return null;
    const type = form.get('type')?.value;
    const amount = parseFloat(control.value);
    const balance = getBalance();
    if (type === cardType.DEBIT && amount > balance) {
      return { exceedsBalance: true };
    }
    return null;
  };
}
