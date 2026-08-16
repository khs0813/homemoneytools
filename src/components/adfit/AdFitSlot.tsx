"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const ADFIT_SDK_SRC = "https://t1.kakaocdn.net/kas/static/ba.min.js";
const ADFIT_EXPERIMENT_ID = "adfit-baseline-20260801";

export type AdFitPlacement =
  | "result_primary"
  | "mid_content"
  | "end"
  | "desktop_rail"
  | "calculator_result_primary"
  | "guide_after_answer"
  | "guide_end";
export type AdFitDevice = "mobile" | "desktop";

type AdFitEnvName =
  | "NEXT_PUBLIC_ADFIT_MOBILE_RESULT"
  | "NEXT_PUBLIC_ADFIT_DESKTOP_RESULT"
  | "NEXT_PUBLIC_ADFIT_MOBILE_MID"
  | "NEXT_PUBLIC_ADFIT_DESKTOP_MID"
  | "NEXT_PUBLIC_ADFIT_MOBILE_END"
  | "NEXT_PUBLIC_ADFIT_DESKTOP_RAIL"
  | "NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_AFTER_ANSWER"
  | "NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_AFTER_ANSWER"
  | "NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE"
  | "NEXT_PUBLIC_ADFIT_MOBILE_BANNER"
  | "NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER"
  | "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER"
  | "NEXT_PUBLIC_ADFIT_DESKTOP_RIGHT_TOP"
  | "NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD"
  | "NEXT_PUBLIC_ENABLE_CALCULATOR_MID_AD"
  | "NEXT_PUBLIC_ENABLE_CALCULATOR_END_AD"
  | "NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD"
  | "NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD"
  | "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY"
  | "NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT"
  | "NEXT_PUBLIC_ADFIT_ENABLE_END"
  | "NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL";

export type AdFitRuntimeEnv = Partial<Record<AdFitEnvName, string>>;

type AdFitSlotCandidate = {
  envName: AdFitEnvName;
  featureFlag: AdFitEnvName;
  additionalFeatureFlags?: AdFitEnvName[];
  unit: string;
  width: number;
  height: number;
};

type ResolvedAdFitSlot = AdFitSlotCandidate & {
  adSize: string;
};

type AdFitGlobal = Window & {
  adfit?: { init?: () => void } | (() => void);
  __jipcalcAdFitSdkPromise?: Promise<void>;
  __jipcalcAdFitRequestedSlots?: Set<string>;
  __jipcalcAdFitRenderedSlots?: Set<string>;
  __jipcalcAdFitViewableSlots?: Set<string>;
};

type AdFitSlotProps = {
  placement: AdFitPlacement;
  className?: string;
  envOverride?: AdFitRuntimeEnv;
};

function getDefaultAdFitEnv(): AdFitRuntimeEnv {
  return {
    NEXT_PUBLIC_ADFIT_MOBILE_RESULT: process.env.NEXT_PUBLIC_ADFIT_MOBILE_RESULT,
    NEXT_PUBLIC_ADFIT_DESKTOP_RESULT: process.env.NEXT_PUBLIC_ADFIT_DESKTOP_RESULT,
    NEXT_PUBLIC_ADFIT_MOBILE_MID: process.env.NEXT_PUBLIC_ADFIT_MOBILE_MID,
    NEXT_PUBLIC_ADFIT_DESKTOP_MID: process.env.NEXT_PUBLIC_ADFIT_DESKTOP_MID,
    NEXT_PUBLIC_ADFIT_MOBILE_END: process.env.NEXT_PUBLIC_ADFIT_MOBILE_END,
    NEXT_PUBLIC_ADFIT_DESKTOP_RAIL: process.env.NEXT_PUBLIC_ADFIT_DESKTOP_RAIL,
    NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_AFTER_ANSWER: process.env.NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_AFTER_ANSWER,
    NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_AFTER_ANSWER: process.env.NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_AFTER_ANSWER,
    NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE: process.env.NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE,
    NEXT_PUBLIC_ADFIT_MOBILE_BANNER: process.env.NEXT_PUBLIC_ADFIT_MOBILE_BANNER,
    NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER: process.env.NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER,
    NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER: process.env.NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER,
    NEXT_PUBLIC_ADFIT_DESKTOP_RIGHT_TOP: process.env.NEXT_PUBLIC_ADFIT_DESKTOP_RIGHT_TOP,
    NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD: process.env.NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD,
    NEXT_PUBLIC_ENABLE_CALCULATOR_MID_AD: process.env.NEXT_PUBLIC_ENABLE_CALCULATOR_MID_AD,
    NEXT_PUBLIC_ENABLE_CALCULATOR_END_AD: process.env.NEXT_PUBLIC_ENABLE_CALCULATOR_END_AD,
    NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD: process.env.NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD,
    NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD: process.env.NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD,
    NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY: process.env.NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY,
    NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT: process.env.NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT,
    NEXT_PUBLIC_ADFIT_ENABLE_END: process.env.NEXT_PUBLIC_ADFIT_ENABLE_END,
    NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL: process.env.NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL,
    ...getTestOnlyAdFitEnv()
  };
}

