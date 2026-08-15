import { describe, expect, it, vi } from "vitest";
import { buildGrowthPayload, classifyReferrer, trackGrowthEvent } from "@/lib/analytics";

describe("growth analytics", () => {
  it("classifies Naver organic referrers without depending on a provider", () => {
    expect(classifyReferrer("https://search.naver.com/search.naver?query=전세대출", "jipcalc.co.kr")).toBe("naver_organic");
    expect(classifyReferrer("https://jipcalc.co.kr/dsr-calculator", "jipcalc.co.kr")).toBe("internal");
    expect(classifyReferrer("", "jipcalc.co.kr")).toBe("direct");
  });

  it("builds common payload dimensions without raw financial values", () => {
    window.history.replaceState({}, "", "/dsr-calculator");
    const payload = buildGrowthPayload("calculator_complete", { calculator_type: "dsr", content_cluster: "housing" });

    expect(payload).toEqual(expect.objectContaining({
      event_name: "calculator_complete",
      page_path: "/dsr-calculator",
      calculator_type: "dsr",
      content_cluster: "housing",
      experiment_version: "growth-2026-08-a"
    }));
    expect(JSON.stringify(payload)).not.toMatch(/income|salary|amount|price|deposit|result/i);
  });

  it("dispatches browser events and optional provider calls", () => {
    window.history.replaceState({}, "", "/jeonse-loan-interest-calculator");
    const listener = vi.fn();
    const gtag = vi.fn();
    window.addEventListener("jipcalc:growth-event", listener);
    Object.assign(window, { gtag, dataLayer: [] });

    trackGrowthEvent("calculator_start", { calculator_type: "jeonse_loan_interest", content_cluster: "housing" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "calculator_start", expect.objectContaining({ calculator_type: "jeonse_loan_interest" }));
    expect((window as typeof window & { dataLayer: Array<Record<string, unknown>> }).dataLayer[0]).toEqual(expect.objectContaining({ event: "calculator_start" }));

    window.removeEventListener("jipcalc:growth-event", listener);
  });
});
