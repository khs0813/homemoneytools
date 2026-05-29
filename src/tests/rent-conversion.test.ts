import { describe, expect, it } from "vitest";
import { calculateRentConversion } from "@/lib/calculators/rent-conversion";

describe("rent conversion", () => {
  it("converts jeonse to monthly rent", () => {
    const result = calculateRentConversion({
      type: "jeonse-to-rent",
      jeonseAmount: 500_000_000,
      deposit: 100_000_000,
      conversionRate: 5,
      years: 2
    });

    expect(result.monthlyRent).toBe(1_666_667);
    expect(result.totalRentForPeriod).toBe(40_000_000);
  });

  it("converts monthly rent to jeonse", () => {
    const result = calculateRentConversion({
      type: "rent-to-jeonse",
      deposit: 100_000_000,
      monthlyRent: 1_500_000,
      conversionRate: 5,
      years: 2
    });

    expect(result.jeonseEquivalent).toBe(460_000_000);
  });
});
