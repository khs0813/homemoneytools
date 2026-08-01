"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErrorSummary } from "@/components/calculator/FormErrorSummary";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { RecommendedNextActions } from "@/components/calculator/RecommendedNextActions";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareResult } from "@/components/calculator/ShareResult";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { trackGrowthEvent } from "@/lib/analytics";
import { calculateRentVsJeonse } from "@/lib/calculators/rent-vs-jeonse";
import { buildFragmentPath } from "@/lib/fragment-state";
import { formatCurrency, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";
import { saveRecentCalculation } from "@/lib/recent-calculations";

const schema = z.object({
  jeonseDeposit: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  rentDeposit: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  monthlyRent: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  years: z.number().finite().min(0.1).max(MAX_SAFE_YEARS),
  savingRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  jeonseLoanRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  jeonseLoanAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  rentGrowthRate: z.number().finite().min(0).max(30).optional(),
  guaranteeFee: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  brokerageFee: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  movingCost: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional()
}).superRefine((values, context) => {
  if (values.jeonseLoanAmount > values.jeonseDeposit) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["jeonseLoanAmount"], message: "전세대출금액은 전세보증금을 초과할 수 없습니다." });
  }
});

type FormValues = z.infer<typeof schema>;
type BaseResult = ReturnType<typeof calculateRentVsJeonse>;
type Result = (BaseResult & {
  guaranteeFee: number;
  brokerageFee: number;
  movingCost: number;
  jeonseAllInCost: number;
  rentAllInCost: number;
  jeonseMonthlyCost: number;
  rentMonthlyCost: number;
  breakEvenMonthlyRent: number;
  allInDifference: number;
  allInWinner: BaseResult["winner"];
  submitted: FormValues;
}) | null;

const defaultValues: FormValues = {
  jeonseDeposit: 500_000_000,
  rentDeposit: 100_000_000,
  monthlyRent: 1_200_000,
  years: 2,
  savingRate: 3.5,
  jeonseLoanRate: 4.2,
  jeonseLoanAmount: 250_000_000,
  rentGrowthRate: 0,
  guaranteeFee: 0,
  brokerageFee: 0,
  movingCost: 0
};

const analyticsContext = { calculator_type: "rent_vs_jeonse", content_cluster: "housing" };

