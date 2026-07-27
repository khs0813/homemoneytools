export const MAX_SAFE_MONEY_AMOUNT = 1_000_000_000_000_000;
export const MAX_SAFE_RATE_PERCENT = 100;
export const MAX_SAFE_YEARS = 100;
export const MAX_DECIMAL_PLACES = 4;

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}


export function sanitizeNumber(value: number, min = 0, max = MAX_SAFE_MONEY_AMOUNT): number {
  return clamp(value, min, max);
}

export function parseBoundedNumber(value: string, min = 0, max = MAX_SAFE_MONEY_AMOUNT, maxDecimalPlaces = MAX_DECIMAL_PLACES): number {
  const trimmed = value.trim();
  if (!trimmed) return min;
  if (!/^\d+(?:\.\d+)?$/.test(trimmed)) return min;
  const decimalPart = trimmed.split(".")[1];
  if (decimalPart && decimalPart.length > maxDecimalPlaces) return min;

  const parsed = Number(trimmed);
  return clamp(parsed, min, max);
}

export function roundTo(value: number, digits = 0): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Math.round(value).toLocaleString("ko-KR");
}

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "0원";
  const rounded = Math.round(value);
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  return `${normalized.toLocaleString("ko-KR")}원`;
}

export function formatKoreanMoney(value: number): string {
  return formatCurrency(value);
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "0%";
  return `${roundTo(value, digits).toLocaleString("ko-KR")}％`;
}

export function parseDigits(value: string, max = MAX_SAFE_MONEY_AMOUNT): number {
  const onlyDigits = value.replace(/[^0-9]/g, "");
  if (!onlyDigits) return 0;
  if (onlyDigits.length > 18) return max;
  return clamp(Number(onlyDigits), 0, max);
}

export function asWon(input: number, unit: "won" | "manwon"): number {
  if (!Number.isFinite(input)) return 0;
  const value = unit === "manwon" ? input * 10_000 : input;
  return clamp(value, 0, MAX_SAFE_MONEY_AMOUNT);
}
