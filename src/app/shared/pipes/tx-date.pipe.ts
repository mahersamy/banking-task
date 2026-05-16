import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'txDate',
  standalone: true,
})
export class TxDatePipe implements PipeTransform {
  /**
   * Transforms a 'YYYY-MM-DD' date string into a human-readable format.
   * @param value - The date string (e.g., "2026-05-15")
   * @param format - 'short' for "May 15" or 'long' (default) for "May 15, 2026"
   */
  transform(value: string | null | undefined, format: 'short' | 'long' = 'long'): string {
    if (!value) return '—';

    // Parse as local date to avoid timezone off-by-one issues
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return value;

    const options: Intl.DateTimeFormatOptions =
      format === 'short'
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' };

    return date.toLocaleDateString('en-US', options);
  }
}
