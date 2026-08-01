"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackGrowthEvent } from "@/lib/analytics";

const ADFIT_SDK_SRC = "https://t1.kakaocdn.net/kas/static/ba.min.js";

export type AdFitPlacement =
  | "calculator_result_primary"
  | "calculator_mid_content"
  | "calculator_end"
  | "guide_after_answer"
  | "guide_mid_content"
  | "guide_end"
  | "desktop_side_rail";

type Device = "mobile" | "desktop";

type UnitConfig = {
  envKey: string;
  fallbackUnit?: string;
  width: string;
  height: string;
};

type PlacementConfig = {
  flagEnvKey: string;
  mobile?: UnitConfig;
  desktop?: UnitConfig;
};

type AdFitGlobal = {
  adfit?: { init?: () => void } | (() => void);
  __jipcalcAdFitSdkPromise?: Promise<void>;
  __jipcalcAdFitInitTimers?: Map<string, number>;
};

type AdFitSlotProps = {
  placement: AdFitPlacement;
  className?: string;
};

const placementConfig: Record<AdFitPlacement, PlacementConfig> = {
  calculator_result_primary: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD",
    mobile: { envKey: "NEXT_PUBLIC_ADFIT_MOBILE_RESULT", fallbackUnit: "DAN-4cOowgAme3T2tNK2", width: "300", height: "250" },
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_DESKTOP_RESULT", fallbackUnit: "DAN-vydppL950Rcp0u3T", width: "728", height: "90" }
  },
  calculator_mid_content: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_CALCULATOR_MID_AD",
    mobile: { envKey: "NEXT_PUBLIC_ADFIT_MOBILE_MID", fallbackUnit: "DAN-tzq6el4IGCSFEnSl", width: "320", height: "480" },
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_DESKTOP_MID", width: "728", height: "90" }
  },
  calculator_end: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_CALCULATOR_END_AD",
    mobile: { envKey: "NEXT_PUBLIC_ADFIT_MOBILE_END", fallbackUnit: "DAN-MxttnTNbygaLu9ii", width: "320", height: "50" },
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_DESKTOP_MID", width: "728", height: "90" }
  },
  guide_after_answer: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD",
    mobile: { envKey: "NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_AFTER_ANSWER", fallbackUnit: "DAN-4cOowgAme3T2tNK2", width: "300", height: "250" },
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_AFTER_ANSWER", fallbackUnit: "DAN-vydppL950Rcp0u3T", width: "728", height: "90" }
  },
  guide_mid_content: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD",
    mobile: { envKey: "NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_MID", width: "300", height: "250" },
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_MID", width: "728", height: "90" }
  },
  guide_end: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD",
    mobile: { envKey: "NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_END", width: "320", height: "50" },
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_END", width: "728", height: "90" }
  },
  desktop_side_rail: {
    flagEnvKey: "NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD",
    desktop: { envKey: "NEXT_PUBLIC_ADFIT_DESKTOP_RAIL", fallbackUnit: "DAN-3zihtfJ5ImCC9NOc", width: "160", height: "600" }
  }
};

function getEnvValue(key: string): string | undefined {
  return process.env[key]?.trim() || undefined;
}

function isEnabled(flagEnvKey: string): boolean {
  const value = getEnvValue(flagEnvKey);
  return value !== "false" && value !== "0";
}

function getUnit(config: UnitConfig): string | undefined {
  return getEnvValue(config.envKey) || config.fallbackUnit;
}

function getAdFitInit() {
  const adfit = (window as Window & AdFitGlobal).adfit;
  return typeof adfit === "function" ? adfit : adfit?.init;
}

function loadAdFitSdk() {
  const win = window as Window & AdFitGlobal;
  if (win.__jipcalcAdFitSdkPromise) return win.__jipcalcAdFitSdkPromise;

  win.__jipcalcAdFitSdkPromise = new Promise((resolve, reject) => {
    if (getAdFitInit()) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-adfit-sdk='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("AdFit SDK failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = ADFIT_SDK_SRC;
    script.dataset.kakaoAdfitSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("AdFit SDK failed to load"));
    document.body.appendChild(script);
  });

  return win.__jipcalcAdFitSdkPromise;
}

function scheduleAdFitInit(slotKey: string) {
  const win = window as Window & AdFitGlobal;
  if (!win.__jipcalcAdFitInitTimers) {
    win.__jipcalcAdFitInitTimers = new Map();
  }

  const existing = win.__jipcalcAdFitInitTimers.get(slotKey);
  if (existing) {
    window.clearTimeout(existing);
  }

  const timer = window.setTimeout(() => {
    win.__jipcalcAdFitInitTimers?.delete(slotKey);
    void loadAdFitSdk().then(() => {
      getAdFitInit()?.();
    }).catch(() => undefined);
  }, 80);

  win.__jipcalcAdFitInitTimers.set(slotKey, timer);
  return () => {
    const activeTimer = win.__jipcalcAdFitInitTimers?.get(slotKey);
    if (activeTimer === timer) {
      window.clearTimeout(timer);
      win.__jipcalcAdFitInitTimers?.delete(slotKey);
    }
  };
}

function useDevice(): Device | null {
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDevice(media.matches ? "desktop" : "mobile");
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return device;
}

export function AdFitSlot({ placement, className }: AdFitSlotProps) {
  const device = useDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const config = placementConfig[placement];
  const unitConfig = device ? config[device] : undefined;
  const unit = unitConfig ? getUnit(unitConfig) : undefined;
  const slotKey = useMemo(() => `${placement}:${device ?? "unknown"}:${unit ?? "none"}`, [device, placement, unit]);

  useEffect(() => {
    if (!device || !unit || !unitConfig || !isEnabled(config.flagEnvKey)) return;
    trackGrowthEvent("ad_slot_rendered", { ad_placement: placement, source_section: placement });
    return scheduleAdFitInit(slotKey);
  }, [config.flagEnvKey, device, placement, slotKey, unit, unitConfig]);

  useEffect(() => {
    if (!containerRef.current || !device || !unit || !unitConfig || !isEnabled(config.flagEnvKey) || typeof IntersectionObserver === "undefined") return;

    let tracked = false;
    const observer = new IntersectionObserver((entries) => {
      if (tracked || !entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) return;
      tracked = true;
      trackGrowthEvent("ad_slot_viewable", { ad_placement: placement, source_section: placement });
      observer.disconnect();
    }, { threshold: [0.5] });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [config.flagEnvKey, device, placement, unit, unitConfig]);

  if (!device || !unit || !unitConfig || !isEnabled(config.flagEnvKey)) {
    return null;
  }

  return (
    <aside className={["my-4 flex justify-center overflow-hidden", className].filter(Boolean).join(" ")} data-adfit-placement={placement}>
      <div
        ref={containerRef}
        className="max-w-full overflow-hidden"
        style={{ width: `${unitConfig.width}px`, minHeight: `${unitConfig.height}px` }}
      >
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit={unit}
          data-ad-width={unitConfig.width}
          data-ad-height={unitConfig.height}
          data-jipcalc-ad-slot-key={slotKey}
        />
      </div>
    </aside>
  );
}

