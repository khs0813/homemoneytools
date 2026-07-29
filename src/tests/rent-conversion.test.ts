import { describe, expect, it } from "vitest";
import { calculateRentConversion } from "@/lib/calculators/rent-conversion";

describe("rent conversion", () => {
  it("converts jeonse to monthly rent", () => {
    const result = calculateRentConversion({
      type: "jeonse-to-rent",
      jeonseAmount: 500_000_000,
      deposit: 100_000_000,
      conversionRate: 4.75,
      years: 2
    });

    expect(result.monthlyRent).toBe(1_583_333);
    expect(result.totalRentForPeriod).toBe(38_000_000);
    expect(result.legalMaximumRate).toBe(4.75);
    expect(result.exceedsLegalMaximum).toBe(false);
  });

  it("warns only jeonse-to-rent conversions above the current legal reference", () => {
    const result = calculateRentConversion({
      type: "jeonse-to-rent",
      jeonseAmount: 500_000_000,
      deposit: 100_000_000,
      conversionRate: 4.76,
      years: 2
    });

    expect(result.exceedsLegalMaximum).toBe(true);
  });

  it("converts monthly rent to jeonse", () => {
    const result = calculateRentConversion({
      type: "rent-to-jeonse",
      deposit: 100_000_000,
      monthlyRent: 1_500_000,
      conversionRate: 4.75,
      years: 2
    });

    expect(result.jeonseEquivalent).toBe(478_947_368);
    expect(result.exceedsLegalMaximum).toBe(false);
  });

  it("keeps the monthly rent 500k to jeonse equivalent regression", () => {
    const result = calculateRentConversion({
      type: "rent-to-jeonse",
      deposit: 0,
      monthlyRent: 500_000,
      conversionRate: 5,
      years: 2
    });

    expect(result.jeonseEquivalent).toBe(120_000_000);
  });

  it("marks an excessive replacement deposit as invalid for jeonse-to-rent", () => {
    const result = calculateRentConversion({
      type: "jeonse-to-rent",
      jeonseAmount: 100_000_000,
      deposit: 120_000_000,
      conversionRate: 4.75,
      years: 2
    });

    expect(result.monthlyRent).toBe(0);
    expect(result.isDepositWithinJeonse).toBe(false);
  });
});
