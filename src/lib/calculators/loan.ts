import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type RepaymentType = "interest-only" | "equal-payment" | "equal-principal";

export type LoanCalculationInput = {
  principal: number;
  annualRate: number;
  years: number;
  repaymentType: RepaymentType;
};

export type LoanCalculationResult = {
  monthlyPayment: number;
  firstMonthlyPayment: number;
  lastMonthlyPayment: number;
  monthlyInterestOnly: number;
  totalInterest: number;
  totalPayment: number;
  months: number;
};

const MAX_ANNUAL_RATE = 100;
const MAX_LOAN_MONTHS = 1_200;

function normalizePrincipal(value: number): number {
  return sanitizeNumber(value, 0, MAX_SAFE_MONEY_AMOUNT);
}

function normalizeAnnualRate(value: number): number {
  return sanitizeNumber(value, 0, MAX_ANNUAL_RATE);
}

function normalizeMonths(value: number): number {
  return Math.round(sanitizeNumber(value, 0, MAX_LOAN_MONTHS));
}

export function monthlyRate(annualRate: number): number {
  return normalizeAnnualRate(annualRate) / 100 / 12;
}

export function calculateEqualPayment(principal: number, annualRate: number, months: number): number {
  const safePrincipal = normalizePrincipal(principal);
  const safeMonths = normalizeMonths(months);
  if (safePrincipal <= 0 || safeMonths <= 0) return 0;
  const rate = monthlyRate(annualRate);
  if (rate === 0) return safePrincipal / safeMonths;
  return safePrincipal * rate * (1 + rate) ** safeMonths / ((1 + rate) ** safeMonths - 1);
}

export function calculateInterestOnly(principal: number, annualRate: number, months: number) {
  const safePrincipal = normalizePrincipal(principal);
  const safeMonths = normalizeMonths(months);
  const monthlyInterest = safePrincipal * monthlyRate(annualRate);
  return {
    monthlyInterest,
    totalInterest: monthlyInterest * safeMonths,
    totalPayment: safePrincipal + monthlyInterest * safeMonths
  };
}

export function calculateEqualPrincipal(principal: number, annualRate: number, months: number) {
  const safePrincipal = normalizePrincipal(principal);
  const safeMonths = normalizeMonths(months);
  if (safePrincipal <= 0 || safeMonths <= 0) {
    return { firstPayment: 0, lastPayment: 0, totalInterest: 0, totalPayment: 0 };
  }
  const rate = monthlyRate(annualRate);
  const principalPerMonth = safePrincipal / safeMonths;
  let totalInterest = 0;
  let remaining = safePrincipal;
  let firstPayment = 0;
  let lastPayment = 0;

  for (let month = 1; month <= safeMonths; month += 1) {
    const interest = remaining * rate;
    const payment = principalPerMonth + interest;
    if (month === 1) firstPayment = payment;
    if (month === safeMonths) lastPayment = payment;
    totalInterest += interest;
    remaining -= principalPerMonth;
  }

  return {
    firstPayment,
    lastPayment,
    totalInterest,
    totalPayment: safePrincipal + totalInterest
  };
}

export function calculateLoan(input: LoanCalculationInput): LoanCalculationResult {
  const principal = normalizePrincipal(input.principal);
  const annualRate = normalizeAnnualRate(input.annualRate);
  const months = normalizeMonths(input.years * 12);
  const interestOnly = calculateInterestOnly(principal, annualRate, months);

  if (input.repaymentType === "interest-only") {
    return {
      monthlyPayment: roundTo(interestOnly.monthlyInterest),
      firstMonthlyPayment: roundTo(interestOnly.monthlyInterest),
      lastMonthlyPayment: roundTo(interestOnly.monthlyInterest),
      monthlyInterestOnly: roundTo(interestOnly.monthlyInterest),
      totalInterest: roundTo(interestOnly.totalInterest),
      totalPayment: roundTo(interestOnly.totalPayment),
      months
    };
  }

  if (input.repaymentType === "equal-payment") {
    const monthlyPayment = calculateEqualPayment(principal, annualRate, months);
    const totalPayment = monthlyPayment * months;
    return {
      monthlyPayment: roundTo(monthlyPayment),
      firstMonthlyPayment: roundTo(monthlyPayment),
      lastMonthlyPayment: roundTo(monthlyPayment),
      monthlyInterestOnly: roundTo(interestOnly.monthlyInterest),
      totalInterest: roundTo(totalPayment - principal),
      totalPayment: roundTo(totalPayment),
      months
    };
  }

  const equalPrincipal = calculateEqualPrincipal(principal, annualRate, months);
  return {
    monthlyPayment: roundTo(equalPrincipal.firstPayment),
    firstMonthlyPayment: roundTo(equalPrincipal.firstPayment),
    lastMonthlyPayment: roundTo(equalPrincipal.lastPayment),
    monthlyInterestOnly: roundTo(interestOnly.monthlyInterest),
    totalInterest: roundTo(equalPrincipal.totalInterest),
    totalPayment: roundTo(equalPrincipal.totalPayment),
    months
  };
}

export function calculateJeonseLoan(input: LoanCalculationInput & { jeonseDeposit: number; guaranteeFeeRate?: number; prepaymentFeeRate?: number }) {
  const principal = normalizePrincipal(input.principal);
  const jeonseDeposit = normalizePrincipal(input.jeonseDeposit);
  const guaranteeFeeRate = normalizeAnnualRate(input.guaranteeFeeRate ?? 0);
  const prepaymentFeeRate = normalizeAnnualRate(input.prepaymentFeeRate ?? 0);
  const loan = calculateLoan({ ...input, principal });
  const loanYears = loan.months / 12;
  const guaranteeFee = guaranteeFeeRate ? principal * guaranteeFeeRate / 100 * loanYears : 0;
  const prepaymentFee = prepaymentFeeRate ? principal * prepaymentFeeRate / 100 : 0;
  const loanToDepositRatio = jeonseDeposit > 0 ? principal / jeonseDeposit * 100 : 0;
  const estimatedFeesTotal = guaranteeFee + prepaymentFee;

  return {
    ...loan,
    guaranteeFee: roundTo(guaranteeFee),
    prepaymentFee: roundTo(prepaymentFee),
    estimatedFeesTotal: roundTo(estimatedFeesTotal),
    estimatedBorrowingCost: roundTo(loan.totalInterest + estimatedFeesTotal),
    loanToDepositRatio: roundTo(loanToDepositRatio, 2),
    isPrincipalWithinDeposit: principal <= jeonseDeposit
  };
}
