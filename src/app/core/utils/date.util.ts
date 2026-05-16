/**
 * Formats a Date object or a date string into 'YYYY-MM-DD' format.
 * If the input is already a string, it returns it as is.
 * 
 * @param d The date to format
 * @returns A string in 'YYYY-MM-DD' format
 */
export const formatDateToYYYYMMDD = (d: Date | string | null | undefined): string => {
  if (!d) return '';
  if (typeof d === 'string') return d;
  
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${y}-${m}-${day}`;
};
