import fs from "node:fs";
import path from "node:path";
import React from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdFitSlot, resolveAdFitSlotForTest, type AdFitRuntimeEnv } from "@/components/adfit/AdFitSlot";

function mockMatchMedia(isDesktop: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("min-width") ? isDesktop : !isDesktop,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

function resetAdFitGlobals() {
  const win = window as Window & {
    __jipcalcAdFitSdkPromise?: Promise<void>;
    __jipcalcAdFitRequestedSlots?: Set<string>;
    __jipcalcAdFitRenderedSlots?: Set<string>;
    __jipcalcAdFitViewableSlots?: Set<string>;
    adfit?: { init?: () => void };
  };

  delete win.__jipcalcAdFitSdkPromise;
  delete win.__jipcalcAdFitRequestedSlots;
  delete win.__jipcalcAdFitRenderedSlots;
  delete win.__jipcalcAdFitViewableSlots;
  delete win.adfit;
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  resetAdFitGlobals();
  vi.restoreAllMocks();
});

describe("AdFit guardrails", () => {
  it("does not hardcode DAN IDs in source files", () => {
    const sourceRoot = path.resolve(process.cwd(), "src");
    const files: string[] = [];
    const danIdPattern = new RegExp(["DAN", "[A-Za-z0-9]+"].join("-"));

    function collect(currentPath: string) {
      for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
        const entryPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          collect(entryPath);
          continue;
        }

        if (/\.(ts|tsx)$/.test(entry.name)) {
          files.push(entryPath);
        }
      }
    }

    collect(sourceRoot);

    for (const file of files) {
      expect(fs.readFileSync(file, "utf8")).not.toMatch(danIdPattern);
    }
  });

  it("does not render an ad DOM when the unit env is missing", async () => {
    mockMatchMedia(false);
    const { container } = render(React.createElement(AdFitSlot, { placement: "result_primary", envOverride: {} }));

    await waitFor(() => {
      expect(container.querySelector(".kakao_ad_area")).toBeNull();
    });
  });

  it("selects only the current viewport unit", () => {
    const env: AdFitRuntimeEnv = {
      NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE: "mobile-rectangle-unit",
      NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER: "desktop-web-unit"
    };

    expect(resolveAdFitSlotForTest("result_primary", "mobile", env)).toEqual(
      expect.objectContaining({
        envName: "NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE",
        adSize: "320x480",
        unitPresent: true
      })
    );
    expect(resolveAdFitSlotForTest("result_primary", "desktop", env)).toEqual(
      expect.objectContaining({
        envName: "NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER",
        adSize: "728x90",
        unitPresent: true
      })
    );
  });

  it("respects placement feature flags", () => {
    const env: AdFitRuntimeEnv = {
      NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY: "false",
      NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE: "mobile-rectangle-unit"
    };

    expect(resolveAdFitSlotForTest("result_primary", "mobile", env)).toBeNull();
  });

  it("renders an active slot without hidden styles", async () => {
    mockMatchMedia(false);
    const { container } = render(
      React.createElement(AdFitSlot, {
        placement: "result_primary",
        envOverride: { NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE: "mobile-rectangle-unit" }
      })
    );

    await waitFor(() => {
      const ad = container.querySelector(".kakao_ad_area");
      expect(ad).not.toBeNull();
      expect(ad?.getAttribute("data-ad-width")).toBe("320");
      expect(ad?.getAttribute("data-ad-height")).toBe("480");
      expect(ad?.getAttribute("style") ?? "").not.toContain("display: none");
    });
  });
});
