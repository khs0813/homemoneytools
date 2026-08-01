"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdFitSlot } from "@/components/adfit/AdFitSlot";
import { FormErrorSummary } from "@/components/calculator/FormErrorSummary";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { QuickPresetGroup } from "@/components/calculator/QuickPresetGroup";
import { RecommendedNextActions } from "@/components/calculator/RecommendedNextActions";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ResultSummary } from "@/components/calculator/ResultSummary";
import { ShareResult } from "@/components/calculator/ShareResult";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { rentConversionRules } from "@/config/rent-conversion-rules";
import { trackGrowthEvent } from "@/lib/analytics";
import { calculateRentConversion, type RentConversionType } from "@/lib/calculators/rent-conversion";
import { buildFragmentPath } from "@/lib/fragment-state";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";
import { saveRecentCalculation } from "@/lib/recent-calculations";

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
  onePointRateChangeAmount: number;
  submitted: FormValues;
}) | null;

const defaultValues: FormValues = {
  type: "jeonse-to-rent",
  jeonseAmount: 500_000_000,
  deposit: 100_000_000,
  monthlyRent: 1_500_000,
  conversionRate: rentConversionRules.legalMaximumRate,
  years: 2
};

const analyticsContext = { calculator_type: "monthly_rent_conversion", content_cluster: "housing" };

