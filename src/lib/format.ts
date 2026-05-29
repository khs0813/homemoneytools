export const MAX_SAFE_MONEY_AMOUNT = 1_000_000_000_000_000;

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}


export function sanitizeNumber(value: number, min = 0, max = MAX_SAFE_MONEY_AMOUNT): number {
  return clamp(value, min, max);
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
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function formatKoreanMoney(value: number): string {
  if (!Number.isFinite(value)) return "0원";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 100_000_000) {
    const eok = Math.floor(abs / 100_000_000);
    const man = Math.round((abs % 100_000_000) / 10_000);
    if (man === 0) return `${sign}${eok.toLocaleString("ko-KR")}억 원`;
    return `${sign}${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만 원`;
  }
  if (abs >= 10_000) {
    return `${sign}${Math.round(abs / 10_000).toLocaleString("ko-KR")}만 원`;
  }
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
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
