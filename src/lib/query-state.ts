const DEFAULT_MIN_NUMBER = 0;
const DEFAULT_MAX_NUMBER = 1_000_000_000_000_000;
const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const QUERY_KEY_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;
const MAX_QUERY_VALUE_LENGTH = 128;
const SENSITIVE_QUERY_KEY_PATTERN = /(amount|deposit|income|salary|price|rent|principal|loan|mortgage|housing|debt|wage|tax|fee|bonus|payment|repayment|jeonse)/i;

type NumberParamOptions = {
  min?: number;
  max?: number;
};

function isValidDateInput(value: string): boolean {
  if (!DATE_INPUT_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T00:00:00`);

  return Number.isFinite(date.getTime()) && date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

function normalizeQueryValue(value: string | number | boolean): string | null {
  const normalized = String(value).trim();
  if (!normalized || normalized.length > MAX_QUERY_VALUE_LENGTH) return null;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function getSearchOrFragmentParam(name: string): string | null {
  if (typeof window === "undefined") return null;

  const searchValue = window.location.search ? new URLSearchParams(window.location.search).get(name) : null;
  if (searchValue !== null) return searchValue;

  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  if (!hash || hash.startsWith("/")) return null;
  return new URLSearchParams(hash).get(name);
}

export function writeQueryState(values: Record<string, string | number | boolean | undefined | null>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  Object.entries(values).forEach(([key, value]) => {
    if (!QUERY_KEY_PATTERN.test(key)) return;
    if (SENSITIVE_QUERY_KEY_PATTERN.test(key)) {
      url.searchParams.delete(key);
      return;
    }
    if (value === undefined || value === null || value === "") {
      url.searchParams.delete(key);
      return;
    }

    const safeValue = normalizeQueryValue(value);
    if (safeValue === null) {
      url.searchParams.delete(key);
      return;
    }

    url.searchParams.set(key, safeValue);
  });
  window.history.replaceState({}, "", url.toString());
}

export function getNumberParam(name: string, fallback: number, options: NumberParamOptions = {}): number {
  if (typeof window === "undefined" || !QUERY_KEY_PATTERN.test(name)) return fallback;
  const value = getSearchOrFragmentParam(name);
  if (value === null || value.length > 32 || /[^0-9.+-]/.test(value)) return fallback;

  const parsed = Number(value);
  const min = options.min ?? DEFAULT_MIN_NUMBER;
  const max = options.max ?? DEFAULT_MAX_NUMBER;

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback;
  return parsed;
}

export function getStringParam(name: string, fallback: string): string {
  if (typeof window === "undefined" || !QUERY_KEY_PATTERN.test(name)) return fallback;
  const value = getSearchOrFragmentParam(name);
  if (value === null || value.length > MAX_QUERY_VALUE_LENGTH) return fallback;
  const trimmed = value.trim();
  if (!trimmed || /[\u0000-\u001f\u007f]/.test(trimmed)) return fallback;
  return trimmed;
}

export function getEnumParam<T extends string>(name: string, allowedValues: readonly T[], fallback: T): T {
  const value = getStringParam(name, fallback);
  return allowedValues.includes(value as T) ? (value as T) : fallback;
}

export function getDateParam(name: string, fallback: string): string {
  const value = getStringParam(name, fallback);
  return isValidDateInput(value) ? value : fallback;
}

export function getBooleanParam(name: string, fallback: boolean): boolean {
  const value = getStringParam(name, String(fallback));
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}
