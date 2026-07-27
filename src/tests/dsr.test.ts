import { describe, expect, it } from "vitest";
import { calculateDsr } from "@/lib/calculators/dsr";

describe("DSR calculator", () => {
  it("uses five-year deemed maturity for credit loans and stress DSR for assessment", () => {
    const result = calculateDsr({
      annualIncome: 70_000_000,
      mortgageAmount: 300_000_000,
      mortgageRate: 4.5,
      mortgageYears: 30,
      existingCreditLoanAmount: 20_000_000,
      existingCreditLoanRate: 5,
      otherAnnualRepayment: 0,
      dsrLimit: 40,
      stressRate: 3
    });

    expect(result.annualCreditPayment).toBe(5_000_000);
    expect(result.dsr).toBe(33.2);
    expect(result.stressedDsr).toBe(43.1);
    expect(result.assessmentDsr).toBe(43.1);
    expect(result.status).toBe("over");
  });

  it("uses the ordinary DSR for assessment when stress rate is zero", () => {
    const result = calculateDsr({
      annualIncome: 70_000_000,
      mortgageAmount: 300_000_000,
      mortgageRate: 4.5,
      mortgageYears: 30,
      existingCreditLoanAmount: 20_000_000,
      existingCreditLoanRate: 5,
      dsrLimit: 40,
      stressRate: 0
    });

    expect(result.useStressAssessment).toBe(false);
    expect(result.assessmentDsr).toBe(result.dsr);
  });

  it("keeps interest-only credit loan mode as a cash-flow reference", () => {
    const result = calculateDsr({
      annualIncome: 70_000_000,
      mortgageAmount: 300_000_000,
      mortgageRate: 4.5,
      mortgageYears: 30,
      existingCreditLoanAmount: 20_000_000,
      existingCreditLoanRate: 5,
      stressRate: 0,
      creditLoanMode: "interest-only"
    });

    expect(result.creditLoanMode).toBe("interest-only");
    expect(result.annualCreditPayment).toBe(1_000_000);
  });
});
