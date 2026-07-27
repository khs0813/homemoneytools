export const dsrRules = {
  version: "2026-07-01 참고용",
  defaultLimit: 40,
  availableLimits: [40, 50],
  warningRatio: 0.9,
  defaultCreditLoanAssumptionYears: 5,
  defaultStressRate: 3,
  stressRatePresets: {
    metropolitanOrRegulatedVariableMortgage: 3,
    nonMetropolitanNonRegulatedVariableMortgage: 0.75,
    otherCoveredLoans: 1.5
  }
};
