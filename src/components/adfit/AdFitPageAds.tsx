"use client";

import { useEffect, useState } from "react";
import { AdFitBanner } from "@/components/adfit/AdFitBanner";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

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

export function AdFitTopBanner() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop === null) {
    return null;
  }

  if (!isDesktop) {
    return (
      <div className="-mx-4 mt-6 flex justify-center overflow-hidden">
        <AdFitBanner unit="DAN-MxttnTNbygaLu9ii" width="320" height="50" />
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[728px] justify-center lg:min-w-0">
        <AdFitBanner unit="DAN-vydppL950Rcp0u3T" width="728" height="90" />
      </div>
    </div>
  );
}

export function AdFitVerticalBanner() {
  const isWideDesktop = useMediaQuery("(min-width: 1536px)");

  if (!isWideDesktop) {
    return null;
  }

  return <AdFitBanner unit="DAN-3zihtfJ5ImCC9NOc" width="160" height="600" />;
}

export function AdFitMobileRectangleBanner() {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");

  if (isTabletOrDesktop !== false) {
    return null;
  }

  return (
    <div className="-mx-4 flex justify-center overflow-hidden">
      <AdFitBanner unit="DAN-tzq6el4IGCSFEnSl" width="320" height="480" />
    </div>
  );
}

export function AdFitMobileMediumRectangleBanner() {
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");

  if (isTabletOrDesktop !== false) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
    </div>
  );
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
