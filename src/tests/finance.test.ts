import { describe, expect, it } from "vitest";
import {
  calculateAirConditionerCost,
  calculateDividendIncome,
  calculateLoanInterest,
  calculateTakeHomePay
} from "@/lib/calculators/finance";

describe("finance calculators", () => {
  it("calculates take-home pay below gross monthly pay", () => {
    const result = calculateTakeHomePay({
      annualSalary: 50_000_000,
      annualBonus: 0,
      monthlyNonTaxable: 200_000,
      dependents: 1,
      childrenUnder20: 0
    });

    expect(result.monthlyNet).toBeGreaterThan(0);
    expect(result.monthlyNet).toBeLessThan(result.grossMonthly);
  });

  it("calculates 100 million won interest-only loan close to expected monthly interest", () => {
    const result = calculateLoanInterest({
      principal: 100_000_000,
      annualRate: 5,
      years: 1,
      repaymentType: "interest-only"
    });

    expect(result.monthlyPayment).toBe(416667);
  });

  it("calculates dividend target principal higher than current investment when target is high", () => {
    const result = calculateDividendIncome({
      investmentAmount: 100_000_000,
      dividendYield: 4,
      taxRate: 15.4,
      frequency: 4,
      targetMonthlyDividend: 1_000_000
    });

    expect(result.neededPrincipalForTarget).toBeGreaterThan(result.grossAnnualDividend);
    expect(result.netMonthlyDividend).toBeGreaterThan(0);
  });

  it("calculates air conditioner usage and cost", () => {
    const result = calculateAirConditionerCost({
      powerWatts: 1200,
      hoursPerDay: 8,
      daysPerMonth: 30,
      pricePerKwh: 180
    });

    expect(result.monthlyUsageKwh).toBe(288);
    expect(result.estimatedCost).toBe(51840);
  });
});
