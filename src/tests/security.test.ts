import { describe, expect, it } from "vitest";
import { safeJsonStringify } from "@/lib/json-ld";
import { sanitizeSiteUrl } from "@/lib/site-url";
import { asWon, sanitizeNumber } from "@/lib/format";

const fallback = "https://example.com";

describe("security hardening helpers", () => {
  it("rejects unsafe canonical base URLs", () => {
    expect(sanitizeSiteUrl("javascript:alert(1)", fallback)).toBe(fallback);
    expect(sanitizeSiteUrl("data:text/html,hello", fallback)).toBe(fallback);
    expect(sanitizeSiteUrl("https://home.example/path?x=1#hash", fallback)).toBe("https://home.example");
    expect(sanitizeSiteUrl("http://localhost:3000/path", fallback)).toBe("http://localhost:3000");
  });

  it("escapes JSON-LD HTML breakouts", () => {
    const serialized = safeJsonStringify({ value: "</script><img src=x onerror=alert(1)>" });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
  });

  it("clamps unsafe numbers used by calculators", () => {
    expect(sanitizeNumber(Number.POSITIVE_INFINITY, 0, 100)).toBe(0);
    expect(sanitizeNumber(150, 0, 100)).toBe(100);
    expect(asWon(Number.POSITIVE_INFINITY, "manwon")).toBe(0);
  });
});
