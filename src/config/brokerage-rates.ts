export type BrokerageBand = {
  min: number;
  max: number | null;
  rate: number;
  limit: number | null;
};

export const brokerageRates = {
  version: "2026-01 참고용",
  vatRate: 0.1,
  monthlyRentConversion: {
    defaultMultiplier: 100,
    lowAmountThreshold: 50_000_000,
    lowAmountMultiplier: 70
  },
  residential: {
    sale: [
      { min: 0, max: 50_000_000, rate: 0.006, limit: 250_000 },
      { min: 50_000_000, max: 200_000_000, rate: 0.005, limit: 800_000 },
      { min: 200_000_000, max: 900_000_000, rate: 0.004, limit: null },
      { min: 900_000_000, max: 1_200_000_000, rate: 0.005, limit: null },
      { min: 1_200_000_000, max: 1_500_000_000, rate: 0.006, limit: null },
      { min: 1_500_000_000, max: null, rate: 0.007, limit: null }
    ] satisfies BrokerageBand[],
    rent: [
      { min: 0, max: 50_000_000, rate: 0.005, limit: 200_000 },
      { min: 50_000_000, max: 100_000_000, rate: 0.004, limit: 300_000 },
      { min: 100_000_000, max: 600_000_000, rate: 0.003, limit: null },
      { min: 600_000_000, max: 1_200_000_000, rate: 0.004, limit: null },
      { min: 1_200_000_000, max: 1_500_000_000, rate: 0.005, limit: null },
      { min: 1_500_000_000, max: null, rate: 0.006, limit: null }
    ] satisfies BrokerageBand[]
  }
};
