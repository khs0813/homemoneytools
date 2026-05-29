import { describe, expect, it } from "vitest";
import { calculateJeonseLoan, calculateLoan } from "@/lib/calculators/loan";

describe("loan calculators", () => {
  it("calculates interest-only jeonse loan", () => {
    const result = calculateJeonseLoan({
      jeonseDeposit: 300_000_000,
      principal: 100_000_000,
      annualRate: 4.8,
      years: 1,
      repaymentType: "interest-only"
    });

    expect(result.monthlyPayment).toBe(400_000);
    expect(result.totalInterest).toBe(4_800_000);
    expect(result.loanToDepositRatio).toBeCloseTo(33.33, 2);
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