export function RentVsJeonseCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      jeonseDeposit: getNumberParam("jeonseDeposit", defaultValues.jeonseDeposit),
      rentDeposit: getNumberParam("rentDeposit", defaultValues.rentDeposit),
      monthlyRent: getNumberParam("monthlyRent", defaultValues.monthlyRent),
      years: getNumberParam("years", defaultValues.years),
      savingRate: getNumberParam("savingRate", defaultValues.savingRate),
      jeonseLoanRate: getNumberParam("jeonseLoanRate", defaultValues.jeonseLoanRate),
      jeonseLoanAmount: getNumberParam("jeonseLoanAmount", defaultValues.jeonseLoanAmount),
      rentGrowthRate: getNumberParam("rentGrowthRate", defaultValues.rentGrowthRate ?? 0),
      guaranteeFee: getNumberParam("guaranteeFee", defaultValues.guaranteeFee ?? 0),
      brokerageFee: getNumberParam("brokerageFee", defaultValues.brokerageFee ?? 0),
      movingCost: getNumberParam("movingCost", defaultValues.movingCost ?? 0)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateRentVsJeonse(values);
    const guaranteeFee = values.guaranteeFee ?? 0;
    const brokerageFee = values.brokerageFee ?? 0;
    const movingCost = values.movingCost ?? 0;
    const months = values.years * 12;
    const jeonseAllInCost = calculated.jeonseTotalCost + guaranteeFee + brokerageFee + movingCost;
    const rentAllInCost = calculated.rentTotalCost + brokerageFee + movingCost;
    const signedAllInDifference = rentAllInCost - jeonseAllInCost;
    setResult({
      ...calculated,
      guaranteeFee,
      brokerageFee,
      movingCost,
      jeonseAllInCost,
      rentAllInCost,
      jeonseMonthlyCost: months > 0 ? jeonseAllInCost / months : 0,
      rentMonthlyCost: months > 0 ? rentAllInCost / months : 0,
      breakEvenMonthlyRent: months > 0 ? Math.max(0, (jeonseAllInCost - calculated.rentDepositOpportunityCost - brokerageFee - movingCost) / months) : 0,
      allInDifference: Math.abs(signedAllInDifference),
      allInWinner: signedAllInDifference > 0 ? "jeonse" : signedAllInDifference < 0 ? "rent" : "same",
      submitted: values
    });
    saveRecentCalculation({
      calculator_type: analyticsContext.calculator_type,
      page_path: "/rent-vs-jeonse-calculator",
      summary: "월세와 전세 총주거비 비교 결과"
    });
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(values);
  }

  const winnerText = result?.allInWinner === "jeonse" ? "전세가 유리합니다" : result?.allInWinner === "rent" ? "월세가 유리합니다" : "전세와 월세가 비슷합니다";

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <>
          <ResultCard title={winnerText} value={formatCurrency(result.allInDifference)} description={`입력한 일회성 비용까지 포함한 비교기간 전체 차이입니다.`}>
            <ResultRow label="전세대출 이자" value={formatCurrency(result.jeonseLoanInterest)} />
            <ResultRow label="전세보증금 자기자본 기회비용" value={formatCurrency(result.jeonseOpportunityCost)} />
            <ResultRow label="월세 총액" value={formatCurrency(result.monthlyRentTotal)} />
            <ResultRow label="월세보증금 기회비용" value={formatCurrency(result.rentDepositOpportunityCost)} />
            <ResultRow label="보증료" value={formatCurrency(result.guaranteeFee)} />
            <ResultRow label="중개보수" value={formatCurrency(result.brokerageFee)} />
            <ResultRow label="이사비" value={formatCurrency(result.movingCost)} />
            <ResultRow label="전세 2년 총주거비" value={formatCurrency(result.jeonseAllInCost)} />
            <ResultRow label="월세 2년 총주거비" value={formatCurrency(result.rentAllInCost)} />
            <ResultRow label="전세 월 환산 비용" value={formatCurrency(result.jeonseMonthlyCost)} />
            <ResultRow label="월세 월 환산 비용" value={formatCurrency(result.rentMonthlyCost)} />
            <ResultRow label="손익분기 월세" value={formatCurrency(result.breakEvenMonthlyRent)} />
            <ShareResult
              title="월세와 전세 총주거비 비교 결과"
              text={`${winnerText}\n비교 차이 ${formatCurrency(result.allInDifference)}\n전세 총주거비 ${formatCurrency(result.jeonseAllInCost)}\n월세 총주거비 ${formatCurrency(result.rentAllInCost)}\n집계산에서 직접 계산`}
              path="/rent-vs-jeonse-calculator"
              fragmentState={result.submitted}
            />
          </ResultCard>
          <RecommendedNextActions
            calculatorType="rent_vs_jeonse"
            actions={[
              {
                href: buildFragmentPath("/jeonse-loan-interest-calculator", {
                  jeonseDeposit: result.submitted.jeonseDeposit,
                  principal: result.submitted.jeonseLoanAmount,
                  annualRate: result.submitted.jeonseLoanRate,
                  years: result.submitted.years
                }),
                title: "전세대출 월이자 다시 확인",
                description: "전세 선택 시 대출 이자와 금리 상승 시나리오를 따로 점검합니다."
              },
              {
                href: buildFragmentPath("/monthly-rent-conversion-calculator", {
                  type: "rent-to-jeonse",
                  deposit: result.submitted.rentDeposit,
                  monthlyRent: result.submitted.monthlyRent,
                  years: result.submitted.years
                }),
                title: "월세 조건을 전세금으로 환산",
                description: "월세와 보증금 조건이 전세금으로는 어느 정도인지 확인합니다."
              },
              {
                href: "/guides/jeonse-total-housing-cost",
                title: "전세 총주거비 해석 읽기",
                description: "보증금 기회비용과 대출이자를 함께 보는 기준을 정리했습니다."
              }
            ]}
          />
        </>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="jeonseDeposit" control={control} render={({ field }) => <MoneyInput label="전세보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="rentDeposit" control={control} render={({ field }) => <MoneyInput label="월세보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyRent" control={control} render={({ field }) => <MoneyInput label="월세" required value={field.value} onChange={field.onChange} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="비교기간" required suffix="년" value={field.value} onChange={field.onChange} min={0.1} max={30} step={0.5} />} />
          <Controller name="savingRate" control={control} render={({ field }) => <PercentInput label="예금금리" required value={field.value} onChange={field.onChange} helper="보증금 기회비용은 단리로 추정" min={0} max={30} />} />
          <Controller name="jeonseLoanRate" control={control} render={({ field }) => <PercentInput label="전세대출금리" value={field.value} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="jeonseLoanAmount" control={control} render={({ field }) => <MoneyInput label="전세대출금액" value={field.value} onChange={field.onChange} helper="전세보증금 이하로 입력" />} />
          <Controller name="rentGrowthRate" control={control} render={({ field }) => <PercentInput label="연 월세 상승률" value={field.value ?? 0} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="guaranteeFee" control={control} render={({ field }) => <MoneyInput label="보증료" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="brokerageFee" control={control} render={({ field }) => <MoneyInput label="중개보수" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="movingCost" control={control} render={({ field }) => <MoneyInput label="이사비" value={field.value ?? 0} onChange={field.onChange} />} />
        </div>
        <FormErrorSummary messages={[errors.jeonseLoanAmount?.message]} />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">월세와 전세 비교하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
