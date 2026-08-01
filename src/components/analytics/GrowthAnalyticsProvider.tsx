"use client";

import { useEffect, useRef } from "react";
import { classifyReferrer, trackGrowthEvent } from "@/lib/analytics";

export function GrowthAnalyticsProvider() {
  const trackedLandingRef = useRef(false);

  useEffect(() => {
    if (trackedLandingRef.current) return;

    const referrerType = classifyReferrer(document.referrer, window.location.hostname);
    if (referrerType !== "naver_organic") return;

    trackedLandingRef.current = true;
    trackGrowthEvent("organic_landing_view", { referrer_type: referrerType });
  }, []);

  return null;
}

