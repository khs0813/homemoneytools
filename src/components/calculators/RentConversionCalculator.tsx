"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErrorSummary } from "@/components/calculator/FormErrorSummary";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { rentConversionRules } from "@/config/rent-conversion-rules";
import { calculateRentConversion, type RentConversionType } from "@/lib/calculators/rent-conversion";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  type: z.enum(["jeonse-to-rent", "rent-to-jeonse"]),
  jeonseAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  deposit: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  monthlyRent: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  conversionRate: z.number().finite().min(0.01).max(MAX_SAFE_RATE_PERCENT),
  years: z.number().finite().min(0.1).max(MAX_SAFE_YEARS)
}).superRefine((values, context) => {
  if (values.type === "jeonse-to-rent" && (values.jeonseAmount ?? 0) <= 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["jeonseAmount"], message: "전세금을 입력해 주세요." });
  }
  if (values.type === "jeonse-to-rent" && values.deposit > (values.jeonseAmount ?? 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["deposit"], message: "보증금은 기존 전세금을 초과할 수 없습니다." });
  }
  if (values.type === "rent-to-jeonse" && (values.monthlyRent ?? 0) <= 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["monthlyRent"], message: "월세를 입력해 주세요." });
  }
});

type FormValues = z.infer<typeof schema>;
type Result = (ReturnType<typeof calculateRentConversion> & {
  existingDeposit: number;
  changedDeposit: number;
  depositDifference: number;
}) | null;

const defaultValues: FormValues = {
  type: "jeonse-to-rent",
  jeonseAmount: 500_000_000,
  deposit: 100_000_000,
  monthlyRent: 1_500_000,
  conversionRate: rentConversionRules.legalMaximumRate,
  years: 2
};

export function RentConversionCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    reset({
      ...defaultValues,
      type: getEnumParam("type", ["jeonse-to-rent", "rent-to-jeonse"] as const, defaultValues.type) as RentConversionType,
      jeonseAmount: getNumberParam("jeonseAmount", defaultValues.jeonseAmount ?? 0),
      deposit: getNumberParam("deposit", defaultValues.deposit),
      monthlyRent: getNumberParam("monthlyRent", defaultValues.monthlyRent ?? 0),
      conversionRate: getNumberParam("conversionRate", defaultValues.conversionRate),
      years: getNumberParam("years", defaultValues.years)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateRentConversion(values);
    const existingDeposit = values.type === "jeonse-to-rent" ? values.jeonseAmount ?? 0 : values.deposit;
    const changedDeposit = values.type === "jeonse-to-rent" ? values.deposit : calculated.jeonseEquivalent;
    setResult({
      ...calculated,
      existingDeposit,
      changedDeposit,
      depositDifference: Math.abs(existingDeposit - changedDeposit)
    });
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title={result.type === "jeonse-to-rent" ? "예상 월세" : "전세 환산 금액"} value={result.type === "jeonse-to-rent" ? formatCurrency(result.monthlyRent) : formatCurrency(result.jeonseEquivalent)} description={`${result.years}년 기준 총 월세는 ${formatCurrency(result.totalRentForPeriod)}입니다.`}>
          <ResultRow label="기존 보증금" value={formatCurrency(result.existingDeposit)} />
          <ResultRow label="변경 보증금" value={formatCurrency(result.changedDeposit)} />
          <ResultRow label="보증금 차액" value={formatCurrency(result.depositDifference)} />
          <ResultRow label="적용 전환율" value={formatPercent(result.conversionRate)} />
          {result.type === "jeonse-to-rent"
            ? <ResultRow label="전세→월세 법정 상한 참고값" value={formatPercent(result.legalMaximumRate)} />
            : <ResultRow label="계산 성격" value="월세→전세 비교용 역산 · 법정 상한 직접 적용 아님" />}
          <ResultRow label="예상 월세" value={formatCurrency(result.monthlyRent)} />
          <ResultRow label="월세의 전세금 환산액" value={formatCurrency(result.jeonseEquivalent)} />
          <ResultRow label="기간 내 월세 총액" value={formatCurrency(result.totalRentForPeriod)} />
          {result.exceedsLegalMaximum ? <ResultRow label="주의" value="입력 전환율이 현재 법정 상한 참고값을 초과합니다." /> : null}
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">계산 유형</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="jeonse-to-rent">전세 → 월세</option>
                  <option value="rent-to-jeonse">월세 → 전세</option>
                </select>
              </label>
            )}
          />
          {type === "jeonse-to-rent" ? (
            <Controller name="jeonseAmount" control={control} render={({ field }) => <MoneyInput label="기존 전세금" required value={field.value ?? 0} onChange={field.onChange} />} />
          ) : (
            <Controller name="monthlyRent" control={control} render={({ field }) => <MoneyInput label="월세" required value={field.value ?? 0} onChange={field.onChange} />} />
          )}
          <Controller name="deposit" control={control} render={({ field }) => <MoneyInput label="보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="conversionRate" control={control} render={({ field }) => <PercentInput label="전월세 전환율" required value={field.value} onChange={field.onChange} helper={type === "jeonse-to-rent" ? `2026-07-16 기준 전세→월세 법정 상한 참고값 ${rentConversionRules.legalMaximumRate}% (기준금리 변동 시 갱신 필요)` : "월세→전세는 동일 전환율을 이용한 비교용 역산입니다."} min={0.01} max={30} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="비교 기간" suffix="년" value={field.value} onChange={field.onChange} min={0.1} max={30} step={0.5} />} />
        </div>
        <FormErrorSummary messages={[errors.jeonseAmount?.message, errors.deposit?.message, errors.monthlyRent?.message]} />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">월세 환산 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
