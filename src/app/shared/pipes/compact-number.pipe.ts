import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compactNumber',
  standalone: true,
})
export class CompactNumberPipe implements PipeTransform {
  /**
   * Formats a number into a compact human-readable string.
   * @param value - The number to format
   * @param decimals - Number of decimal places (default: 1)
   * @example 1500 → "1.5K", 1200000 → "1.2M", 999 → "999"
   */
  transform(value: number | null | undefined, decimals: number = 1): string {
    if (value == null || isNaN(value)) return '0';

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs >= 1_000_000_000) {
      return `${sign}${(abs / 1_000_000_000).toFixed(decimals).replace(/\.0$/, '')}B`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toFixed(decimals).replace(/\.0$/, '')}M`;
    }
    if (abs >= 1_000) {
      return `${sign}${(abs / 1_000).toFixed(decimals).replace(/\.0$/, '')}K`;
    }
    return `${sign}${abs.toFixed(decimals).replace(/\.0$/, '')}`;
  }
}
