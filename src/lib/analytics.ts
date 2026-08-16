export type AnalyticsEventName =
  | "ad_slot_requested"
  | "ad_slot_rendered"
  | "ad_slot_viewable"
  | "ad_slot_failed"
  | "calculator_start"
  | "calculator_complete"
  | "result_view"
  | "content_complete"
  | "related_content_click"
  | "next_tool_click"
  | "share_click"
  | "return_visit"
  | "organic_landing_view"
  | "preset_selected"
  | "recent_calculation_open"
  | "next_action_view"
  | "next_action_click"
  | "related_calculator_click"
  | "guide_to_calculator_click"
  | "share_result_click";

export type AnalyticsCommonProps = {
  site?: "jipcalc";
  page_path?: string;
  page_group?: string;
  placement?: string;
  device?: "mobile" | "desktop";
  ad_size?: string;
  experiment_id?: string;
  referrer_type?: string;
};

export type GrowthEventProperties = AnalyticsCommonProps & {
  calculator_type?: string;
  content_cluster?: string;
  event_name?: AnalyticsEventName;
  experiment_version?: string;
  preset_name?: string;
  source_section?: string;
  target_path?: string;
  [key: string]: unknown;
};

const allowedEvents = new Set<AnalyticsEventName>([
  "ad_slot_requested",
  "ad_slot_rendered",
  "ad_slot_viewable",
  "ad_slot_failed",
  "calculator_start",
  "calculator_complete",
  "result_view",
  "content_complete",
  "related_content_click",
  "next_tool_click",
  "share_click",
  "return_visit",
  "organic_landing_view",
  "preset_selected",
  "recent_calculation_open",
  "next_action_view",
  "next_action_click",
  "related_calculator_click",
  "guide_to_calculator_click",
  "share_result_click"
]);

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (command: "event", eventName: string, params: Record<string, unknown>) => void;
};

const growthExperimentVersion = "growth-2026-08-a";
const rawFinancialPropertyPattern = /(income|salary|amount|price|deposit|result)/i;

export function classifyReferrer(referrer?: string, siteHostname?: string) {
  if (!referrer) {
    return "direct";
  }

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    const normalizedSiteHostname = siteHostname?.toLowerCase();

    if (normalizedSiteHostname && (hostname === normalizedSiteHostname || hostname.endsWith(`.${normalizedSiteHostname}`))) {
      return "internal";
    }

    if (hostname === "naver.com" || hostname.endsWith(".naver.com")) {
      return "naver_organic";
    }

    if (hostname === "google.com" || hostname.endsWith(".google.com")) {
      return "google_organic";
    }

    return "referral";
  } catch {
    return "unknown";
  }
}

export function getReferrerType(referrer?: string) {
  const value = referrer ?? (typeof document === "undefined" ? "" : document.referrer);

  return classifyReferrer(value);
}

function getCurrentPagePath() {
  return typeof window === "undefined" ? undefined : window.location.pathname;
}

function getCurrentReferrerType() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return "direct";
  }

  return classifyReferrer(document.referrer, window.location.hostname);
}

function sanitizeGrowthProperties(props: GrowthEventProperties) {
  const sanitized: GrowthEventProperties = {};

  for (const [key, value] of Object.entries(props)) {
    if (rawFinancialPropertyPattern.test(key)) {
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

export function buildGrowthPayload(eventName: AnalyticsEventName, props: GrowthEventProperties = {}) {
  return sanitizeGrowthProperties({
    site: "jipcalc",
    page_path: props.page_path ?? getCurrentPagePath(),
    experiment_id: props.experiment_id ?? "adfit-baseline-20260801",
    experiment_version: props.experiment_version ?? growthExperimentVersion,
    referrer_type: props.referrer_type ?? getCurrentReferrerType(),
    ...props,
    event_name: eventName
  });
}

export function trackAnalyticsEvent(eventName: AnalyticsEventName, props: AnalyticsCommonProps = {}) {
  if (!allowedEvents.has(eventName) || typeof window === "undefined") {
    return;
  }

  const payload: AnalyticsCommonProps = {
    site: "jipcalc",
    page_path: props.page_path ?? window.location.pathname,
    experiment_id: props.experiment_id ?? "adfit-baseline-20260801",
    referrer_type: props.referrer_type ?? getReferrerType(),
    ...props
  };
  const detail = { event: eventName, ...payload };
  const win = window as AnalyticsWindow;

  window.dispatchEvent(new CustomEvent("jipcalc:analytics-event", { detail }));
  win.dataLayer?.push(detail);
  win.gtag?.("event", eventName, payload as Record<string, unknown>);
}

export function trackGrowthEvent(eventName: AnalyticsEventName, props: GrowthEventProperties = {}) {
  if (!allowedEvents.has(eventName) || typeof window === "undefined") {
    return;
  }

  const payload = buildGrowthPayload(eventName, props);
  const detail = { event: eventName, ...payload };
  const win = window as AnalyticsWindow;

  window.dispatchEvent(new CustomEvent("jipcalc:growth-event", { detail }));
  win.dataLayer?.push(detail);
  win.gtag?.("event", eventName, payload as Record<string, unknown>);
}