export function RentConversionCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const type = useWatch({ control, name: "type" });
  const monthlyRent = useWatch({ control, name: "monthlyRent" });
  const deposit = useWatch({ control, name: "deposit" });
  const conversionRate = useWatch({ control, name: "conversionRate" });

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
    const onePointUp = calculateRentConversion({ ...values, conversionRate: values.conversionRate + 1 });
    const existingDeposit = values.type === "jeonse-to-rent" ? values.jeonseAmount ?? 0 : values.deposit;
    const changedDeposit = values.type === "jeonse-to-rent" ? values.deposit : calculated.jeonseEquivalent;
    const onePointRateChangeAmount = values.type === "jeonse-to-rent"
      ? onePointUp.monthlyRent - calculated.monthlyRent
      : calculated.jeonseEquivalent - onePointUp.jeonseEquivalent;
    setResult({
      ...calculated,
      existingDeposit,
      changedDeposit,
      depositDifference: Math.abs(existingDeposit - changedDeposit),
      onePointRateChangeAmount,
      submitted: values
    });
    saveRecentCalculation({
      calculator_type: analyticsContext.calculator_type,
      page_path: "/monthly-rent-conversion-calculator",
      summary: "월세 전세 환산 계산 결과"
    });
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <>
          <ResultSummary
            title={result.type === "jeonse-to-rent" ? "예상 월세" : "전세 환산 금액"}
            value={result.type === "jeonse-to-rent" ? formatCurrency(result.monthlyRent) : formatCurrency(result.jeonseEquivalent)}
            description={`${result.years}년 기준 총 월세는 ${formatCurrency(result.totalRentForPeriod)}입니다.`}
            basisDate="2026-07-16"
            assumptions={[
              "전세와 월세 환산은 입력한 전환율을 같은 공식에 적용한 참고값입니다.",
              "월세에서 전세로 환산할 때는 기존 보증금을 월세 환산분에 더합니다.",
              "전세에서 월세로 전환할 때 입력 전환율이 법정 상한 참고값을 넘으면 주의 문구를 표시합니다."
            ]}
          >
            <ResultRow label="기존 보증금" value={formatCurrency(result.existingDeposit)} />
            <ResultRow label="변경 보증금" value={formatCurrency(result.changedDeposit)} />
            <ResultRow label="보증금 차액" value={formatCurrency(result.depositDifference)} />
            <ResultRow label="적용 전환율" value={formatPercent(result.conversionRate)} />
            <ResultRow label="전환율 1%p 변화 시 결과 차이" value={formatCurrency(Math.abs(result.onePointRateChangeAmount))} />
            {result.type === "jeonse-to-rent"
              ? <ResultRow label="전세→월세 법정 상한 참고값" value={formatPercent(result.legalMaximumRate)} />
              : <ResultRow label="계산 성격" value="월세→전세 비교용 역산 · 법정 상한 직접 적용 아님" />}
            <ResultRow label="예상 월세" value={formatCurrency(result.monthlyRent)} />
            <ResultRow label="월세의 전세금 환산액" value={formatCurrency(result.jeonseEquivalent)} />
            <ResultRow label="기간 내 월세 총액" value={formatCurrency(result.totalRentForPeriod)} />
            {result.exceedsLegalMaximum ? <ResultRow label="주의" value="입력 전환율이 현재 법정 상한 참고값을 초과합니다." /> : null}
            <ShareResult
              title="월세 전세 환산 계산 결과"
              text={`월세 ${formatCurrency(result.monthlyRent)}\n전환율 ${result.conversionRate}%\n전세 환산 금액 ${formatCurrency(result.jeonseEquivalent)}\n기준일 2026-07-16\n집계산에서 직접 계산`}
              path="/monthly-rent-conversion-calculator"
              fragmentState={result.submitted}
            />
          </ResultSummary>
          <AdFitSlot placement="calculator_result_primary" />
          <RecommendedNextActions
            calculatorType="monthly_rent_conversion"
            actions={[
              {
                href: buildFragmentPath("/rent-vs-jeonse-calculator", {
                  jeonseDeposit: result.jeonseEquivalent,
                  rentDeposit: result.submitted.deposit,
                  monthlyRent: result.monthlyRent,
                  years: result.submitted.years
                }),
                title: "같은 조건으로 월세와 전세 총비용 비교",
                description: "환산 금액이 아니라 2년 총주거비와 기회비용까지 비교합니다."
              },
              {
                href: "/jeonse-loan-interest-calculator",
                title: "전세대출 월이자 확인",
                description: "전세 환산 금액 중 대출을 쓸 경우 월 이자와 총이자를 계산합니다."
              },
              {
                href: "/guides/monthly-rent-conversion-basics",
                title: "전월세 전환율 기준 이해하기",
                description: "전환율이 왜 결과를 크게 바꾸는지 기준과 예시를 확인합니다."
              }
            ]}
          />
        </>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="mb-6 grid gap-3">
          <QuickPresetGroup
            label="월세 빠른 선택"
            calculatorType="monthly_rent_conversion"
            options={[
              { label: "50만원", name: "monthly_rent_500k", selected: monthlyRent === 500_000, onSelect: () => setValue("monthlyRent", 500_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "70만원", name: "monthly_rent_700k", selected: monthlyRent === 700_000, onSelect: () => setValue("monthlyRent", 700_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "100만원", name: "monthly_rent_1m", selected: monthlyRent === 1_000_000, onSelect: () => setValue("monthlyRent", 1_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "monthly_rent_custom", selected: ![500_000, 700_000, 1_000_000].includes(monthlyRent ?? 0), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="보증금 빠른 선택"
            calculatorType="monthly_rent_conversion"
            options={[
              { label: "0원", name: "deposit_0", selected: deposit === 0, onSelect: () => setValue("deposit", 0, { shouldDirty: true, shouldValidate: true }) },
              { label: "1천만원", name: "deposit_10m", selected: deposit === 10_000_000, onSelect: () => setValue("deposit", 10_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "5천만원", name: "deposit_50m", selected: deposit === 50_000_000, onSelect: () => setValue("deposit", 50_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "1억원", name: "deposit_100m", selected: deposit === 100_000_000, onSelect: () => setValue("deposit", 100_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "deposit_custom", selected: ![0, 10_000_000, 50_000_000, 100_000_000].includes(deposit), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="전환율 빠른 선택"
            calculatorType="monthly_rent_conversion"
            options={[
              { label: "4%", name: "conversion_rate_4", selected: conversionRate === 4, onSelect: () => setValue("conversionRate", 4, { shouldDirty: true, shouldValidate: true }) },
              { label: "4.75%", name: "conversion_rate_4_75", selected: conversionRate === 4.75, onSelect: () => setValue("conversionRate", 4.75, { shouldDirty: true, shouldValidate: true }) },
              { label: "5%", name: "conversion_rate_5", selected: conversionRate === 5, onSelect: () => setValue("conversionRate", 5, { shouldDirty: true, shouldValidate: true }) },
              { label: "6%", name: "conversion_rate_6", selected: conversionRate === 6, onSelect: () => setValue("conversionRate", 6, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "conversion_rate_custom", selected: ![4, 4.75, 5, 6].includes(conversionRate), onSelect: () => undefined }
            ]}
          />
        </div>
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
