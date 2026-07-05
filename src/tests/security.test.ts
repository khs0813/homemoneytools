import { describe, expect, it } from "vitest";
import { safeJsonStringify } from "@/lib/json-ld";
import { sanitizeSiteUrl } from "@/lib/site-url";
import { asWon, parseBoundedNumber, sanitizeNumber } from "@/lib/format";
import { escapeCsvCell, rowsToCsv } from "@/lib/csv";
import { writeQueryState } from "@/lib/query-state";

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
    expect(parseBoundedNumber("1e999", 0, 100)).toBe(0);
    expect(parseBoundedNumber("-1", 0, 100)).toBe(0);
    expect(parseBoundedNumber("10.12345", 0, 100, 2)).toBe(0);
    expect(parseBoundedNumber("50.12", 0, 100, 2)).toBe(50.12);
  });

  it("escapes CSV cells that spreadsheet apps may execute", () => {
    expect(escapeCsvCell("=SUM(1,1)")).toBe("\"'=SUM(1,1)\"");
    expect(escapeCsvCell("+cmd")).toBe("\"'+cmd\"");
    expect(escapeCsvCell("-cmd")).toBe("\"'-cmd\"");
    expect(escapeCsvCell("@cmd")).toBe("\"'@cmd\"");
    expect(rowsToCsv([["name", "amount"], ["safe", 1000]])).toBe("\"name\",\"amount\"\r\n\"safe\",\"1000\"");
  });

  it("does not persist sensitive calculator values into the URL", () => {
    window.history.replaceState({}, "", "/?principal=1000&annualRate=3");

    writeQueryState({
      calculator: "loan-interest",
      principal: 2000,
      annualIncome: 70_000_000,
      jeonseDeposit: 500_000_000,
      annualRate: 4
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get("calculator")).toBe("loan-interest");
    expect(params.get("annualRate")).toBe("4");
    expect(params.has("principal")).toBe(false);
    expect(params.has("annualIncome")).toBe(false);
    expect(params.has("jeonseDeposit")).toBe(false);
  });
});
