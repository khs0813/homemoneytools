import { brokerageRates, type BrokerageBand } from "@/config/brokerage-rates";
import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type BrokerageTransactionType = "sale" | "jeonse" | "monthlyRent";

export type BrokerageFeeInput = {
  transactionType: BrokerageTransactionType;
  transactionAmount?: number;
  deposit?: number;
  monthlyRent?: number;
  customRate?: number;
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
  const customRate = input.customRate !== undefined ? sanitizeNumber(input.customRate, 0, MAX_CUSTOM_RATE) : undefined;
  const appliedRate = customRate !== undefined ? customRate / 100 : band.rate;
  const rawFee = transactionAmount * appliedRate;
  const brokerageFee = band.limit ? Math.min(rawFee, band.limit) : rawFee;
  const vat = brokerageFee * brokerageRates.vatRate;
  const total = brokerageFee + vat;

  return {
    version: brokerageRates.version,
    transactionAmount: roundTo(transactionAmount),
    appliedRate: roundTo(appliedRate * 100, 4),
    legalRate: roundTo(band.rate * 100, 4),
    limit: band.limit,
    brokerageFee: roundTo(brokerageFee),
    vat: roundTo(vat),
    total: roundTo(total)
  };
}
