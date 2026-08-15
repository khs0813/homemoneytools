"use client";

import { AdFitSlot } from "@/components/adfit/AdFitSlot";

export function AdFitTopBanner() {
  return <AdFitSlot placement="mid_content" />;
}

export function AdFitDesktopTopBanner() {
  return <AdFitSlot placement="result_primary" />;
}

export function AdFitMobileCalculatorHeaderAds() {
  return null;
}

export function AdFitVerticalBanner() {
  return <AdFitSlot placement="desktop_rail" />;
}

export function AdFitMobileRectangleBanner() {
  return <AdFitSlot placement="result_primary" />;
}

export function AdFitMobileMediumRectangleBanner() {
  return <AdFitSlot placement="result_primary" />;
}

type AdFitSideBannerProps = {
  showVertical?: boolean;
  showMobileMediumRectangle?: boolean;
  showMobileLargeRectangle?: boolean;
};

export function AdFitSideBanner({
  showVertical = true,
  showMobileMediumRectangle: _showMobileMediumRectangle = true,
  showMobileLargeRectangle: _showMobileLargeRectangle = true
}: AdFitSideBannerProps) {
  if (!showVertical) {
    return null;
  }

  return <AdFitSlot placement="desktop_rail" className="xl:absolute xl:left-full xl:top-0 xl:ml-6 xl:mt-0" />;
}

export function AdFitInlineBanner() {
  return <AdFitSlot placement="end" />;
}

