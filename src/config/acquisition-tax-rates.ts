export type RateBand = {
  min: number;
  max: number | null;
  rate?: number;
  rateType?: "linearOneToThree";
};

export const acquisitionTaxRates = {
  version: "2026-07-01 참고용",
  residential: {
    ordinary: [
      { min: 0, max: 600_000_000, rate: 0.01 },
      { min: 600_000_000, max: 900_000_000, rateType: "linearOneToThree" },
      { min: 900_000_000, max: null, rate: 0.03 }
    ] satisfies RateBand[],
    heavy: {
      eightPercent: 0.08,
      twelvePercent: 0.12
    }
  },
  localEducationTax: {
    ordinaryRateFactor: 0.1,
    heavyRate: 0.004
  },
  specialRuralTax: {
    ordinaryRate: 0.002,
    eightPercentAcquisitionRate: 0.006,
    twelvePercentAcquisitionRate: 0.01
  },
  firstHome: {
    priceLimit: 1_200_000_000,
    standardDiscountLimit: 2_000_000,
    expandedDiscountLimit: 3_000_000,
    expiresOn: "2028-12-31"
  }
};
