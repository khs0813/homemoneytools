import { subscriptionScoreRules } from "@/config/subscription-score-rules";
import { addYears, maxDate, monthsBetween, parseDate } from "@/lib/date";

export type SubscriptionScoreInput = {
  birthDate: string;
  maritalStatus: "single" | "married";
  marriageDate?: string;
  homelessStartDate: string;
  dependents: number;
  accountStartDate: string;
  announcementDate: string;
};

function scoreByYears(years: number) {
  const rule = subscriptionScoreRules.homelessnessPeriod.find((item) => years >= item.minYears && (item.maxYears === null || years < item.maxYears));
  return rule?.score ?? 0;
}

function scoreByMonths(months: number) {
  const rule = subscriptionScoreRules.accountPeriod.find((item) => months >= item.minMonths && (item.maxMonths === null || months < item.maxMonths));
  return rule?.score ?? 0;
}

function scoreByDependents(count: number) {
  const normalized = Math.max(0, Math.min(6, Math.floor(count)));
  return subscriptionScoreRules.dependents.find((item) => item.count === normalized)?.score ?? 0;
}

export function calculateSubscriptionScore(input: SubscriptionScoreInput) {
  const birthDate = parseDate(input.birthDate);
  const announcementDate = parseDate(input.announcementDate);
  const age30Date = addYears(birthDate, 30);
  const homelessStartDate = parseDate(input.homelessStartDate);
  const accountStartDate = parseDate(input.accountStartDate);

  const isUnder30Single = input.maritalStatus === "single" && announcementDate < age30Date;
  const marriageDate = input.marriageDate ? parseDate(input.marriageDate) : undefined;
  const baseHomelessDate = marriageDate && marriageDate < age30Date ? marriageDate : age30Date;
  const calculatedHomelessStartDate = isUnder30Single ? announcementDate : maxDate(baseHomelessDate, homelessStartDate);
  const homelessnessMonths = isUnder30Single ? 0 : monthsBetween(calculatedHomelessStartDate, announcementDate);
  const homelessnessYears = Math.floor(homelessnessMonths / 12);
  const homelessnessScore = isUnder30Single ? 0 : scoreByYears(homelessnessYears);

  const dependentsScore = scoreByDependents(input.dependents);
  const accountMonths = monthsBetween(accountStartDate, announcementDate);
  const accountScore = scoreByMonths(accountMonths);
  const totalScore = homelessnessScore + dependentsScore + accountScore;

  const nextHomelessRule = subscriptionScoreRules.homelessnessPeriod.find((rule) => rule.score > homelessnessScore);
  const nextAccountRule = subscriptionScoreRules.accountPeriod.find((rule) => rule.score > accountScore);

  return {
    version: subscriptionScoreRules.version,
    totalScore,
    maxScore: subscriptionScoreRules.maxScore,
    homelessnessScore,
    dependentsScore,
    accountScore,
    homelessnessMonths,
    homelessnessYears,
    accountMonths,
    calculatedHomelessStartDate,
    monthsToNextHomelessnessScore: nextHomelessRule ? Math.max(0, nextHomelessRule.minYears * 12 - homelessnessMonths) : 0,
    monthsToNextAccountScore: nextAccountRule ? Math.max(0, nextAccountRule.minMonths - accountMonths) : 0
  };
}
