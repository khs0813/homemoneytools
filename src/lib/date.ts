const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function startOfDay(date: Date): Date {
  if (!Number.isFinite(date.getTime())) return new Date(1970, 0, 1);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addYears(date: Date, years: number): Date {
  const next = new Date(startOfDay(date));
  next.setFullYear(next.getFullYear() + years);
  return next;
}

export function isValidDateInput(value: string): boolean {
  if (!DATE_INPUT_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T00:00:00`);
  return Number.isFinite(date.getTime()) && date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export function parseDateStrict(value: string | Date): Date {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) throw new RangeError("유효하지 않은 날짜입니다.");
    return startOfDay(value);
  }
  if (!isValidDateInput(value)) throw new RangeError(`유효하지 않은 날짜입니다: ${value}`);
  return startOfDay(new Date(`${value}T00:00:00`));
}

/** @deprecated Use parseDateStrict in calculation code. */
export function parseDate(value: string | Date): Date {
  return parseDateStrict(value);
}

export function monthsBetween(start: Date, end: Date): number {
  const s = startOfDay(start);
  const e = startOfDay(end);
  if (e < s) return 0;
  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() < s.getDate()) months -= 1;
  return Math.max(0, months);
}

export function yearsBetween(start: Date, end: Date): number {
  return Math.floor(monthsBetween(start, end) / 12);
}

export function maxDate(...dates: Date[]): Date {
  return dates.map(startOfDay).reduce((latest, current) => (current > latest ? current : latest));
}

export function todayInputValue(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
