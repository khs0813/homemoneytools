import { calculateLoan, type RepaymentType } from "@/lib/calculators/loan";
import { clamp, roundTo, sanitizeNumber } from "@/lib/format";

const MAX_PERCENT = 100;

function safeMoney(value: number) {
  return sanitizeNumber(value, 0, 1_000_000_000_000_000);
}

function safePercent(value: number) {
  return sanitizeNumber(value, 0, MAX_PERCENT);
}

function yearlyProgressiveTax(taxableIncome: number) {
  const base = Math.max(0, taxableIncome);
  if (base <= 14_000_000) return base * 0.06;
  if (base <= 50_000_000) return base * 0.15 - 1_260_000;
  if (base <= 88_000_000) return base * 0.24 - 5_760_000;
  if (base <= 150_000_000) return base * 0.35 - 15_440_000;
  if (base <= 300_000_000) return base * 0.38 - 19_940_000;
  if (base <= 500_000_000) return base * 0.40 - 25_940_000;
  if (base <= 1_000_000_000) return base * 0.42 - 35_940_000;
  return base * 0.45 - 65_940_000;
}

function earnedIncomeDeduction(earnedIncome: number) {
  const income = Math.max(0, earnedIncome);
  if (income <= 5_000_000) return income * 0.7;
  if (income <= 15_000_000) return 3_500_000 + (income - 5_000_000) * 0.4;
  if (income <= 45_000_000) return 7_500_000 + (income - 15_000_000) * 0.15;
  if (income <= 100_000_000) return 12_000_000 + (income - 45_000_000) * 0.05;
  return 14_750_000 + (income - 100_000_000) * 0.02;
}

export function calculateTakeHomePay(input: {
  annualSalary: number;
  annualBonus: number;
  monthlyNonTaxable: number;
  dependents: number;
  childrenUnder20: number;
}) {
  const annualSalary = safeMoney(input.annualSalary);
  const annualBonus = safeMoney(input.annualBonus);
  const monthlyNonTaxable = safeMoney(input.monthlyNonTaxable);
  const dependents = clamp(Math.round(input.dependents), 1, 10);
  const childrenUnder20 = clamp(Math.round(input.childrenUnder20), 0, 10);
  const grossAnnual = annualSalary + annualBonus;
  const grossMonthly = grossAnnual / 12;
  const taxableAnnual = Math.max(0, grossAnnual - monthlyNonTaxable * 12);

  const pension = Math.min(taxableAnnual, 61_700_000) * 0.045;
  const health = taxableAnnual * 0.03545;
  const longTermCare = health * 0.1295;
  const employment = taxableAnnual * 0.009;
  const totalInsurance = pension + health + longTermCare + employment;

  const incomeDeduction = earnedIncomeDeduction(taxableAnnual);
  const personalDeduction = dependents * 1_500_000 + childrenUnder20 * 1_500_000;
  const taxableBase = Math.max(0, taxableAnnual - incomeDeduction - personalDeduction - totalInsurance);
  const incomeTax = yearlyProgressiveTax(taxableBase);
  const localIncomeTax = incomeTax * 0.1;
  const annualNet = grossAnnual - totalInsurance - incomeTax - localIncomeTax;

  return {
    grossAnnual: roundTo(grossAnnual),
    grossMonthly: roundTo(grossMonthly),
    monthlyNonTaxable: roundTo(monthlyNonTaxable),
    nationalPension: roundTo(pension),
    healthInsurance: roundTo(health),
    longTermCare: roundTo(longTermCare),
    employmentInsurance: roundTo(employment),
    totalInsurance: roundTo(totalInsurance),
    incomeTax: roundTo(incomeTax),
    localIncomeTax: roundTo(localIncomeTax),
    annualNet: roundTo(annualNet),
    monthlyNet: roundTo(annualNet / 12),
    monthlyDeductions: roundTo((grossAnnual - annualNet) / 12),
    deductionRate: roundTo(grossAnnual > 0 ? (grossAnnual - annualNet) / grossAnnual * 100 : 0, 2)
  };
}

export function calculateLoanInterest(input: {
  principal: number;
  annualRate: number;
  years: number;
  repaymentType: RepaymentType;
}) {
  return calculateLoan(input);
}

export function calculateSeverancePay(input: {
  averageMonthlyWage: number;
  years: number;
  extraMonths: number;
  taxRate: number;
}) {
  const averageMonthlyWage = safeMoney(input.averageMonthlyWage);
  const years = clamp(input.years, 0, 50);
  const extraMonths = clamp(input.extraMonths, 0, 11);
  const taxRate = safePercent(input.taxRate);
  const serviceYears = years + extraMonths / 12;
  const grossSeverance = averageMonthlyWage * serviceYears;
  const estimatedTax = grossSeverance * (taxRate / 100);
  return {
    serviceYears: roundTo(serviceYears, 2),
    grossSeverance: roundTo(grossSeverance),
    estimatedTax: roundTo(estimatedTax),
    netSeverance: roundTo(grossSeverance - estimatedTax),
    monthlyReserveEquivalent: roundTo(grossSeverance / Math.max(serviceYears * 12, 1))
  };
}

