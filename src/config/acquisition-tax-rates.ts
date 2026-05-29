export type RateBand = {
  min: number;
  max: number | null;
  rate?: number;
  rateType?: "linearOneToThree";
};

export const acquisitionTaxRates = {
  version: "2026-01 참고용",
  residential: {
    oneHouse: [
      { min: 0, max: 600_000_000, rate: 0.01 },
      { min: 600_000_000, max: 900_000_000, rateType: "linearOneToThree" },
      { min: 900_000_000, max: null, rate: 0.03 }
    ] satisfies RateBand[],
    twoHouses: {
      nonRegulated: 0.03,
      regulated: 0.08
    },
    threeOrMore: {
      nonRegulated: 0.08,
      regulated: 0.12
    },
    gift: 0.035,
    inheritance: 0.028
  },
  localEducationTaxRate: 0.001,
  specialRuralTaxRate: 0.002,
  firstHomeDiscountLimit: 2_000_000
};
