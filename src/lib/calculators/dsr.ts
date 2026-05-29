import { calculateEqualPayment } from "@/lib/calculators/loan";
import { dsrRules } from "@/config/dsr-rules";
import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type DsrInput = {
  annualIncome: number;
  mortgageAmount: number;
  mortgageRate: number;
  mortgageYears: number;
  existingCreditLoanAmount?: number;
  existingCreditLoanRate?: number;
  otherAnnualRepayment?: number;
  dsrLimit?: number;
  stressRate?: number;
  creditLoanMode?: "interest-only" | "amortized";
};

const MAX_RATE = 100;
const MAX_YEARS = 100;
const MAX_DSR_LIMIT = 100;

export function calculateAnnualMortgagePayment(amount: number, rate: number, years: number): number {
  return calculateEqualPayment(
    sanitizeNumber(amount, 0, MAX_SAFE_MONEY_AMOUNT),
    sanitizeNumber(rate, 0, MAX_RATE),
    sanitizeNumber(years, 0, MAX_YEARS) * 12
  ) * 12;
}

export function calculateCreditLoanAnnualRepayment(amount: number, rate: number, mode: "interest-only" | "amortized" = "interest-only") {
  const safeAmount = sanitizeNumber(amount, 0, MAX_SAFE_MONEY_AMOUNT);
  const safeRate = sanitizeNumber(rate, 0, MAX_RATE);
  if (!safeAmount) return 0;
  if (mode === "amortized") {
    return calculateEqualPayment(safeAmount, safeRate, dsrRules.defaultCreditLoanAssumptionYears * 12) * 12;
  }
  return safeAmount * safeRate / 100;
}

export function calculateDsr(input: DsrInput) {
  const annualIncome = sanitizeNumber(input.annualIncome, 0, MAX_SAFE_MONEY_AMOUNT);
  const dsrLimit = sanitizeNumber(input.dsrLimit ?? dsrRules.defaultLimit, 1, MAX_DSR_LIMIT);
  const mortgageRate = sanitizeNumber(input.mortgageRate, 0, MAX_RATE);
  const stressRate = sanitizeNumber(input.stressRate ?? 0, 0, MAX_RATE);
  const annualMortgagePayment = calculateAnnualMortgagePayment(input.mortgageAmount, mortgageRate, input.mortgageYears);
  const annualCreditPayment = calculateCreditLoanAnnualRepayment(
    input.existingCreditLoanAmount ?? 0,
    input.existingCreditLoanRate ?? 0,
    input.creditLoanMode ?? "interest-only"
  );
  const otherAnnualRepayment = sanitizeNumber(input.otherAnnualRepayment ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const totalAnnualRepayment = annualMortgagePayment + annualCreditPayment + otherAnnualRepayment;
  const dsr = annualIncome > 0 ? totalAnnualRepayment / annualIncome * 100 : 0;
  const limitAmount = annualIncome * dsrLimit / 100;
  const remainingAnnualRepaymentCapacity = limitAmount - totalAnnualRepayment;

  const stressedAnnualMortgagePayment = calculateAnnualMortgagePayment(input.mortgageAmount, mortgageRate + stressRate, input.mortgageYears);
  const stressedTotalAnnualRepayment = stressedAnnualMortgagePayment + annualCreditPayment + otherAnnualRepayment;
  const stressedDsr = annualIncome > 0 ? stressedTotalAnnualRepayment / annualIncome * 100 : 0;

  const status = dsr <= dsrLimit * dsrRules.warningRatio ? "safe" : dsr <= dsrLimit ? "warning" : "over";

  return {
    annualMortgagePayment: roundTo(annualMortgagePayment),
    annualCreditPayment: roundTo(annualCreditPayment),
    otherAnnualRepayment: roundTo(otherAnnualRepayment),
    totalAnnualRepayment: roundTo(totalAnnualRepayment),
    monthlyAverageRepayment: roundTo(totalAnnualRepayment / 12),
    dsr: roundTo(dsr, 2),
    dsrLimit,
    remainingAnnualRepaymentCapacity: roundTo(remainingAnnualRepaymentCapacity),
    stressedDsr: roundTo(stressedDsr, 2),
    stressedTotalAnnualRepayment: roundTo(stressedTotalAnnualRepayment),
    status
  };
}
