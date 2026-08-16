import { beforeEach, describe, expect, it } from "vitest";
import { buildFragmentPath } from "@/lib/fragment-state";
import { clearRecentCalculations, loadRecentCalculations, saveRecentCalculation } from "@/lib/recent-calculations";

describe("growth journey helpers", () => {
  beforeEach(() => {
    clearRecentCalculations();
  });

  it("builds share and handoff URLs with fragment state only", () => {
    const path = buildFragmentPath("/rent-vs-jeonse-calculator", {
      jeonseDeposit: 500_000_000,
      jeonseLoanRate: 4.2,
      empty: undefined,
      unsafe: "1,000"
    });

    expect(path).toBe("/rent-vs-jeonse-calculator#jeonseDeposit=500000000&jeonseLoanRate=4.2");
    expect(path).not.toContain("?");
  });

  it("stores only recent calculation display fields with a max of five", () => {
    for (let index = 0; index < 6; index += 1) {
      saveRecentCalculation({
        calculator_type: `calculator_${index}`,
        page_path: `/calculator-${index}`,
        summary: `요약 ${index}`
      });
    }

    const items = loadRecentCalculations();
    expect(items).toHaveLength(5);
    expect(items[0]).toEqual(expect.objectContaining({
      calculator_type: "calculator_5",
      page_path: "/calculator-5",
      summary: "요약 5"
    }));
    expect(items[0]).toHaveProperty("saved_at");
    expect(JSON.stringify(items)).not.toMatch(/principal|income|deposit|monthlyRent|result/i);
  });
});

