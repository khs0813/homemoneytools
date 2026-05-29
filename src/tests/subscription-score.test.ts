import { describe, expect, it } from "vitest";
import { calculateSubscriptionScore } from "@/lib/calculators/subscription-score";

describe("subscription score", () => {
  it("calculates housing subscription score", () => {
    const result = calculateSubscriptionScore({
      birthDate: "1980-01-01",
      maritalStatus: "married",
      marriageDate: "2000-01-01",
      homelessStartDate: "2005-01-01",
      dependents: 2,
      accountStartDate: "2005-01-01",
      announcementDate: "2021-01-01"
    });

    expect(result.homelessnessScore).toBe(32);
    expect(result.dependentsScore).toBe(15);
    expect(result.accountScore).toBe(17);
    expect(result.totalScore).toBe(64);
  });
});
