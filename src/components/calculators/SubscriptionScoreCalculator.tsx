"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErrorSummary } from "@/components/calculator/FormErrorSummary";
import { NumberInput } from "@/components/calculator/NumberInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateSubscriptionScore } from "@/lib/calculators/subscription-score";
import { isValidDateInput, todayInputValue } from "@/lib/date";
import { getDateParam, getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const requiredDate = z.string().refine(isValidDateInput, "유효한 날짜를 입력해 주세요.");
const optionalDate = z.string().optional().refine((value) => !value || isValidDateInput(value), "유효한 날짜를 입력해 주세요.");

const schema = z.object({
  birthDate: requiredDate,
  maritalStatus: z.enum(["single", "married"]),
  marriageDate: optionalDate,
  homelessStartDate: requiredDate,
  dependents: z.number().finite().min(0).max(6),
  accountStartDate: requiredDate,
  spouseAccountStartDate: optionalDate,
  announcementDate: requiredDate
}).superRefine((values, context) => {
  if (values.maritalStatus === "married" && !values.marriageDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["marriageDate"], message: "기혼인 경우 혼인신고일을 입력해 주세요." });
  }
  if (!isValidDateInput(values.announcementDate)) return;
  const datedFields: Array<[keyof typeof values, string | undefined, string]> = [
    ["birthDate", values.birthDate, "생년월일"],
    ["marriageDate", values.marriageDate, "혼인신고일"],
    ["homelessStartDate", values.homelessStartDate, "무주택 시작일"],
    ["accountStartDate", values.accountStartDate, "청약통장 가입일"],
    ["spouseAccountStartDate", values.spouseAccountStartDate, "배우자 청약통장 가입일"]
  ];
  datedFields.forEach(([path, value, label]) => {
    if (value && isValidDateInput(value) && value > values.announcementDate) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: `${label}은 입주자모집공고일보다 늦을 수 없습니다.` });
    }
  });
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateSubscriptionScore> | null;

const defaultValues: FormValues = {
  birthDate: "1988-01-01",
  maritalStatus: "married",
  marriageDate: "2018-01-01",
  homelessStartDate: "2018-01-01",
  dependents: 2,
  accountStartDate: "2014-01-01",
  spouseAccountStartDate: "2024-01-01",
  announcementDate: todayInputValue()
};

function DateInput({ label, value, onChange, required, helper }: { label: string; value?: string; onChange: (value: string) => void; required?: boolean; helper?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}{required ? <span className="text-brand-orange"> *</span> : null}</span>
      <input type="date" value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50" />
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}

export function SubscriptionScoreCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const maritalStatus = useWatch({ control, name: "maritalStatus" });

  useEffect(() => {
    reset({
      ...defaultValues,
      birthDate: getDateParam("birthDate", defaultValues.birthDate),
      maritalStatus: getEnumParam("maritalStatus", ["single", "married"] as const, defaultValues.maritalStatus),
      marriageDate: getDateParam("marriageDate", defaultValues.marriageDate ?? ""),
      homelessStartDate: getDateParam("homelessStartDate", defaultValues.homelessStartDate),
      dependents: getNumberParam("dependents", defaultValues.dependents),
      accountStartDate: getDateParam("accountStartDate", defaultValues.accountStartDate),
      spouseAccountStartDate: getDateParam("spouseAccountStartDate", defaultValues.spouseAccountStartDate ?? ""),
      announcementDate: getDateParam("announcementDate", defaultValues.announcementDate)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const normalized = {
      ...values,
      marriageDate: values.maritalStatus === "married" ? values.marriageDate : undefined,
      spouseAccountStartDate: values.maritalStatus === "married" ? values.spouseAccountStartDate : undefined
    };
    const calculated = calculateSubscriptionScore(normalized);
    setResult(calculated);
    writeQueryState(normalized);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 청약가점" value={`${result.totalScore}점 / ${result.maxScore}점`} description={`기준 버전은 ${result.version}입니다.`}>
          <ResultRow label="무주택기간 점수" value={`${result.homelessnessScore}점`} />
          <ResultRow label="부양가족 점수" value={`${result.dependentsScore}점`} />
          <ResultRow label="본인 통장 점수" value={`${result.applicantAccountScore}점`} />
          <ResultRow label="배우자 통장 가점" value={`${result.spouseAccountScore}점`} />
          <ResultRow label="청약통장 합산 점수" value={`${result.accountScore}점`} />
          <ResultRow label="무주택기간" value={`${result.homelessnessYears}년 (${result.homelessnessMonths}개월)`} />
          <ResultRow label="본인 통장 가입기간" value={`${result.accountMonths}개월`} />
          {result.spouseAccountScore > 0 ? <ResultRow label="배우자 통장 가입기간" value={`${result.spouseAccountMonths}개월`} /> : null}
          <ResultRow label="다음 무주택 점수까지" value={result.monthsToNextHomelessnessScore ? `${result.monthsToNextHomelessnessScore}개월` : "최고 구간"} />
          <ResultRow label="다음 본인 통장 점수까지" value={result.monthsToNextAccountScore ? `${result.monthsToNextAccountScore}개월` : "합산 최고 구간"} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="birthDate" control={control} render={({ field }) => <DateInput label="생년월일" required value={field.value} onChange={field.onChange} />} />
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">혼인 여부</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="single">미혼</option>
                  <option value="married">기혼</option>
                </select>
              </label>
            )}
          />
          {maritalStatus === "married" ? <Controller name="marriageDate" control={control} render={({ field }) => <DateInput label="혼인신고일" required value={field.value} onChange={field.onChange} />} /> : null}
          <Controller name="homelessStartDate" control={control} render={({ field }) => <DateInput label="무주택 시작일" required value={field.value} onChange={field.onChange} />} />
          <Controller name="dependents" control={control} render={({ field }) => <NumberInput label="부양가족 수" required suffix="명" value={field.value} onChange={field.onChange} min={0} max={6} />} />
          <Controller name="accountStartDate" control={control} render={({ field }) => <DateInput label="본인 청약통장 가입일" required value={field.value} onChange={field.onChange} />} />
          {maritalStatus === "married" ? <Controller name="spouseAccountStartDate" control={control} render={({ field }) => <DateInput label="배우자 청약통장 가입일" value={field.value} onChange={field.onChange} helper="배우자 가입기간은 최대 3점까지 합산되며 통장 점수 합계는 17점이 상한입니다." />} /> : null}
          <Controller name="announcementDate" control={control} render={({ field }) => <DateInput label="입주자모집공고일" required value={field.value} onChange={field.onChange} />} />
        </div>
        <FormErrorSummary messages={[
          errors.birthDate?.message,
          errors.marriageDate?.message,
          errors.homelessStartDate?.message,
          errors.accountStartDate?.message,
          errors.spouseAccountStartDate?.message,
          errors.announcementDate?.message
        ]} />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">청약 가점 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
