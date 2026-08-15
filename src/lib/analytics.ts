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
  | "return_visit";

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
  "return_visit"
]);

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (command: "event", eventName: string, params: Record<string, unknown>) => void;
};

export function getReferrerType(referrer?: string) {
  const value = referrer ?? (typeof document === "undefined" ? "" : document.referrer);

  if (!value) {
    return "direct";
  }

  try {
    const hostname = new URL(value).hostname.toLowerCase();

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
