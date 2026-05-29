import { acquisitionTaxRates } from "@/config/acquisition-tax-rates";
import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type AcquisitionType = "purchase" | "gift" | "inheritance";
export type HouseCount = "one" | "two" | "threeOrMore";

export type AcquisitionTaxInput = {
  price: number;
  houseCount: HouseCount;
  isRegulatedArea: boolean;
  acquisitionType: AcquisitionType;
  isFirstHome?: boolean;
  includeLocalEducationTax?: boolean;
  includeSpecialRuralTax?: boolean;
};

function getOneHouseRate(price: number): number {
  const safePrice = sanitizeNumber(price, 0, MAX_SAFE_MONEY_AMOUNT);
  const band = acquisitionTaxRates.residential.oneHouse.find((item) => safePrice >= item.min && (item.max === null || safePrice < item.max));
  if (!band) return 0;
  if (band.rateType === "linearOneToThree") {
    const progress = (safePrice - 600_000_000) / 300_000_000;
    return 0.01 + progress * 0.02;
  }
  return band.rate ?? 0;
}

export function getAcquisitionTaxRate(input: AcquisitionTaxInput): number {
  const price = sanitizeNumber(input.price, 0, MAX_SAFE_MONEY_AMOUNT);
  if (input.acquisitionType === "gift") return acquisitionTaxRates.residential.gift;
  if (input.acquisitionType === "inheritance") return acquisitionTaxRates.residential.inheritance;

  if (input.houseCount === "one") return getOneHouseRate(price);
  if (input.houseCount === "two") {
    return input.isRegulatedArea
      ? acquisitionTaxRates.residential.twoHouses.regulated
      : acquisitionTaxRates.residential.twoHouses.nonRegulated;
  }
  return input.isRegulatedArea
    ? acquisitionTaxRates.residential.threeOrMore.regulated
    : acquisitionTaxRates.residential.threeOrMore.nonRegulated;
}

export function calculateAcquisitionTax(input: AcquisitionTaxInput) {
  const price = sanitizeNumber(input.price, 0, MAX_SAFE_MONEY_AMOUNT);
  const rate = getAcquisitionTaxRate({ ...input, price });
  const acquisitionTaxBeforeDiscount = price * rate;
  const firstHomeDiscount = input.isFirstHome ? Math.min(acquisitionTaxBeforeDiscount, acquisitionTaxRates.firstHomeDiscountLimit) : 0;
  const acquisitionTax = Math.max(0, acquisitionTaxBeforeDiscount - firstHomeDiscount);
  const localEducationTax = input.includeLocalEducationTax ? price * acquisitionTaxRates.localEducationTaxRate : 0;
  const specialRuralTax = input.includeSpecialRuralTax ? price * acquisitionTaxRates.specialRuralTaxRate : 0;
  const totalTax = acquisitionTax + localEducationTax + specialRuralTax;

  return {
    version: acquisitionTaxRates.version,
    rate: roundTo(rate * 100, 4),
    acquisitionTaxBeforeDiscount: roundTo(acquisitionTaxBeforeDiscount),
    firstHomeDiscount: roundTo(firstHomeDiscount),
    acquisitionTax: roundTo(acquisitionTax),
    localEducationTax: roundTo(localEducationTax),
    specialRuralTax: roundTo(specialRuralTax),
    totalTax: roundTo(totalTax),
    effectiveRate: price > 0 ? roundTo(totalTax / price * 100, 3) : 0
  };
}