export function calculateDividendIncome(input: {
  investmentAmount: number;
  dividendYield: number;
  taxRate: number;
  frequency: number;
  targetMonthlyDividend: number;
}) {
  const investmentAmount = safeMoney(input.investmentAmount);
  const dividendYield = safePercent(input.dividendYield);
  const taxRate = safePercent(input.taxRate);
  const frequency = clamp(Math.round(input.frequency), 1, 12);
  const targetMonthlyDividend = safeMoney(input.targetMonthlyDividend);
  const grossAnnualDividend = investmentAmount * (dividendYield / 100);
  const netAnnualDividend = grossAnnualDividend * (1 - taxRate / 100);
  const netMonthlyDividend = netAnnualDividend / 12;
  const dividendPerPayment = netAnnualDividend / frequency;
  const neededPrincipalForTarget = targetMonthlyDividend > 0 && dividendYield > 0
    ? targetMonthlyDividend * 12 / ((dividendYield / 100) * (1 - taxRate / 100))
    : 0;
  return {
    grossAnnualDividend: roundTo(grossAnnualDividend),
    netAnnualDividend: roundTo(netAnnualDividend),
    netMonthlyDividend: roundTo(netMonthlyDividend),
    dividendPerPayment: roundTo(dividendPerPayment),
    neededPrincipalForTarget: roundTo(neededPrincipalForTarget)
  };
}

export function calculateExchangeRate(input: {
  krwAmount: number;
  exchangeRate: number;
  feeRate: number;
  backExchangeRate: number;
}) {
  const krwAmount = safeMoney(input.krwAmount);
  const exchangeRate = clamp(input.exchangeRate, 0.0001, 1_000_000);
  const feeRate = safePercent(input.feeRate);
  const backExchangeRate = clamp(input.backExchangeRate, 0.0001, 1_000_000);
  const foreignAmount = krwAmount / exchangeRate;
  const feeAmountForeign = foreignAmount * (feeRate / 100);
  const foreignAfterFee = foreignAmount - feeAmountForeign;
  const backToKrw = foreignAfterFee * backExchangeRate;
  return {
    foreignAmount: roundTo(foreignAmount, 2),
    feeAmountForeign: roundTo(feeAmountForeign, 2),
    foreignAfterFee: roundTo(foreignAfterFee, 2),
    backToKrw: roundTo(backToKrw),
    roundTripDifference: roundTo(backToKrw - krwAmount)
  };
}

export function calculateOverseasStockTax(input: {
  buyPrice: number;
  sellPrice: number;
  shares: number;
  buyRate: number;
  sellRate: number;
  fees: number;
}) {
  const buyPrice = clamp(input.buyPrice, 0, 10_000_000);
  const sellPrice = clamp(input.sellPrice, 0, 10_000_000);
  const shares = clamp(Math.round(input.shares), 0, 10_000_000);
  const buyRate = clamp(input.buyRate, 0.0001, 1_000_000);
  const sellRate = clamp(input.sellRate, 0.0001, 1_000_000);
  const fees = safeMoney(input.fees);
  const purchaseAmountKrw = buyPrice * shares * buyRate;
  const saleAmountKrw = sellPrice * shares * sellRate;
  const capitalGain = saleAmountKrw - purchaseAmountKrw - fees;
  const deduction = 2_500_000;
  const taxableGain = Math.max(0, capitalGain - deduction);
  const estimatedTax = taxableGain * 0.22;
  return {
    purchaseAmountKrw: roundTo(purchaseAmountKrw),
    saleAmountKrw: roundTo(saleAmountKrw),
    capitalGain: roundTo(capitalGain),
    deduction,
    taxableGain: roundTo(taxableGain),
    estimatedTax: roundTo(estimatedTax)
  };
}

function getResidentialRate(monthlyUsageKwh: number, season: "normal" | "summer") {
  const usage = clamp(monthlyUsageKwh, 0, 10_000);
  const normal = season === "normal";
  const tiers = normal
    ? [200, 200, Infinity]
    : [300, 150, Infinity];
  const rates = normal
    ? [120, 214.6, 307.3]
    : [120, 214.6, 307.3];
  const baseFees = normal
    ? [910, 1_600, 7_300]
    : [910, 1_600, 7_300];

  let remaining = usage;
  let energyCharge = 0;
  const tierBreakdown: number[] = [];
  tiers.forEach((limit, index) => {
    const consumption = Math.min(remaining, limit);
    tierBreakdown.push(consumption);
    energyCharge += consumption * rates[index];
    remaining -= consumption;
  });

  const baseFee = usage <= tiers[0] ? baseFees[0] : usage <= tiers[0] + tiers[1] ? baseFees[1] : baseFees[2];
  const climateCharge = usage * 9;
  const fuelAdjustment = usage * 5;
  const total = baseFee + energyCharge + climateCharge + fuelAdjustment;
  return {
    usage,
    baseFee: roundTo(baseFee),
    energyCharge: roundTo(energyCharge),
    climateCharge: roundTo(climateCharge),
    fuelAdjustment: roundTo(fuelAdjustment),
    total: roundTo(total),
    averageRate: roundTo(usage > 0 ? total / usage : 0, 2),
    tierBreakdown
  };
}

