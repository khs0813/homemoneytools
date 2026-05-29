import { describe, expect, it } from "vitest";
import { calculateAcquisitionTax } from "@/lib/calculators/acquisition-tax";

describe("acquisition tax", () => {
  it("calculates one-house purchase tax", () => {
    const result = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "one",
      isRegulatedArea: false,
      acquisitionType: "purchase",
      includeLocalEducationTax: false,
      includeSpecialRuralTax: false
    });

    expect(result.rate).toBe(1);
    expect(result.acquisitionTax).toBe(5_000_000);
    expect(result.totalTax).toBe(5_000_000);
  });
});
