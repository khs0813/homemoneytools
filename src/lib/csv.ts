const CSV_INJECTION_PREFIX_PATTERN = /^[=+\-@]/;

export function escapeCsvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  const protectedText = CSV_INJECTION_PREFIX_PATTERN.test(text) ? `'${text}` : text;
  return `"${protectedText.replace(/"/g, '""')}"`;
}

export function rowsToCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}
