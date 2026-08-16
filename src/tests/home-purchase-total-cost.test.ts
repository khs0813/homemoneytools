import { describe, expect, it } from "vitest";
import { calculateAcquisitionTax } from "@/lib/calculators/acquisition-tax";
import { calculateBrokerageFee } from "@/lib/calculators/brokerage-fee";
import { calculateDsr } from "@/lib/calculators/dsr";
import { calculateLoan } from "@/lib/calculators/loan";
import { calculateHomePurchaseTotalCost } from "@/lib/calculators/home-purchase-total-cost";

describe("home purchase total cost calculator", () => {
  it("orchestrates existing acquisition tax, brokerage, loan, and DSR services", () => {
    const input = {
      price: 500_000_000,
      cashOnHand: 160_000_000,
      mortgageAmount: 300_000_000,
      mortgageRate: 4.5,
      mortgageYears: 30,
      annualIncome: 70_000_000,
      existingCreditLoanAmount: 20_000_000,
      existingCreditLoanRate: 5,
      otherAnnualRepayment: 0,
      dsrLimit: 40,
      stressRate: 1.5,
      houseCount: "one" as const,
      isRegulatedArea: false,
      isTemporaryTwoHouse: false,
      floorAreaOver85: false,
      firstHomeDiscountType: "none" as const,
      brokerageRate: 0,
      contractDeposit: 50_000_000,
      movingCost: 3_000_000,
      legalServiceCost: 2_000_000,
      otherCost: 1_000_000,
      targetEmergencyCash: 20_000_000
    };
    const result = calculateHomePurchaseTotalCost(input);
    const tax = calculateAcquisitionTax(input);
    const brokerage = calculateBrokerageFee({ transactionType: "sale", transactionAmount: input.price, includeVat: true });
    const loan = calculateLoan({ principal: input.mortgageAmount, annualRate: input.mortgageRate, years: input.mortgageYears, repaymentType: "equal-payment" });
    const dsr = calculateDsr({ ...input, mortgageAmount: input.mortgageAmount, mortgageRate: input.mortgageRate, mortgageYears: input.mortgageYears, creditLoanMode: "amortized" });

    expect(result.acquisitionTax.totalTax).toBe(tax.totalTax);
    expect(result.brokerageFee.total).toBe(brokerage.total);
    expect(result.mortgage.monthlyPayment).toBe(loan.monthlyPayment);
    expect(result.dsr.assessmentDsr).toBe(dsr.assessmentDsr);
    expect(result.additionalCosts).toBe(tax.totalTax + brokerage.total + input.movingCost + input.legalServiceCost + input.otherCost);
    expect(result.cashNeededAfterLoan).toBe(result.totalPurchaseOutflow - input.mortgageAmount);
    expect(result.balanceCashNeeded).toBe(result.cashNeededAfterLoan - input.contractDeposit);
  });
});

