import { acquisitionTaxRates } from "@/config/acquisition-tax-rates";
import { MAX_SAFE_MONEY_AMOUNT, roundTo, sanitizeNumber } from "@/lib/format";

export type HouseCount = "one" | "two" | "three" | "fourOrMore";
export type FirstHomeDiscountType = "none" | "standard" | "expanded";

export type AcquisitionTaxInput = {
  price: number;
  houseCount: HouseCount;
  isRegulatedArea: boolean;
  isTemporaryTwoHouse?: boolean;
  floorAreaOver85?: boolean;
  firstHomeDiscountType?: FirstHomeDiscountType;
};

function getOrdinaryRate(price: number): number {
  const safePrice = sanitizeNumber(price, 0, MAX_SAFE_MONEY_AMOUNT);
  const band = acquisitionTaxRates.residential.ordinary.find((item) => safePrice >= item.min && (item.max === null || safePrice < item.max));
  if (!band) return 0;
  if (band.rateType === "linearOneToThree") {
    const progress = (safePrice - 600_000_000) / 300_000_000;
    return 0.01 + progress * 0.02;
  }
  return band.rate ?? 0;
}

export function getAcquisitionTaxRate(input: AcquisitionTaxInput): number {
  const price = sanitizeNumber(input.price, 0, MAX_SAFE_MONEY_AMOUNT);
  const ordinaryRate = getOrdinaryRate(price);

  if (input.houseCount === "one") return ordinaryRate;
  if (input.houseCount === "two") {
    if (input.isTemporaryTwoHouse) return ordinaryRate;
    return input.isRegulatedArea ? acquisitionTaxRates.residential.heavy.eightPercent : ordinaryRate;
  }
  if (input.houseCount === "three") {
    return input.isRegulatedArea
      ? acquisitionTaxRates.residential.heavy.twelvePercent
      : acquisitionTaxRates.residential.heavy.eightPercent;
  }
  return acquisitionTaxRates.residential.heavy.twelvePercent;
}

function getFirstHomeDiscountLimit(type: FirstHomeDiscountType): number {
  if (type === "expanded") return acquisitionTaxRates.firstHome.expandedDiscountLimit;
  if (type === "standard") return acquisitionTaxRates.firstHome.standardDiscountLimit;
  return 0;
}

export function calculateAcquisitionTax(input: AcquisitionTaxInput) {
  const price = sanitizeNumber(input.price, 0, MAX_SAFE_MONEY_AMOUNT);
  const rate = getAcquisitionTaxRate({ ...input, price });
  const acquisitionTaxBeforeDiscount = price * rate;
  const isHeavyRate = rate >= acquisitionTaxRates.residential.heavy.eightPercent;
  const firstHomeDiscountType = input.firstHomeDiscountType ?? "none";
  const firstHomeEligibleByBasicInputs =
    firstHomeDiscountType !== "none" &&
    input.houseCount === "one" &&
    price <= acquisitionTaxRates.firstHome.priceLimit;
  const firstHomeDiscountLimit = firstHomeEligibleByBasicInputs ? getFirstHomeDiscountLimit(firstHomeDiscountType) : 0;
  const firstHomeDiscount = Math.min(acquisitionTaxBeforeDiscount, firstHomeDiscountLimit);
  const acquisitionTax = Math.max(0, acquisitionTaxBeforeDiscount - firstHomeDiscount);
  const discountRemainingRatio = acquisitionTaxBeforeDiscount > 0 ? acquisitionTax / acquisitionTaxBeforeDiscount : 0;

  const localEducationTaxBeforeDiscount = isHeavyRate
    ? price * acquisitionTaxRates.localEducationTax.heavyRate
    : price * rate * acquisitionTaxRates.localEducationTax.ordinaryRateFactor;
  const localEducationTax = localEducationTaxBeforeDiscount * discountRemainingRatio;

  let specialRuralTax = 0;
  if (input.floorAreaOver85) {
    if (rate >= acquisitionTaxRates.residential.heavy.twelvePercent) {
      specialRuralTax = price * acquisitionTaxRates.specialRuralTax.twelvePercentAcquisitionRate;
    } else if (rate >= acquisitionTaxRates.residential.heavy.eightPercent) {
      specialRuralTax = price * acquisitionTaxRates.specialRuralTax.eightPercentAcquisitionRate;
    } else {
      specialRuralTax = price * acquisitionTaxRates.specialRuralTax.ordinaryRate;
    }
  }

  const totalTax = acquisitionTax + localEducationTax + specialRuralTax;
  const warnings: string[] = [];
  if (input.houseCount === "two" && input.isTemporaryTwoHouse) {
    warnings.push("일시적 2주택 인정 여부와 처분기한은 실제 계약·보유 상황을 별도로 확인해야 합니다.");
  }
  if (firstHomeDiscountType === "expanded") {
    warnings.push("300만원 한도는 아파트 제외 전용 60㎡ 이하 공동주택·도시형생활주택·일부 다가구주택 또는 인구감소지역 주택 등 법정 특별대상에만 적용됩니다.");
  }
  if (firstHomeDiscountType !== "none" && !firstHomeEligibleByBasicInputs) {
    warnings.push("입력한 주택 수 또는 가격으로는 생애최초 기본 요건을 충족하지 않습니다.");
  }
  if (input.floorAreaOver85 && firstHomeDiscountType !== "none") {
    warnings.push("전용 85㎡ 초과 감면주택의 농어촌특별세는 감면 유형과 신고 처리에 따라 달라질 수 있어 위택스 또는 관할 지방자치단체에서 최종 확인해야 합니다.");
  }
  warnings.push("법인·증여·상속·부담부증여·분양권·주택 수 제외 특례는 이 간편 계산 범위에 포함하지 않습니다.");

  return {
    version: acquisitionTaxRates.version,
    rate: roundTo(rate * 100, 4),
    acquisitionTaxBeforeDiscount: roundTo(acquisitionTaxBeforeDiscount),
    firstHomeDiscount: roundTo(firstHomeDiscount),
    acquisitionTax: roundTo(acquisitionTax),
    localEducationTaxBeforeDiscount: roundTo(localEducationTaxBeforeDiscount),
    localEducationTax: roundTo(localEducationTax),
    specialRuralTax: roundTo(specialRuralTax),
    totalTax: roundTo(totalTax),
    effectiveRate: price > 0 ? roundTo(totalTax / price * 100, 3) : 0,
    firstHomeEligibleByBasicInputs,
    isHeavyRate,
    warnings
  };
}
