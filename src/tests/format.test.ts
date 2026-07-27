import { describe, expect, it } from "vitest";
import { formatCurrency, formatKoreanMoney } from "@/lib/format";

describe("money result formatting", () => {
  it("always renders exact won without Korean large-unit abbreviation", () => {
    expect(formatCurrency(0)).toBe("0원");
    expect(formatCurrency(9_999)).toBe("9,999원");
    expect(formatCurrency(10_000)).toBe("10,000원");
    expect(formatCurrency(99_999_999)).toBe("99,999,999원");
    expect(formatCurrency(100_000_000)).toBe("100,000,000원");
    expect(formatCurrency(199_999_999)).toBe("199,999,999원");
    expect(formatCurrency(-2_171_722)).toBe("-2,171,722원");
    expect(formatCurrency(Number.NaN)).toBe("0원");
    expect(formatCurrency(-0.4)).toBe("0원");
    expect(formatKoreanMoney(199_999_999)).toBe("199,999,999원");
  });
});
