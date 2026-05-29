import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type RentConversionType = "jeonse-to-rent" | "rent-to-jeonse";

export type RentConversionInput = {
  type: RentConversionType;
  jeonseAmount?: number;
  deposit?: number;
  monthlyRent?: number;
  conversionRate: number;
  years?: number;
};

const MAX_RATE = 100;
const MAX_YEARS = 100;

export function calculateRentConversion(input: RentConversionInput) {
  const rate = sanitizeNumber(input.conversionRate, 0.01, MAX_RATE) / 100;
  const deposit = sanitizeNumber(input.deposit ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const years = sanitizeNumber(input.years ?? 2, 0.1, MAX_YEARS);

  if (input.type === "jeonse-to-rent") {
    const jeonseAmount = sanitizeNumber(input.jeonseAmount ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
    const monthlyRent = Math.max((jeonseAmount - deposit) * rate / 12, 0);
    return {
      type: input.type,
      monthlyRent: roundTo(monthlyRent),
      jeonseEquivalent: jeonseAmount,
      totalRentForPeriod: roundTo(monthlyRent * 12 * years),
      years
    };
  }

  const monthlyRent = sanitizeNumber(input.monthlyRent ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const jeonseEquivalent = deposit + (monthlyRent * 12 / rate);
  return {
    type: input.type,
    monthlyRent,
    jeonseEquivalent: roundTo(Math.min(jeonseEquivalent, MAX_SAFE_MONEY_AMOUNT)),
    totalRentForPeriod: roundTo(monthlyRent * 12 * years),
    years
  };
}
