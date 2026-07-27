import { brokerageRates, type BrokerageBand } from "@/config/brokerage-rates";
import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type BrokerageTransactionType = "sale" | "jeonse" | "monthlyRent";

export type BrokerageFeeInput = {
  transactionType: BrokerageTransactionType;
  transactionAmount?: number;
  deposit?: number;
  monthlyRent?: number;
  customRate?: number;
  includeVat?: boolean;
};

const MAX_CUSTOM_RATE = 100;

export function calculateMonthlyRentTransactionAmount(deposit: number, monthlyRent: number) {
  const safeDeposit = sanitizeNumber(deposit, 0, MAX_SAFE_MONEY_AMOUNT);
  const safeMonthlyRent = sanitizeNumber(monthlyRent, 0, MAX_SAFE_MONEY_AMOUNT);
  const defaultAmount = safeDeposit + safeMonthlyRent * brokerageRates.monthlyRentConversion.defaultMultiplier;
  if (defaultAmount >= brokerageRates.monthlyRentConversion.lowAmountThreshold) {
    return Math.min(defaultAmount, MAX_SAFE_MONEY_AMOUNT);
  }
  return Math.min(safeDeposit + safeMonthlyRent * brokerageRates.monthlyRentConversion.lowAmountMultiplier, MAX_SAFE_MONEY_AMOUNT);
}

function findBand(amount: number, bands: BrokerageBand[]): BrokerageBand {
  const band = bands.find((item) => amount >= item.min && (item.max === null || amount < item.max));
  if (!band) return bands[bands.length - 1];
  return band;
}

export function calculateBrokerageFee(input: BrokerageFeeInput) {
  const transactionAmount = input.transactionType === "monthlyRent"
    ? calculateMonthlyRentTransactionAmount(input.deposit ?? 0, input.monthlyRent ?? 0)
    : sanitizeNumber(input.transactionAmount ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);

  const bands = input.transactionType === "sale" ? brokerageRates.residential.sale : brokerageRates.residential.rent;
  const band = findBand(transactionAmount, bands);
  const legalRatePercent = band.rate * 100;
  const requestedRatePercent = input.customRate !== undefined
    ? sanitizeNumber(input.customRate, 0, MAX_CUSTOM_RATE)
    : legalRatePercent;
  const appliedRatePercent = Math.min(requestedRatePercent, legalRatePercent);
  const appliedRate = appliedRatePercent / 100;
  const rawFee = transactionAmount * appliedRate;
  const brokerageFee = band.limit ? Math.min(rawFee, band.limit) : rawFee;
  const includeVat = input.includeVat ?? true;
  const vat = includeVat ? brokerageFee * brokerageRates.vatRate : 0;
  const total = brokerageFee + vat;

  return {
    version: brokerageRates.version,
    transactionAmount: roundTo(transactionAmount),
    requestedRate: roundTo(requestedRatePercent, 4),
    appliedRate: roundTo(appliedRatePercent, 4),
    legalRate: roundTo(legalRatePercent, 4),
    wasRateCapped: requestedRatePercent > legalRatePercent,
    limit: band.limit,
    brokerageFee: roundTo(brokerageFee),
    includeVat,
    vat: roundTo(vat),
    total: roundTo(total)
  };
}
