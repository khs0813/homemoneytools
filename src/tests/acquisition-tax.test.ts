import { describe, expect, it } from "vitest";
import { calculateAcquisitionTax } from "@/lib/calculators/acquisition-tax";

describe("acquisition tax", () => {
  it("calculates ordinary one-house tax and local education tax", () => {
    const result = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "one",
      isRegulatedArea: false,
      floorAreaOver85: false,
      firstHomeDiscountType: "none"
    });

    expect(result.rate).toBe(1);
    expect(result.acquisitionTax).toBe(5_000_000);
    expect(result.localEducationTax).toBe(500_000);
    expect(result.specialRuralTax).toBe(0);
    expect(result.totalTax).toBe(5_500_000);
  });

  it("uses the ordinary rate for a second house outside a regulated area", () => {
    const result = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "two",
      isRegulatedArea: false
    });

    expect(result.rate).toBe(1);
    expect(result.totalTax).toBe(5_500_000);
  });

  it("uses 8% for a regulated second house and a non-regulated third house", () => {
    const regulatedSecond = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "two",
      isRegulatedArea: true
    });
    const nonRegulatedThird = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "three",
      isRegulatedArea: false
    });

    expect(regulatedSecond.rate).toBe(8);
    expect(regulatedSecond.localEducationTax).toBe(2_000_000);
    expect(regulatedSecond.totalTax).toBe(42_000_000);
    expect(nonRegulatedThird.totalTax).toBe(42_000_000);
  });

  it("uses 12% for four or more houses outside a regulated area", () => {
    const result = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "fourOrMore",
      isRegulatedArea: false
    });

    expect(result.rate).toBe(12);
    expect(result.acquisitionTax).toBe(60_000_000);
    expect(result.localEducationTax).toBe(2_000_000);
    expect(result.totalTax).toBe(62_000_000);
  });

  it("keeps ordinary rate boundaries at 600 million and 900 million", () => {
    expect(calculateAcquisitionTax({ price: 600_000_000, houseCount: "one", isRegulatedArea: false }).rate).toBe(1);
    expect(calculateAcquisitionTax({ price: 900_000_000, houseCount: "one", isRegulatedArea: false }).rate).toBe(3);
  });

  it("adds special rural tax for a house over 85 square metres", () => {
    const result = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "one",
      isRegulatedArea: false,
      floorAreaOver85: true
    });

    expect(result.specialRuralTax).toBe(1_000_000);
    expect(result.totalTax).toBe(6_500_000);
  });

  it("reduces local education tax proportionally when first-home tax is reduced", () => {
    const result = calculateAcquisitionTax({
      price: 500_000_000,
      houseCount: "one",
      isRegulatedArea: false,
      firstHomeDiscountType: "standard"
    });

    expect(result.firstHomeDiscount).toBe(2_000_000);
    expect(result.acquisitionTax).toBe(3_000_000);
    expect(result.localEducationTax).toBe(300_000);
    expect(result.totalTax).toBe(3_300_000);
  });
});
