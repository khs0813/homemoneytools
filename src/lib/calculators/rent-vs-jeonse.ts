import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type RentVsJeonseInput = {
  jeonseDeposit: number;
  rentDeposit: number;
  monthlyRent: number;
  years: number;
  savingRate: number;
  jeonseLoanRate: number;
  jeonseLoanAmount: number;
  rentGrowthRate?: number;
  depositGrowthRate?: number;
};

const MAX_RATE = 100;
const MAX_YEARS = 100;

export function calculateGrowingMonthlyRent(monthlyRent: number, years: number, annualGrowthRate = 0): number {
  let total = 0;
  let currentMonthlyRent = sanitizeNumber(monthlyRent, 0, MAX_SAFE_MONEY_AMOUNT);
  const safeYears = sanitizeNumber(years, 0, MAX_YEARS);
  const growthRate = sanitizeNumber(annualGrowthRate, 0, MAX_RATE);
  for (let year = 1; year <= Math.ceil(safeYears); year += 1) {
    const portion = Math.min(1, safeYears - (year - 1));
    if (portion <= 0) break;
    total += currentMonthlyRent * 12 * portion;
    currentMonthlyRent = Math.min(currentMonthlyRent * (1 + growthRate / 100), MAX_SAFE_MONEY_AMOUNT);
  }
  return total;
}

export function calculateRentVsJeonse(input: RentVsJeonseInput) {
  const years = sanitizeNumber(input.years, 0, MAX_YEARS);
  const jeonseDeposit = sanitizeNumber(input.jeonseDeposit, 0, MAX_SAFE_MONEY_AMOUNT);
  const rentDeposit = sanitizeNumber(input.rentDeposit, 0, MAX_SAFE_MONEY_AMOUNT);
  const monthlyRent = sanitizeNumber(input.monthlyRent, 0, MAX_SAFE_MONEY_AMOUNT);
  const savingRate = sanitizeNumber(input.savingRate, 0, MAX_RATE);
  const jeonseLoanRate = sanitizeNumber(input.jeonseLoanRate, 0, MAX_RATE);
  const jeonseLoanAmount = sanitizeNumber(input.jeonseLoanAmount, 0, MAX_SAFE_MONEY_AMOUNT);

  const monthlyRentTotal = calculateGrowingMonthlyRent(monthlyRent, years, input.rentGrowthRate ?? 0);
  const rentDepositOpportunityCost = rentDeposit * savingRate / 100 * years;
  const rentTotalCost = monthlyRentTotal + rentDepositOpportunityCost;

  const ownJeonseCapital = Math.max(jeonseDeposit - jeonseLoanAmount, 0);
  const jeonseOpportunityCost = ownJeonseCapital * savingRate / 100 * years;
  const jeonseLoanInterest = jeonseLoanAmount * jeonseLoanRate / 100 * years;
  const jeonseTotalCost = jeonseOpportunityCost + jeonseLoanInterest;

  const difference = rentTotalCost - jeonseTotalCost;
  const winner = difference > 0 ? "jeonse" : difference < 0 ? "rent" : "same";

  return {
    rentTotalCost: roundTo(rentTotalCost),
    monthlyRentTotal: roundTo(monthlyRentTotal),
    rentDepositOpportunityCost: roundTo(rentDepositOpportunityCost),
    jeonseTotalCost: roundTo(jeonseTotalCost),
    jeonseOpportunityCost: roundTo(jeonseOpportunityCost),
    jeonseLoanInterest: roundTo(jeonseLoanInterest),
    difference: roundTo(Math.abs(difference)),
    signedDifference: roundTo(difference),
    monthlyDifference: years > 0 ? roundTo(Math.abs(difference) / (years * 12)) : 0,
    winner
  };
}
