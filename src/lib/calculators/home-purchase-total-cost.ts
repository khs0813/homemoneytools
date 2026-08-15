import { calculateAcquisitionTax, type FirstHomeDiscountType, type HouseCount } from "@/lib/calculators/acquisition-tax";
import { calculateBrokerageFee } from "@/lib/calculators/brokerage-fee";
import { calculateDsr } from "@/lib/calculators/dsr";
import { calculateLoan } from "@/lib/calculators/loan";
import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type HomePurchaseTotalCostInput = {
  price: number;
  cashOnHand: number;
  mortgageAmount: number;
  mortgageRate: number;
  mortgageYears: number;
  annualIncome: number;
  existingCreditLoanAmount?: number;
  existingCreditLoanRate?: number;
  otherAnnualRepayment?: number;
  dsrLimit?: number;
  stressRate?: number;
  houseCount: HouseCount;
  isRegulatedArea: boolean;
  isTemporaryTwoHouse?: boolean;
  floorAreaOver85?: boolean;
  firstHomeDiscountType?: FirstHomeDiscountType;
  brokerageRate?: number;
  contractDeposit: number;
  movingCost?: number;
  legalServiceCost?: number;
  otherCost?: number;
  targetEmergencyCash?: number;
};

export function calculateHomePurchaseTotalCost(input: HomePurchaseTotalCostInput) {
  const price = sanitizeNumber(input.price, 0, MAX_SAFE_MONEY_AMOUNT);
  const cashOnHand = sanitizeNumber(input.cashOnHand, 0, MAX_SAFE_MONEY_AMOUNT);
  const mortgageAmount = Math.min(sanitizeNumber(input.mortgageAmount, 0, MAX_SAFE_MONEY_AMOUNT), price);
  const movingCost = sanitizeNumber(input.movingCost ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const legalServiceCost = sanitizeNumber(input.legalServiceCost ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const otherCost = sanitizeNumber(input.otherCost ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const targetEmergencyCash = sanitizeNumber(input.targetEmergencyCash ?? 0, 0, MAX_SAFE_MONEY_AMOUNT);
  const contractDeposit = Math.min(sanitizeNumber(input.contractDeposit, 0, MAX_SAFE_MONEY_AMOUNT), price);

  const acquisitionTax = calculateAcquisitionTax({
    price,
    houseCount: input.houseCount,
    isRegulatedArea: input.isRegulatedArea,
    isTemporaryTwoHouse: input.isTemporaryTwoHouse,
    floorAreaOver85: input.floorAreaOver85,
    firstHomeDiscountType: input.firstHomeDiscountType
  });
  const brokerageFee = calculateBrokerageFee({
    transactionType: "sale",
    transactionAmount: price,
    customRate: input.brokerageRate && input.brokerageRate > 0 ? input.brokerageRate : undefined,
    includeVat: true
  });
  const mortgage = calculateLoan({
    principal: mortgageAmount,
    annualRate: input.mortgageRate,
    years: input.mortgageYears,
    repaymentType: "equal-payment"
  });
  const dsr = calculateDsr({
    annualIncome: input.annualIncome,
    mortgageAmount,
    mortgageRate: input.mortgageRate,
    mortgageYears: input.mortgageYears,
    existingCreditLoanAmount: input.existingCreditLoanAmount,
    existingCreditLoanRate: input.existingCreditLoanRate,
    otherAnnualRepayment: input.otherAnnualRepayment,
    dsrLimit: input.dsrLimit,
    stressRate: input.stressRate,
    creditLoanMode: "amortized"
  });

  const additionalCosts = acquisitionTax.totalTax + brokerageFee.total + movingCost + legalServiceCost + otherCost;
  const totalPurchaseOutflow = price + additionalCosts;
  const cashNeededAfterLoan = Math.max(0, totalPurchaseOutflow - mortgageAmount);
  const balanceCashNeeded = Math.max(0, cashNeededAfterLoan - contractDeposit);
  const remainingCash = cashOnHand + mortgageAmount - totalPurchaseOutflow;
  const emergencyCashShortfall = Math.max(0, targetEmergencyCash - remainingCash);

  return {
    acquisitionTax,
    brokerageFee,
    mortgage,
    dsr,
    price: roundTo(price),
    mortgageAmount: roundTo(mortgageAmount),
    cashOnHand: roundTo(cashOnHand),
    contractDeposit: roundTo(contractDeposit),
    balanceCashNeeded: roundTo(balanceCashNeeded),
    movingCost: roundTo(movingCost),
    legalServiceCost: roundTo(legalServiceCost),
    otherCost: roundTo(otherCost),
    additionalCosts: roundTo(additionalCosts),
    totalPurchaseOutflow: roundTo(totalPurchaseOutflow),
    cashNeededAfterLoan: roundTo(cashNeededAfterLoan),
    remainingCash: roundTo(remainingCash),
    targetEmergencyCash: roundTo(targetEmergencyCash),
    emergencyCashShortfall: roundTo(emergencyCashShortfall),
    isEmergencyCashShort: emergencyCashShortfall > 0
  };
}

