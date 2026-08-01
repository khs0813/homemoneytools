export type GrowthEventName =
  | "organic_landing_view"
  | "calculator_start"
  | "calculator_complete"
  | "result_view"
  | "preset_selected"
  | "next_action_view"
  | "next_action_click"
  | "related_calculator_click"
  | "guide_to_calculator_click"
  | "recent_calculation_open"
  | "share_result_click"
  | "ad_slot_rendered"
  | "ad_slot_viewable";

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";
export type ReferrerType = "naver_organic" | "google_organic" | "direct" | "internal" | "other_referrer";

export type GrowthEventProperties = {
  page_path?: string;
  calculator_type?: string;
  content_cluster?: string;
  device_type?: DeviceType;
  referrer_type?: ReferrerType;
  source_section?: string;
  target_path?: string;
  preset_name?: string;
  ad_placement?: string;
  experiment_version?: string;
};

type GrowthPayload = GrowthEventProperties & {
  event_name: GrowthEventName;
  event_timestamp: string;
};

type AnalyticsWindow = Window & {
  gtag?: (command: "event", eventName: string, properties: Record<string, unknown>) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

export const GROWTH_EXPERIMENT_VERSION = "growth-2026-08-a";

const calculatorTypeByPath: Record<string, string> = {
  "/jeonse-loan-interest-calculator": "jeonse_loan_interest",
  "/monthly-rent-conversion-calculator": "monthly_rent_conversion",
  "/rent-vs-jeonse-calculator": "rent_vs_jeonse",
  "/dsr-calculator": "dsr",
  "/real-estate-brokerage-fee-calculator": "brokerage_fee",
  "/acquisition-tax-calculator": "acquisition_tax",
  "/home-purchase-total-cost-calculator": "home_purchase_total_cost",
  "/housing-subscription-score-calculator": "housing_subscription_score",
  "/loan-interest-calculator": "loan_interest"
};

function getPathname(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function getCalculatorTypeFromPath(path = getPathname()): string | undefined {
  return calculatorTypeByPath[path];
}

export function getContentClusterFromPath(path = getPathname()): string {
  if (path.startsWith("/guides/")) return "guide";
  if (
    path.includes("jeonse") ||
    path.includes("rent") ||
    path.includes("dsr") ||
    path.includes("acquisition-tax") ||
    path.includes("brokerage") ||
    path.includes("housing-subscription") ||
    path.includes("home-purchase")
  ) {
    return "housing";
  }
  if (path === "/") return "home";
  return "other";
}

export function classifyReferrer(referrer: string, currentHost: string): ReferrerType {
  if (!referrer) return "direct";

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host === currentHost.toLowerCase()) return "internal";
    if (host === "naver.com" || host.endsWith(".naver.com") || host === "search.naver.com") return "naver_organic";
    if (host === "google.com" || host.endsWith(".google.com")) return "google_organic";
    return "other_referrer";
  } catch {
    return "other_referrer";
  }
}

function getDeviceType(): DeviceType {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "unknown";
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1023px)").matches) return "tablet";
  return "desktop";
}

function getCommonProperties(): Required<Pick<GrowthEventProperties, "page_path" | "content_cluster" | "device_type" | "referrer_type" | "experiment_version">> & Pick<GrowthEventProperties, "calculator_type"> {
  const pagePath = getPathname();
  const currentHost = typeof window === "undefined" ? "" : window.location.hostname;

  return {
    page_path: pagePath,
    calculator_type: getCalculatorTypeFromPath(pagePath),
    content_cluster: getContentClusterFromPath(pagePath),
    device_type: getDeviceType(),
    referrer_type: typeof document === "undefined" ? "direct" : classifyReferrer(document.referrer, currentHost),
    experiment_version: GROWTH_EXPERIMENT_VERSION
  };
}

function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  Object.keys(value).forEach((key) => {
    if (value[key] === undefined) {
      delete value[key];
    }
  });
  return value;
}

export function buildGrowthPayload(eventName: GrowthEventName, properties: GrowthEventProperties = {}): GrowthPayload {
  return removeUndefined({
    ...getCommonProperties(),
    ...properties,
    event_name: eventName,
    event_timestamp: new Date().toISOString()
  });
}

export function trackGrowthEvent(eventName: GrowthEventName, properties: GrowthEventProperties = {}) {
  if (typeof window === "undefined") return;

  const payload = buildGrowthPayload(eventName, properties);
  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dispatchEvent(new CustomEvent("jipcalc:growth-event", { detail: payload }));

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, payload);
  }

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({ event: eventName, ...payload });
  }
}

