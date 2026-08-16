import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdFitSlot, getAdFitSlotConfigForTest } from "@/components/adfit/AdFitSlot";
import { getCalculatorBySlug } from "@/config/calculators";
import { guides } from "@/config/guides";
import { buildCalculatorMetadata, buildPageMetadata } from "@/lib/seo";
import { getNumberParam } from "@/lib/query-state";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

function buildAdFitUnit(id: string) {
  return ["DAN", id].join("-");
}

describe("growth SEO and AdFit guardrails", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD;
  });

  it("keeps protected page metadata unchanged", () => {
    const rentVsJeonse = buildCalculatorMetadata(getCalculatorBySlug("rent-vs-jeonse"));
    const guide100m = guides.find((guide) => guide.slug === "100-million-jeonse-loan-interest");
    const guideSalary50 = guides.find((guide) => guide.slug === "salary-50-million-dsr");
    const guide600mTax = guides.find((guide) => guide.slug === "600-million-apartment-acquisition-tax");

    expect(rentVsJeonse.title).toEqual({ absolute: "월세 vs 전세 비교 계산기 | 집계산" });
    expect(guide100m && buildPageMetadata(guide100m.title, guide100m.description, guide100m.path).title).toEqual({ absolute: "전세대출 1억 이자 계산: 월 부담은 얼마일까 | 집계산" });
    expect(guideSalary50 && buildPageMetadata(guideSalary50.title, guideSalary50.description, guideSalary50.path).title).toEqual({ absolute: "연봉 5000 DSR 계산: 주담대 한도 점검 순서 | 집계산" });
    expect(guide600mTax && buildPageMetadata(guide600mTax.title, guide600mTax.description, guide600mTax.path).title).toEqual({ absolute: "6억 아파트 취득세 계산: 잔금 전 준비금 | 집계산" });
  });

  it("restores numeric values from URL fragments without query strings", () => {
    window.history.replaceState({}, "", "/rent-vs-jeonse-calculator#jeonseDeposit=500000000&years=2");

    expect(getNumberParam("jeonseDeposit", 0)).toBe(500_000_000);
    expect(getNumberParam("years", 0)).toBe(2);
  });

  it("resolves different AdFit units for mobile and desktop result slots", () => {
    const mobile = getAdFitSlotConfigForTest("calculator_result_primary", "mobile");
    const desktop = getAdFitSlotConfigForTest("calculator_result_primary", "desktop");
    const mobileUnit = buildAdFitUnit("4cOowgAme3T2tNK2");
    const desktopUnit = buildAdFitUnit("vydppL950Rcp0u3T");

    expect(mobile).toEqual(expect.objectContaining({ unit: mobileUnit, width: "300", height: "250" }));
    expect(desktop).toEqual(expect.objectContaining({ unit: desktopUnit, width: "728", height: "90" }));
  });

  it("does not render an AdFit DOM node when the placement flag is off", () => {
    process.env.NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD = "false";
    mockMatchMedia(false);

    const { container } = render(<AdFitSlot placement="calculator_result_primary" />);

    expect(container.querySelector(".kakao_ad_area")).toBeNull();
  });

  it("renders only the current viewport's AdFit unit", async () => {
    mockMatchMedia(false);
    const mobileUnit = buildAdFitUnit("4cOowgAme3T2tNK2");
    const desktopUnit = buildAdFitUnit("vydppL950Rcp0u3T");

    render(<AdFitSlot placement="calculator_result_primary" />);

    const slot = await screen.findByTestId("adfit-slot-calculator_result_primary");
    expect(slot.querySelector(`[data-ad-unit='${mobileUnit}']`)).toBeTruthy();
    expect(slot.querySelector(`[data-ad-unit='${desktopUnit}']`)).toBeNull();
  });
});