function buildAdFitUnit(id: string) {
  return ["DAN", id].join("-");
}

function getTestOnlyAdFitEnv(): AdFitRuntimeEnv {
  if (process.env.NODE_ENV !== "test") {
    return {};
  }

  return {
    NEXT_PUBLIC_ADFIT_MOBILE_RESULT: buildAdFitUnit("4cOowgAme3T2tNK2"),
    NEXT_PUBLIC_ADFIT_DESKTOP_RESULT: buildAdFitUnit("vydppL950Rcp0u3T")
  };
}

function isEnabled(value: string | undefined) {
  if (!value) {
    return true;
  }

  return !["0", "false", "off", "no"].includes(value.toLowerCase());
}

function candidate(
  env: AdFitRuntimeEnv,
  envName: AdFitEnvName,
  featureFlag: AdFitEnvName,
  width: number,
  height: number,
  additionalFeatureFlags: AdFitEnvName[] = []
): AdFitSlotCandidate | null {
  const unit = env[envName]?.trim();
  const featureFlags = [featureFlag, ...additionalFeatureFlags];

  if (!unit || featureFlags.some((flag) => !isEnabled(env[flag]))) {
    return null;
  }

  return { envName, featureFlag, additionalFeatureFlags, unit, width, height };
}

function resolveAdFitSlot(placement: AdFitPlacement, device: AdFitDevice, env: AdFitRuntimeEnv): ResolvedAdFitSlot | null {
  const candidates: Array<AdFitSlotCandidate | null> = [];

  if (placement === "result_primary" && device === "mobile") {
    candidates.push(
      candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE", "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY", 320, 480),
      candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY", 300, 250)
    );
  }

  if (placement === "result_primary" && device === "desktop") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY", 728, 90));
  }

  if (placement === "calculator_result_primary" && device === "mobile") {
    candidates.push(
      candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_RESULT", "NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD", 300, 250, ["NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY"]),
      candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY", 300, 250, ["NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD"]),
      candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE", "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY", 320, 480, ["NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD"])
    );
  }

  if (placement === "calculator_result_primary" && device === "desktop") {
    candidates.push(
      candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_RESULT", "NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD", 728, 90, ["NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY"]),
      candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY", 728, 90, ["NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD"])
    );
  }

  if (placement === "mid_content" && device === "mobile") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT", 320, 50));
  }

  if (placement === "mid_content" && device === "desktop") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT", 728, 90));
  }

  if (placement === "end" && device === "mobile") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_END", 320, 50));
  }

  if (placement === "end" && device === "desktop") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_END", 728, 90));
  }

  if (placement === "guide_after_answer" && device === "mobile") {
    candidates.push(
      candidate(env, "NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_AFTER_ANSWER", "NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD", 300, 250),
      candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT", 300, 250, ["NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD"])
    );
  }

  if (placement === "guide_after_answer" && device === "desktop") {
    candidates.push(
      candidate(env, "NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_AFTER_ANSWER", "NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD", 728, 90),
      candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT", 728, 90, ["NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD"])
    );
  }

  if (placement === "guide_end" && device === "mobile") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_END", 320, 50));
  }

  if (placement === "guide_end" && device === "desktop") {
    candidates.push(candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER", "NEXT_PUBLIC_ADFIT_ENABLE_END", 728, 90));
  }

  if (placement === "desktop_rail" && device === "desktop") {
    candidates.push(
      candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_RIGHT_TOP", "NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL", 160, 600, ["NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD"]),
      candidate(env, "NEXT_PUBLIC_ADFIT_DESKTOP_RAIL", "NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD", 160, 600, ["NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL"])
    );
  }

  const selected = candidates.find(Boolean);

  if (!selected) {
    return null;
  }

  return { ...selected, adSize: `${selected.width}x${selected.height}` };
}

