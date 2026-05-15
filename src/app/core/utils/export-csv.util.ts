export function exportToCsv<T extends object>(
  rows: T[],
  headers: { label: string; key: keyof T }[],
  filename: string
): void {
  if (!rows.length) return;

  const headerRow = headers.map(h => h.label).join(',');

  const dataRows = rows.map(row =>
    headers
      .map(h => {
        const val = row[h.key] ?? '';
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str}"`
          : str;
      })
      .join(',')
  );

  const csv  = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');

  a.href     = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}