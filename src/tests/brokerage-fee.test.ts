import { describe, expect, it } from "vitest";
import { calculateBrokerageFee, calculateMonthlyRentTransactionAmount } from "@/lib/calculators/brokerage-fee";

describe("brokerage fee", () => {
  it("calculates sale brokerage fee", () => {
    const result = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 500_000_000
    });

    expect(result.brokerageFee).toBe(2_000_000);
    expect(result.vat).toBe(200_000);
    expect(result.total).toBe(2_200_000);
  });

  it("uses lower multiplier when monthly rent converted amount is below threshold", () => {
    expect(calculateMonthlyRentTransactionAmount(10_000_000, 300_000)).toBe(31_000_000);
  });
});