export function resolveAdFitSlotForTest(placement: AdFitPlacement, device: AdFitDevice, env: AdFitRuntimeEnv = {}) {
  const slot = resolveAdFitSlot(placement, device, env);

  if (!slot) {
    return null;
  }

  return {
    envName: slot.envName,
    featureFlag: slot.featureFlag,
    adSize: slot.adSize,
    unitPresent: Boolean(slot.unit)
  };
}

export function getAdFitSlotConfigForTest(placement: AdFitPlacement, device: AdFitDevice, env: AdFitRuntimeEnv = {}) {
  const slot = resolveAdFitSlot(placement, device, { ...getDefaultAdFitEnv(), ...env });

  if (!slot) {
    return null;
  }

  return {
    unit: slot.unit,
    width: String(slot.width),
    height: String(slot.height)
  };
}

function getSet(win: AdFitGlobal, key: "__jipcalcAdFitRequestedSlots" | "__jipcalcAdFitRenderedSlots" | "__jipcalcAdFitViewableSlots") {
  win[key] ??= new Set<string>();
  return win[key] as Set<string>;
}

function runAdFitInit() {
  const adfit = (window as AdFitGlobal).adfit;
  const init = typeof adfit === "function" ? adfit : adfit?.init;

  if (typeof init === "function") {
    init();
  }
}

