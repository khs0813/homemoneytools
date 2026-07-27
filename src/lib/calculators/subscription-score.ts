import { subscriptionScoreRules } from "@/config/subscription-score-rules";
import { addYears, maxDate, monthsBetween, parseDateStrict } from "@/lib/date";

export type SubscriptionScoreInput = {
  birthDate: string;
  maritalStatus: "single" | "married";
  marriageDate?: string;
  homelessStartDate: string;
  dependents: number;
  accountStartDate: string;
  spouseAccountStartDate?: string;
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

function scoreSpouseByMonths(months: number) {
  const rule = subscriptionScoreRules.spouseAccountPeriod.find((item) => months >= item.minMonths && (item.maxMonths === null || months < item.maxMonths));
  return rule?.score ?? 0;
}

function scoreByDependents(count: number) {
  const normalized = Math.max(0, Math.min(6, Math.floor(count)));
  return subscriptionScoreRules.dependents.find((item) => item.count === normalized)?.score ?? 0;
}

export function calculateSubscriptionScore(input: SubscriptionScoreInput) {
  const birthDate = parseDateStrict(input.birthDate);
  const announcementDate = parseDateStrict(input.announcementDate);
  const age30Date = addYears(birthDate, 30);
  const homelessStartDate = parseDateStrict(input.homelessStartDate);
  const accountStartDate = parseDateStrict(input.accountStartDate);

  if (birthDate > announcementDate) throw new RangeError("생년월일은 입주자모집공고일보다 늦을 수 없습니다.");
  if (homelessStartDate > announcementDate) throw new RangeError("무주택 시작일은 입주자모집공고일보다 늦을 수 없습니다.");
  if (accountStartDate > announcementDate) throw new RangeError("청약통장 가입일은 입주자모집공고일보다 늦을 수 없습니다.");

  const isUnder30Single = input.maritalStatus === "single" && announcementDate < age30Date;
  const marriageDate = input.marriageDate ? parseDateStrict(input.marriageDate) : undefined;
  if (marriageDate && marriageDate > announcementDate) throw new RangeError("혼인신고일은 입주자모집공고일보다 늦을 수 없습니다.");
  const baseHomelessDate = marriageDate && marriageDate < age30Date ? marriageDate : age30Date;
  const calculatedHomelessStartDate = isUnder30Single ? announcementDate : maxDate(baseHomelessDate, homelessStartDate);
  const homelessnessMonths = isUnder30Single ? 0 : monthsBetween(calculatedHomelessStartDate, announcementDate);
  const homelessnessYears = Math.floor(homelessnessMonths / 12);
  const homelessnessScore = isUnder30Single ? 0 : scoreByYears(homelessnessYears);

  const dependentsScore = scoreByDependents(input.dependents);
  const accountMonths = monthsBetween(accountStartDate, announcementDate);
  const applicantAccountScore = scoreByMonths(accountMonths);

  let spouseAccountMonths = 0;
  let spouseAccountScore = 0;
  if (input.maritalStatus === "married" && input.spouseAccountStartDate) {
    const spouseAccountStartDate = parseDateStrict(input.spouseAccountStartDate);
    if (spouseAccountStartDate > announcementDate) throw new RangeError("배우자 청약통장 가입일은 입주자모집공고일보다 늦을 수 없습니다.");
    spouseAccountMonths = monthsBetween(spouseAccountStartDate, announcementDate);
    spouseAccountScore = scoreSpouseByMonths(spouseAccountMonths);
  }

  const accountScore = Math.min(17, applicantAccountScore + spouseAccountScore);
  const totalScore = homelessnessScore + dependentsScore + accountScore;

  const nextHomelessRule = subscriptionScoreRules.homelessnessPeriod.find((rule) => rule.score > homelessnessScore);
  const nextApplicantAccountRule = subscriptionScoreRules.accountPeriod.find((rule) => rule.score > applicantAccountScore);

  return {
    version: subscriptionScoreRules.version,
    totalScore,
    maxScore: subscriptionScoreRules.maxScore,
    homelessnessScore,
    dependentsScore,
    accountScore,
    applicantAccountScore,
    spouseAccountScore,
    homelessnessMonths,
    homelessnessYears,
    accountMonths,
    spouseAccountMonths,
    calculatedHomelessStartDate,
    monthsToNextHomelessnessScore: nextHomelessRule ? Math.max(0, nextHomelessRule.minYears * 12 - homelessnessMonths) : 0,
    monthsToNextAccountScore: accountScore >= 17 || !nextApplicantAccountRule ? 0 : Math.max(0, nextApplicantAccountRule.minMonths - accountMonths)
  };
}