export function calculateElectricityBill(input: {
  monthlyUsageKwh: number;
  season: "normal" | "summer";
}) {
  return getResidentialRate(input.monthlyUsageKwh, input.season);
}

export function calculateAirConditionerCost(input: {
  powerWatts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  pricePerKwh: number;
}) {
  const powerWatts = clamp(input.powerWatts, 0, 10_000);
  const hoursPerDay = clamp(input.hoursPerDay, 0, 24);
  const daysPerMonth = clamp(input.daysPerMonth, 0, 31);
  const pricePerKwh = clamp(input.pricePerKwh, 0, 10_000);
  const monthlyUsageKwh = (powerWatts / 1_000) * hoursPerDay * daysPerMonth;
  const estimatedCost = monthlyUsageKwh * pricePerKwh;
  return {
    monthlyUsageKwh: roundTo(monthlyUsageKwh, 2),
    estimatedCost: roundTo(estimatedCost),
    dailyCost: roundTo(daysPerMonth > 0 ? estimatedCost / daysPerMonth : 0),
    hourlyCost: roundTo(pricePerKwh * (powerWatts / 1_000))
  };
}

export function calculateCarMaintenanceCost(input: {
  monthlyDistanceKm: number;
  fuelEfficiencyKmPerL: number;
  fuelPricePerL: number;
  annualInsurance: number;
  annualTax: number;
  monthlyParking: number;
  monthlyToll: number;
  monthlyMaintenanceReserve: number;
  monthlyInstallment: number;
}) {
  const monthlyDistanceKm = clamp(input.monthlyDistanceKm, 0, 100_000);
  const fuelEfficiencyKmPerL = clamp(input.fuelEfficiencyKmPerL, 0.1, 100);
  const fuelPricePerL = clamp(input.fuelPricePerL, 0, 10_000);
  const annualInsurance = safeMoney(input.annualInsurance);
  const annualTax = safeMoney(input.annualTax);
  const monthlyParking = safeMoney(input.monthlyParking);
  const monthlyToll = safeMoney(input.monthlyToll);
  const monthlyMaintenanceReserve = safeMoney(input.monthlyMaintenanceReserve);
  const monthlyInstallment = safeMoney(input.monthlyInstallment);
  const monthlyFuelCost = monthlyDistanceKm / fuelEfficiencyKmPerL * fuelPricePerL;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyTax = annualTax / 12;
  const totalMonthlyCost = monthlyFuelCost + monthlyInsurance + monthlyTax + monthlyParking + monthlyToll + monthlyMaintenanceReserve + monthlyInstallment;
  return {
    monthlyFuelCost: roundTo(monthlyFuelCost),
    monthlyInsurance: roundTo(monthlyInsurance),
    monthlyTax: roundTo(monthlyTax),
    totalMonthlyCost: roundTo(totalMonthlyCost),
    annualCost: roundTo(totalMonthlyCost * 12),
    costPerKm: roundTo(monthlyDistanceKm > 0 ? totalMonthlyCost / monthlyDistanceKm : 0, 2)
  };
}

export function calculateMonthlyLivingExpense(input: {
  monthlyNetIncome: number;
  housing: number;
  food: number;
  transportation: number;
  telecom: number;
  insurance: number;
  education: number;
  leisure: number;
  debt: number;
  miscellaneous: number;
}) {
  const monthlyNetIncome = safeMoney(input.monthlyNetIncome);
  const categories = {
    housing: safeMoney(input.housing),
    food: safeMoney(input.food),
    transportation: safeMoney(input.transportation),
    telecom: safeMoney(input.telecom),
    insurance: safeMoney(input.insurance),
    education: safeMoney(input.education),
    leisure: safeMoney(input.leisure),
    debt: safeMoney(input.debt),
    miscellaneous: safeMoney(input.miscellaneous)
  };
  const totalExpense = Object.values(categories).reduce((sum, value) => sum + value, 0);
  const remaining = monthlyNetIncome - totalExpense;
  const expenseRate = monthlyNetIncome > 0 ? totalExpense / monthlyNetIncome * 100 : 0;
  return {
    categories,
    totalExpense: roundTo(totalExpense),
    remaining: roundTo(remaining),
    expenseRate: roundTo(expenseRate, 2)
  };
}