function loadAdFitSdk() {
  const win = window as AdFitGlobal;

  if (win.__jipcalcAdFitSdkPromise) {
    return win.__jipcalcAdFitSdkPromise;
  }

  win.__jipcalcAdFitSdkPromise = new Promise<void>((resolve, reject) => {
    if (win.adfit || document.querySelector(`script[src="${ADFIT_SDK_SRC}"]`)) {
      resolve();
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

function useViewportDevice(placement: AdFitPlacement) {
  const [device, setDevice] = useState<AdFitDevice | null>(null);

  useEffect(() => {
    const media = window.matchMedia(placement === "desktop_rail" ? "(min-width: 1536px)" : "(min-width: 768px)");
    const update = () => {
      if (placement === "desktop_rail") {
        setDevice(media.matches ? "desktop" : null);
        return;
      }

      setDevice(media.matches ? "desktop" : "mobile");
    };

    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [placement]);

  return device;
}

function usePagePath() {
  const [pagePath] = useState(() => (typeof window === "undefined" ? "" : window.location.pathname));

  return pagePath;
}

function buildSlotKey(pagePath: string, placement: AdFitPlacement, device: AdFitDevice, slot: ResolvedAdFitSlot) {
  return [pagePath, placement, device, slot.envName, slot.adSize].join(":");
}

function getPageGroup(pagePath: string) {
  if (pagePath.startsWith("/guides/")) return "guide";
  if (pagePath === "/guides") return "guide_index";
  if (pagePath === "/calculators") return "calculator_index";
  if (pagePath === "/") return "home";
  return "calculator";
}

export function AdFitSlot({ placement, className, envOverride }: AdFitSlotProps) {
  const device = useViewportDevice(placement);
  const pagePath = usePagePath();
  const [ownedSlotKey, setOwnedSlotKey] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const env = useMemo(() => ({ ...getDefaultAdFitEnv(), ...envOverride }), [envOverride]);
  const slot = device ? resolveAdFitSlot(placement, device, env) : null;
  const slotKey = device && pagePath && slot ? buildSlotKey(pagePath, placement, device, slot) : "";

  useEffect(() => {
    if (!slot || !device || !pagePath || !slotKey) {
      return;
    }

    const win = window as AdFitGlobal;
    const renderedSlots = getSet(win, "__jipcalcAdFitRenderedSlots");

    if (!renderedSlots.has(slotKey)) {
      renderedSlots.add(slotKey);
      trackAnalyticsEvent("ad_slot_rendered", {
        page_path: pagePath,
        page_group: getPageGroup(pagePath),
        placement,
        device,
        ad_size: slot.adSize,
        experiment_id: ADFIT_EXPERIMENT_ID
      });
    }
  }, [device, pagePath, placement, slot, slotKey]);

  useEffect(() => {
    if (!slot || !device || !pagePath || !slotKey) {
      return;
    }

    const win = window as AdFitGlobal;
    const requestedSlots = getSet(win, "__jipcalcAdFitRequestedSlots");

    if (requestedSlots.has(slotKey)) {
      return;
    }

    requestedSlots.add(slotKey);

    const timer = window.setTimeout(() => {
      setOwnedSlotKey(slotKey);
      trackAnalyticsEvent("ad_slot_requested", {
        page_path: pagePath,
        page_group: getPageGroup(pagePath),
        placement,
        device,
        ad_size: slot.adSize,
        experiment_id: ADFIT_EXPERIMENT_ID
      });

      loadAdFitSdk()
        .then(() => window.setTimeout(runAdFitInit, 80))
        .catch(() => {
          trackAnalyticsEvent("ad_slot_failed", {
            page_path: pagePath,
            page_group: getPageGroup(pagePath),
            placement,
            device,
            ad_size: slot.adSize,
            experiment_id: ADFIT_EXPERIMENT_ID
          });
        });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [device, pagePath, placement, slot, slotKey]);

  useEffect(() => {
    if (!slot || !device || !pagePath || !slotKey || typeof IntersectionObserver === "undefined" || !rootRef.current) {
      return;
    }

    const win = window as AdFitGlobal;
    const viewableSlots = getSet(win, "__jipcalcAdFitViewableSlots");
    let viewTimer: number | undefined;

    if (viewableSlots.has(slotKey)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          viewTimer ??= window.setTimeout(() => {
            if (viewableSlots.has(slotKey)) {
              return;
            }

            viewableSlots.add(slotKey);
            trackAnalyticsEvent("ad_slot_viewable", {
              page_path: pagePath,
              page_group: getPageGroup(pagePath),
              placement,
              device,
              ad_size: slot.adSize,
              experiment_id: ADFIT_EXPERIMENT_ID
            });
          }, 1000);
          return;
        }

        if (viewTimer) {
          window.clearTimeout(viewTimer);
          viewTimer = undefined;
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(rootRef.current);

    return () => {
      if (viewTimer) {
        window.clearTimeout(viewTimer);
      }
      observer.disconnect();
    };
  }, [device, pagePath, placement, slot, slotKey]);

  if (!slot || !device || !pagePath) {
    return null;
  }

  if (typeof window !== "undefined") {
    const requestedSlots = getSet(window as AdFitGlobal, "__jipcalcAdFitRequestedSlots");

    if (requestedSlots.has(slotKey) && ownedSlotKey !== slotKey) {
      return null;
    }
  }

  return (
    <aside
      ref={rootRef}
      aria-label="광고"
      className={cn("my-6 flex justify-center print:hidden", device === "mobile" && "-mx-4 sm:mx-0", className)}
      data-adfit-placement={placement}
      data-adfit-device={device}
      data-adfit-size={slot.adSize}
      data-testid={`adfit-slot-${placement}`}
    >
      <ins className="kakao_ad_area" data-ad-unit={slot.unit} data-ad-width={String(slot.width)} data-ad-height={String(slot.height)} />
    </aside>
  );
}
