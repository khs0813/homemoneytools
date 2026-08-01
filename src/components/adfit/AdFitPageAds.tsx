"use client";

import { AdFitSlot } from "@/components/adfit/AdFitSlot";

export function AdFitTopBanner() {
  return <AdFitSlot placement="guide_after_answer" />;
}

export function AdFitDesktopTopBanner() {
  return <AdFitSlot placement="calculator_result_primary" />;
}

export function AdFitMobileCalculatorHeaderAds() {
  return null;
}

export function AdFitVerticalBanner() {
  return <AdFitSlot placement="desktop_side_rail" />;
}

export function AdFitMobileRectangleBanner() {
  return <AdFitSlot placement="calculator_mid_content" />;
}

export function AdFitMobileMediumRectangleBanner() {
  return <AdFitSlot placement="calculator_result_primary" />;
}

type AdFitSideBannerProps = {
  showVertical?: boolean;
  showMobileMediumRectangle?: boolean;
  showMobileLargeRectangle?: boolean;
};

export function AdFitSideBanner({ showVertical = true }: AdFitSideBannerProps) {
  if (!showVertical) return null;
  return (
    <aside className="mt-6 hidden justify-center overflow-hidden 2xl:flex">
      <AdFitSlot placement="desktop_side_rail" className="my-0" />
    </aside>
  );
}

export function AdFitInlineBanner() {
  return <AdFitSlot placement="guide_after_answer" />;
}

