import { describe, expect, it } from "vitest";
import { calculateBrokerageFee, calculateMonthlyRentTransactionAmount } from "@/lib/calculators/brokerage-fee";

describe("brokerage fee", () => {
  it("caps custom sale brokerage rate at the legal rate and includes VAT", () => {
    const result = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 500_000_000,
      customRate: 1,
      includeVat: true
    });

    expect(result.requestedRate).toBe(1);
    expect(result.legalRate).toBe(0.4);
    expect(result.appliedRate).toBe(0.4);
    expect(result.wasRateCapped).toBe(true);
    expect(result.brokerageFee).toBe(2_000_000);
    expect(result.vat).toBe(200_000);
    expect(result.total).toBe(2_200_000);
  });

  it("can exclude VAT from the total", () => {
    const result = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 500_000_000,
      includeVat: false
    });

    expect(result.vat).toBe(0);
    expect(result.total).toBe(result.brokerageFee);
  });

  it("keeps sale brokerage legal rate boundaries", () => {
    expect(calculateBrokerageFee({ transactionType: "sale", transactionAmount: 49_999_999 }).legalRate).toBe(0.6);
    expect(calculateBrokerageFee({ transactionType: "sale", transactionAmount: 50_000_000 }).legalRate).toBe(0.5);
    expect(calculateBrokerageFee({ transactionType: "sale", transactionAmount: 900_000_000 }).legalRate).toBe(0.5);
  });

  it("uses lower multiplier when monthly rent converted amount is below threshold", () => {
    expect(calculateMonthlyRentTransactionAmount(10_000_000, 300_000)).toBe(31_000_000);
  });
});
