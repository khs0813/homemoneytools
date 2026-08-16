"use client";

import { useEffect, useState } from "react";
import { AdFitBanner } from "@/components/adfit/AdFitBanner";

type AdFitPlacement = "home" | "guide" | "calcArticle" | "calcPostTool";
type AdFitDevice = "mobile" | "desktop";

type AdFitUnit = {
  unit: string;
  width: string;
  height: string;
};

type AdFitPlacementProps = {
  placement?: AdFitPlacement;
};

const adFitUnits: Record<AdFitPlacement, Record<AdFitDevice, AdFitUnit>> = {
  home: {
    mobile: {
      unit: process.env.PUBLIC_ADFIT_HOME_MOBILE || process.env.NEXT_PUBLIC_ADFIT_HOME_MOBILE || "",
      width: "320",
      height: "50"
    },
    desktop: {
      unit: process.env.PUBLIC_ADFIT_HOME_DESKTOP || process.env.NEXT_PUBLIC_ADFIT_HOME_DESKTOP || "",
      width: "728",
      height: "90"
    }
  },
  guide: {
    mobile: {
      unit: process.env.PUBLIC_ADFIT_GUIDE_MOBILE || process.env.NEXT_PUBLIC_ADFIT_GUIDE_MOBILE || "",
      width: "320",
      height: "50"
    },
    desktop: {
      unit: process.env.PUBLIC_ADFIT_GUIDE_DESKTOP || process.env.NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP || "",
      width: "728",
      height: "90"
    }
  },
  calcArticle: {
    mobile: {
      unit: process.env.PUBLIC_ADFIT_CALC_ARTICLE_MOBILE || process.env.NEXT_PUBLIC_ADFIT_CALC_ARTICLE_MOBILE || "",
      width: "320",
      height: "50"
    },
    desktop: {
      unit: process.env.PUBLIC_ADFIT_CALC_ARTICLE_DESKTOP || process.env.NEXT_PUBLIC_ADFIT_CALC_ARTICLE_DESKTOP || "",
      width: "728",
      height: "90"
    }
  },
  calcPostTool: {
    mobile: {
      unit: process.env.PUBLIC_ADFIT_CALC_POST_TOOL_MOBILE || process.env.NEXT_PUBLIC_ADFIT_CALC_POST_TOOL_MOBILE || "",
      width: "320",
      height: "50"
    },
    desktop: {
      unit: process.env.PUBLIC_ADFIT_CALC_POST_TOOL_DESKTOP || process.env.NEXT_PUBLIC_ADFIT_CALC_POST_TOOL_DESKTOP || "",
      width: "728",
      height: "90"
    }
  }
};

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

function AdFitMobileBanner({ placement = "guide" }: AdFitPlacementProps) {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");
  const ad = adFitUnits[placement].mobile;

  if (isTabletOrDesktop !== false || !ad.unit) {
    return null;
  }

  return (
    <div className="-mx-4 flex justify-center overflow-hidden">
      <AdFitBanner unit={ad.unit} width={ad.width} height={ad.height} />
    </div>
  );
}

export function AdFitTopBanner({ placement = "home" }: AdFitPlacementProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)", false);

  if (isDesktop === null) {
    return null;
  }

  const ad = isDesktop ? adFitUnits[placement].desktop : adFitUnits[placement].mobile;

  if (!ad.unit) {
    return null;
  }

  if (!isDesktop) {
    return (
      <div className="-mx-4 mt-6 flex justify-center overflow-hidden">
        <AdFitBanner unit={ad.unit} width={ad.width} height={ad.height} />
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[728px] justify-center lg:min-w-0">
        <AdFitBanner unit={ad.unit} width={ad.width} height={ad.height} />
      </div>
    </div>
  );
}

export function AdFitDesktopTopBanner({ placement = "calcPostTool" }: AdFitPlacementProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const ad = adFitUnits[placement].desktop;

  if (isDesktop !== true || !ad.unit) {
    return null;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[728px] justify-center lg:min-w-0">
        <AdFitBanner unit={ad.unit} width={ad.width} height={ad.height} />
      </div>
    </div>
  );
}

export function AdFitMobileCalculatorHeaderAds({ placement = "calcPostTool" }: AdFitPlacementProps) {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");
  const ad = adFitUnits[placement].mobile;

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

  if (!ad.unit) {
    return null;
  }

  return (
    <aside className="-mx-4 mb-6 flex scroll-mt-24 flex-col items-center gap-4 overflow-hidden pt-3">
      <AdFitBanner unit={ad.unit} width={ad.width} height={ad.height} />
    </aside>
  );
}

export function AdFitVerticalBanner() {
  return null;
}

export function AdFitMobileRectangleBanner({ placement = "guide" }: AdFitPlacementProps) {
  return <AdFitMobileBanner placement={placement} />;
}

export function AdFitMobileMediumRectangleBanner({ placement = "guide" }: AdFitPlacementProps) {
  return <AdFitMobileBanner placement={placement} />;
}

type AdFitSideBannerProps = {
  placement?: AdFitPlacement;
  showVertical?: boolean;
  showMobileMediumRectangle?: boolean;
  showMobileLargeRectangle?: boolean;
};

export function AdFitSideBanner({
  placement = "guide",
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
      {!isTabletOrDesktop && (showMobileMediumRectangle || showMobileLargeRectangle) ? <AdFitMobileBanner placement={placement} /> : null}
      {showVertical && isWideDesktop ? (
        <div>
          <AdFitVerticalBanner />
        </div>
      ) : null}
    </aside>
  );
}

export function AdFitInlineBanner({ placement = "guide" }: AdFitPlacementProps) {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");

  if (isTabletOrDesktop === null) {
    return null;
  }

  if (isTabletOrDesktop) {
    return null;
  }

  return (
    <aside className="mt-8">
      <AdFitMobileBanner placement={placement} />
    </aside>
  );
}
