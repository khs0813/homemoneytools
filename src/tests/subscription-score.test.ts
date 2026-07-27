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
    expect(result.applicantAccountScore).toBe(17);
    expect(result.accountScore).toBe(17);
    expect(result.totalScore).toBe(64);
  });

  it("adds spouse account period points but caps the combined account score at 17", () => {
    const result = calculateSubscriptionScore({
      birthDate: "1980-01-01",
      maritalStatus: "married",
      marriageDate: "2000-01-01",
      homelessStartDate: "2005-01-01",
      dependents: 2,
      accountStartDate: "2022-01-01",
      spouseAccountStartDate: "2024-01-01",
      announcementDate: "2026-01-01"
    });

    expect(result.applicantAccountScore).toBe(6);
    expect(result.spouseAccountScore).toBe(3);
    expect(result.accountScore).toBe(9);
    expect(result.totalScore).toBe(56);
  });

  it("keeps spouse account score boundaries at 12 and 24 months", () => {
    const base = {
      birthDate: "1980-01-01",
      maritalStatus: "married" as const,
      marriageDate: "2000-01-01",
      homelessStartDate: "2020-01-01",
      dependents: 0,
      accountStartDate: "2025-01-01",
      announcementDate: "2026-01-01"
    };

    expect(calculateSubscriptionScore({ ...base, spouseAccountStartDate: "2025-02-01" }).spouseAccountScore).toBe(1);
    expect(calculateSubscriptionScore({ ...base, spouseAccountStartDate: "2025-01-01" }).spouseAccountScore).toBe(2);
    expect(calculateSubscriptionScore({ ...base, spouseAccountStartDate: "2024-01-01" }).spouseAccountScore).toBe(3);
  });

  it("caps a long applicant-plus-spouse account score at 17", () => {
    const result = calculateSubscriptionScore({
      birthDate: "1980-01-01",
      maritalStatus: "married",
      marriageDate: "2000-01-01",
      homelessStartDate: "2005-01-01",
      dependents: 2,
      accountStartDate: "2005-01-01",
      spouseAccountStartDate: "2020-01-01",
      announcementDate: "2026-01-01"
    });

    expect(result.applicantAccountScore).toBe(17);
    expect(result.spouseAccountScore).toBe(3);
    expect(result.accountScore).toBe(17);
  });

  it("rejects invalid or future dates rather than silently using today", () => {
    expect(() => calculateSubscriptionScore({
      birthDate: "2026-02-30",
      maritalStatus: "single",
      homelessStartDate: "2020-01-01",
      dependents: 0,
      accountStartDate: "2020-01-01",
      announcementDate: "2026-01-01"
    })).toThrow(RangeError);

    expect(() => calculateSubscriptionScore({
      birthDate: "1980-01-01",
      maritalStatus: "single",
      homelessStartDate: "2020-01-01",
      dependents: 0,
      accountStartDate: "2027-01-01",
      announcementDate: "2026-01-01"
    })).toThrow("청약통장 가입일");
  });
});
