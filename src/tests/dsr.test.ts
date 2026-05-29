import { describe, expect, it } from "vitest";
import { calculateDsr } from "@/lib/calculators/dsr";

describe("DSR calculator", () => {
  it("calculates DSR", () => {
    const result = calculateDsr({
      annualIncome: 70_000_000,
      mortgageAmount: 300_000_000,
      mortgageRate: 4.5,
      mortgageYears: 30,
      existingCreditLoanAmount: 20_000_000,
      existingCreditLoanRate: 5,
      otherAnnualRepayment: 0,
      dsrLimit: 40,
      stressRate: 1.5
    });

    expect(result.dsr).toBeGreaterThan(0);
    expect(result.totalAnnualRepayment).toBeGreaterThan(result.annualCreditPayment);
    expect(["safe", "warning", "over"]).toContain(result.status);
  });
});
