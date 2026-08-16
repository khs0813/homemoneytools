"use client";

import { useEffect, useState } from "react";
import { AdFitSlot, type AdFitPlacement } from "@/components/adfit/AdFitSlot";

type AdFitTopBannerPlacement = Extract<AdFitPlacement, "mid_content" | "end" | "guide_end">;

function useMediaQuery(query: string, initialMatches: boolean | null = null) {
  const [matches, setMatches] = useState<boolean | null>(initialMatches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [query]);

  return matches;
}

export function AdFitTopBanner({ placement = "mid_content" }: { placement?: AdFitTopBannerPlacement }) {
  return <AdFitSlot placement={placement} className="mt-6 md:mt-8" />;
}

export function AdFitDesktopTopBanner() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop !== true) {
    return null;
  }

  return <AdFitSlot placement="mid_content" className="mt-8" />;
}

export function AdFitMobileCalculatorHeaderAds() {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isTabletOrDesktop !== false) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      if (window.scrollY > 0 && window.scrollY <= headerHeight + 8) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isTabletOrDesktop]);

  if (isTabletOrDesktop !== false) {
    return null;
  }

  return (
    <aside className="-mx-4 mb-6 flex scroll-mt-24 flex-col items-center gap-4 overflow-hidden pt-3">
      <AdFitSlot placement="mid_content" className="my-0" />
      <AdFitSlot placement="calculator_result_primary" className="my-0" />
    </aside>
  );
}

export function AdFitVerticalBanner() {
  return <AdFitSlot placement="desktop_rail" className="my-0" />;
}

export function AdFitMobileRectangleBanner() {
  return <AdFitSlot placement="result_primary" className="my-0" />;
}

export function AdFitMobileMediumRectangleBanner() {
  return <AdFitSlot placement="guide_after_answer" className="my-0" />;
}

type AdFitSideBannerProps = {
  showVertical?: boolean;
  showMobileMediumRectangle?: boolean;
  showMobileLargeRectangle?: boolean;
};

export function AdFitSideBanner({
  showVertical = true,
  showMobileMediumRectangle = true,
  showMobileLargeRectangle = true
}: AdFitSideBannerProps) {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");
  const isWideDesktop = useMediaQuery("(min-width: 1536px)");

  if (isTabletOrDesktop === null || isWideDesktop === null) {
    return null;
  }

  if (isTabletOrDesktop && !(showVertical && isWideDesktop)) {
    return null;
  }

  return (
    <aside className="mt-6 flex flex-col items-center gap-4 xl:absolute xl:-top-64 xl:left-full xl:ml-6 xl:mt-0">
      {!isTabletOrDesktop && showMobileMediumRectangle ? <AdFitMobileMediumRectangleBanner /> : null}
      {!isTabletOrDesktop && showMobileLargeRectangle ? <AdFitMobileRectangleBanner /> : null}
      {showVertical && isWideDesktop ? (
        <div>
          <AdFitVerticalBanner />
        </div>
      ) : null}
    </aside>
  );
}

export function AdFitInlineBanner() {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");

  if (isTabletOrDesktop === null) {
    return null;
  }

  if (isTabletOrDesktop) {
    return null;
  }

  return (
    <aside className="mt-8">
      <AdFitMobileMediumRectangleBanner />
      <AdFitMobileRectangleBanner />
    </aside>
  );
}
