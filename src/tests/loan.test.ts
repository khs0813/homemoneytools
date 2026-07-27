import { describe, expect, it } from "vitest";
import { calculateJeonseLoan, calculateLoan } from "@/lib/calculators/loan";

describe("loan calculators", () => {
  it("calculates interest-only jeonse loan and period-based guarantee fee", () => {
    const result = calculateJeonseLoan({
      jeonseDeposit: 300_000_000,
      principal: 100_000_000,
      annualRate: 4.8,
      years: 2,
      repaymentType: "interest-only",
      guaranteeFeeRate: 0.2,
      prepaymentFeeRate: 1
    });

    expect(result.monthlyPayment).toBe(400_000);
    expect(result.totalInterest).toBe(9_600_000);
    expect(result.guaranteeFee).toBe(400_000);
    expect(result.prepaymentFee).toBe(1_000_000);
    expect(result.estimatedBorrowingCost).toBe(11_000_000);
    expect(result.loanToDepositRatio).toBeCloseTo(33.33, 2);
    expect(result.isPrincipalWithinDeposit).toBe(true);
  });

  it("detects a loan amount greater than the jeonse deposit", () => {
    const result = calculateJeonseLoan({
      jeonseDeposit: 100_000_000,
      principal: 120_000_000,
      annualRate: 4,
      years: 1,
      repaymentType: "interest-only"
    });

    expect(result.isPrincipalWithinDeposit).toBe(false);
  });

  it("handles a zero interest rate in equal-payment loans", () => {
    const result = calculateLoan({
      principal: 100_000_000,
      annualRate: 0,
      years: 10,
      repaymentType: "equal-payment"
    });

    expect(result.monthlyPayment).toBe(833_333);
    expect(result.totalInterest).toBe(0);
  });

  it("calculates equal-payment loan", () => {
    const result = calculateLoan({
      principal: 100_000_000,
      annualRate: 4.8,
      years: 10,
      repaymentType: "equal-payment"
    });

    expect(result.monthlyPayment).toBeGreaterThan(1_000_000);
    expect(result.totalInterest).toBeGreaterThan(20_000_000);
  });

  it("calculates equal-principal loan", () => {
    const result = calculateLoan({
      principal: 120_000_000,
      annualRate: 6,
      years: 10,
      repaymentType: "equal-principal"
    });

    expect(result.firstMonthlyPayment).toBeGreaterThan(result.lastMonthlyPayment);
    expect(result.totalPayment).toBeGreaterThan(120_000_000);
  });
});
