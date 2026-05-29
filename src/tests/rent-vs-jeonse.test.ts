import { describe, expect, it } from "vitest";
import { calculateRentVsJeonse } from "@/lib/calculators/rent-vs-jeonse";

describe("rent vs jeonse", () => {
  it("compares total housing cost", () => {
    const result = calculateRentVsJeonse({
      jeonseDeposit: 500_000_000,
      rentDeposit: 100_000_000,
      monthlyRent: 1_200_000,
      years: 2,
      savingRate: 3,
      jeonseLoanRate: 4,
      jeonseLoanAmount: 250_000_000
    });

    expect(result.rentTotalCost).toBe(34_800_000);
    expect(result.jeonseTotalCost).toBe(35_000_000);
    expect(result.winner).toBe("rent");
  });
});
