export type PeriodRule = {
  minMonths: number;
  maxMonths: number | null;
  score: number;
};

export type HomelessnessRule = {
  minYears: number;
  maxYears: number | null;
  score: number;
};

export const subscriptionScoreRules = {
  version: "2026-01 참고용",
  maxScore: 84,
  homelessnessPeriod: [
    { minYears: 0, maxYears: 1, score: 2 },
    { minYears: 1, maxYears: 2, score: 4 },
    { minYears: 2, maxYears: 3, score: 6 },
    { minYears: 3, maxYears: 4, score: 8 },
    { minYears: 4, maxYears: 5, score: 10 },
    { minYears: 5, maxYears: 6, score: 12 },
    { minYears: 6, maxYears: 7, score: 14 },
    { minYears: 7, maxYears: 8, score: 16 },
    { minYears: 8, maxYears: 9, score: 18 },
    { minYears: 9, maxYears: 10, score: 20 },
    { minYears: 10, maxYears: 11, score: 22 },
    { minYears: 11, maxYears: 12, score: 24 },
    { minYears: 12, maxYears: 13, score: 26 },
    { minYears: 13, maxYears: 14, score: 28 },
    { minYears: 14, maxYears: 15, score: 30 },
    { minYears: 15, maxYears: null, score: 32 }
  ] satisfies HomelessnessRule[],
  dependents: [
    { count: 0, score: 5 },
    { count: 1, score: 10 },
    { count: 2, score: 15 },
    { count: 3, score: 20 },
    { count: 4, score: 25 },
    { count: 5, score: 30 },
    { count: 6, score: 35 }
  ],
  accountPeriod: [
    { minMonths: 0, maxMonths: 6, score: 1 },
    { minMonths: 6, maxMonths: 12, score: 2 },
    { minMonths: 12, maxMonths: 24, score: 3 },
    { minMonths: 24, maxMonths: 36, score: 4 },
    { minMonths: 36, maxMonths: 48, score: 5 },
    { minMonths: 48, maxMonths: 60, score: 6 },
    { minMonths: 60, maxMonths: 72, score: 7 },
    { minMonths: 72, maxMonths: 84, score: 8 },
    { minMonths: 84, maxMonths: 96, score: 9 },
    { minMonths: 96, maxMonths: 108, score: 10 },
    { minMonths: 108, maxMonths: 120, score: 11 },
    { minMonths: 120, maxMonths: 132, score: 12 },
    { minMonths: 132, maxMonths: 144, score: 13 },
    { minMonths: 144, maxMonths: 156, score: 14 },
    { minMonths: 156, maxMonths: 168, score: 15 },
    { minMonths: 168, maxMonths: 180, score: 16 },
    { minMonths: 180, maxMonths: null, score: 17 }
  ] satisfies PeriodRule[]
};
