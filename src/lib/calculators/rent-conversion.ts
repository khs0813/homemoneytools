import { rentConversionRules } from "@/config/rent-conversion-rules";
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
  const conversionRate = sanitizeNumber(input.conversionRate, 0.01, MAX_RATE);
  const rate = conversionRate / 100;
  const deposit = sanitizeNumber(input.deposit ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const years = sanitizeNumber(input.years ?? 2, 0.1, MAX_YEARS);
  const legalMaximumRate = rentConversionRules.legalMaximumRate;
  const common = {
    version: rentConversionRules.version,
    conversionRate: roundTo(conversionRate, 2),
    legalMaximumRate: roundTo(legalMaximumRate, 2),
    exceedsLegalMaximum: input.type === "jeonse-to-rent" && conversionRate > legalMaximumRate,
    years
  };

  if (input.type === "jeonse-to-rent") {
    const jeonseAmount = sanitizeNumber(input.jeonseAmount ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
    const isDepositWithinJeonse = deposit <= jeonseAmount;
    const convertibleAmount = Math.max(jeonseAmount - deposit, 0);
    const monthlyRent = convertibleAmount * rate / 12;
    return {
      ...common,
      type: input.type,
      monthlyRent: roundTo(monthlyRent),
      jeonseEquivalent: jeonseAmount,
      totalRentForPeriod: roundTo(monthlyRent * 12 * years),
      isDepositWithinJeonse
    };
  }

  const monthlyRent = sanitizeNumber(input.monthlyRent ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const jeonseEquivalent = deposit + (monthlyRent * 12 / rate);
  return {
    ...common,
    type: input.type,
    monthlyRent,
    jeonseEquivalent: roundTo(Math.min(jeonseEquivalent, MAX_SAFE_MONEY_AMOUNT)),
    totalRentForPeriod: roundTo(monthlyRent * 12 * years),
    isDepositWithinJeonse: true
  };
}
