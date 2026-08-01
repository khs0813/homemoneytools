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
import { calculateJeonseLoan, type RepaymentType } from "@/lib/calculators/loan";
import { trackGrowthEvent } from "@/lib/analytics";
import { buildFragmentPath } from "@/lib/fragment-state";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";
import { saveRecentCalculation } from "@/lib/recent-calculations";

const schema = z.object({
  jeonseDeposit: z.number().finite().min(1, "전세보증금을 입력해 주세요.").max(MAX_SAFE_MONEY_AMOUNT),
  principal: z.number().finite().min(1, "대출금액을 입력해 주세요.").max(MAX_SAFE_MONEY_AMOUNT),
  annualRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  years: z.number().finite().min(0.1).max(MAX_SAFE_YEARS),
  repaymentType: z.enum(["interest-only", "equal-payment", "equal-principal"]),
  guaranteeFeeRate: z.number().finite().min(0).max(10).optional(),
  prepaymentFeeRate: z.number().finite().min(0).max(10).optional()
}).superRefine((values, context) => {
  if (values.principal > values.jeonseDeposit) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["principal"], message: "대출금액은 전세보증금을 초과할 수 없습니다." });
  }
});

type FormValues = z.infer<typeof schema>;

type BaseResult = ReturnType<typeof calculateJeonseLoan>;
type Result = (BaseResult & {
  halfPointUpMonthlyPayment: number;
  halfPointUpMonthlyIncrease: number;
  onePointUpMonthlyPayment: number;
  halfPointUpTotalInterest: number;
  onePointUpTotalInterest: number;
  submitted: FormValues;
}) | null;

const defaultValues: FormValues = {
  jeonseDeposit: 500_000_000,
  principal: 350_000_000,
  annualRate: 4.2,
  years: 2,
  repaymentType: "interest-only",
  guaranteeFeeRate: 0,
  prepaymentFeeRate: 0
};

const analyticsContext = { calculator_type: "jeonse_loan_interest", content_cluster: "housing" };

export function JeonseLoanCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const principal = useWatch({ control, name: "principal" });
  const annualRate = useWatch({ control, name: "annualRate" });
  const years = useWatch({ control, name: "years" });

  useEffect(() => {
    reset({
      ...defaultValues,
      jeonseDeposit: getNumberParam("jeonseDeposit", defaultValues.jeonseDeposit),
      principal: getNumberParam("principal", defaultValues.principal),
      annualRate: getNumberParam("annualRate", defaultValues.annualRate),
      years: getNumberParam("years", defaultValues.years),
      repaymentType: getEnumParam("repaymentType", ["interest-only", "equal-payment", "equal-principal"] as const, defaultValues.repaymentType) as RepaymentType,
      guaranteeFeeRate: getNumberParam("guaranteeFeeRate", defaultValues.guaranteeFeeRate ?? 0),
      prepaymentFeeRate: getNumberParam("prepaymentFeeRate", defaultValues.prepaymentFeeRate ?? 0)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateJeonseLoan(values);
    const halfPointUp = calculateJeonseLoan({ ...values, annualRate: values.annualRate + 0.5 });
    const onePointUp = calculateJeonseLoan({ ...values, annualRate: values.annualRate + 1 });
    setResult({
      ...calculated,
      halfPointUpMonthlyPayment: halfPointUp.monthlyPayment,
      halfPointUpMonthlyIncrease: halfPointUp.monthlyPayment - calculated.monthlyPayment,
      onePointUpMonthlyPayment: onePointUp.monthlyPayment,
      halfPointUpTotalInterest: halfPointUp.totalInterest,
      onePointUpTotalInterest: onePointUp.totalInterest,
      submitted: values
    });
    saveRecentCalculation({
      calculator_type: analyticsContext.calculator_type,
      page_path: "/jeonse-loan-interest-calculator",
      summary: "전세대출 이자 계산 결과"
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
            title="예상 월 납입액"
            value={formatCurrency(result.monthlyPayment)}
            description="입력하신 상환방식 기준 예상 월 납입액이며 참고용입니다."
            basisDate="2026-06-03"
            assumptions={[
              "입력한 대출금액, 금리, 기간, 상환방식을 기존 전세대출 계산 서비스에 그대로 적용합니다.",
              "보증료와 중도상환수수료는 입력한 요율이 있을 때만 참고 금융비용으로 봅니다.",
              "실제 대출 금리와 한도는 금융기관, 보증기관, 신용 조건에 따라 달라질 수 있습니다."
            ]}
          >
            <ResultRow label="월이자" value={formatCurrency(result.monthlyInterestOnly)} />
            <ResultRow label="계약기간 총이자" value={formatCurrency(result.totalInterest)} />
            <ResultRow label="금리 0.5%p 상승 시 월 부담 변화" value={`${formatCurrency(result.halfPointUpMonthlyIncrease)} 증가`} />
            <ResultRow label="전세보증금 대비 대출 비율" value={formatPercent(result.loanToDepositRatio)} />
            <ResultRow label="첫 달 납입액" value={formatCurrency(result.firstMonthlyPayment)} />
            <ResultRow label="마지막 달 납입액" value={formatCurrency(result.lastMonthlyPayment)} />
            <ResultRow label="원금+이자 합계" value={formatCurrency(result.totalPayment)} />
            {result.guaranteeFee > 0 ? <ResultRow label="보증료" value={formatCurrency(result.guaranteeFee)} /> : null}
            <ResultRow label="중도상환수수료 최대 추정" value={formatCurrency(result.prepaymentFee)} />
            <ResultRow label="총 금융비용" value={formatCurrency(result.estimatedBorrowingCost)} />
            <ResultRow label="금리 0.5%p 상승 시 월 납입액" value={`${formatCurrency(result.halfPointUpMonthlyPayment)} · 총이자 ${formatCurrency(result.halfPointUpTotalInterest)}`} />
            <ResultRow label="금리 1.0%p 상승 시 월 납입액" value={`${formatCurrency(result.onePointUpMonthlyPayment)} · 총이자 ${formatCurrency(result.onePointUpTotalInterest)}`} />
            <ShareResult
              title="전세대출 이자 계산 결과"
              text={`전세대출 ${formatCurrency(result.submitted.principal)}\n금리 ${result.submitted.annualRate}%\n예상 월이자 ${formatCurrency(result.monthlyInterestOnly)}\n${result.submitted.years}년 총이자 ${formatCurrency(result.totalInterest)}\n기준일 2026-06-03\n집계산에서 직접 계산`}
              path="/jeonse-loan-interest-calculator"
              fragmentState={result.submitted}
            />
          </ResultSummary>
          <AdFitSlot placement="calculator_result_primary" />
          <RecommendedNextActions
            calculatorType="jeonse_loan_interest"
            actions={[
              {
                href: buildFragmentPath("/rent-vs-jeonse-calculator", {
                  jeonseDeposit: result.submitted.jeonseDeposit,
                  jeonseLoanAmount: result.submitted.principal,
                  jeonseLoanRate: result.submitted.annualRate,
                  years: result.submitted.years
                }),
                title: "같은 기간의 월세와 전세 총비용 비교",
                description: "전세대출 이자와 보증금 기회비용을 월세 조건과 같은 기간으로 비교합니다."
              },
              {
                href: "/monthly-rent-conversion-calculator",
                title: "월세를 전세보증금으로 환산",
                description: "월세 조건이 전세금으로는 어느 정도인지 전환율 기준으로 확인합니다."
              },
              {
                href: result.submitted.principal >= 200_000_000 ? "/guides/200-million-jeonse-loan-monthly-interest" : "/guides/100-million-jeonse-loan-interest",
                title: result.submitted.principal >= 200_000_000 ? "전세대출 2억원의 금리별 월이자 비교" : "전세대출 1억원의 금리별 월이자 비교",
                description: "대표 금액 기준으로 금리별 월 부담과 총이자 차이를 읽어봅니다."
              }
            ]}
          />
        </>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="mb-6 grid gap-3">
          <QuickPresetGroup
            label="대출금액 빠른 선택"
            calculatorType="jeonse_loan_interest"
            options={[
              { label: "1억원", name: "principal_100m", selected: principal === 100_000_000, onSelect: () => setValue("principal", 100_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "2억원", name: "principal_200m", selected: principal === 200_000_000, onSelect: () => setValue("principal", 200_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "3억원", name: "principal_300m", selected: principal === 300_000_000, onSelect: () => setValue("principal", 300_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "principal_custom", selected: ![100_000_000, 200_000_000, 300_000_000].includes(principal), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="금리 빠른 선택"
            calculatorType="jeonse_loan_interest"
            options={[
              { label: "3%", name: "rate_3", selected: annualRate === 3, onSelect: () => setValue("annualRate", 3, { shouldDirty: true, shouldValidate: true }) },
              { label: "4%", name: "rate_4", selected: annualRate === 4, onSelect: () => setValue("annualRate", 4, { shouldDirty: true, shouldValidate: true }) },
              { label: "5%", name: "rate_5", selected: annualRate === 5, onSelect: () => setValue("annualRate", 5, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "rate_custom", selected: ![3, 4, 5].includes(annualRate), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="기간 빠른 선택"
            calculatorType="jeonse_loan_interest"
            options={[
              { label: "1년", name: "years_1", selected: years === 1, onSelect: () => setValue("years", 1, { shouldDirty: true, shouldValidate: true }) },
              { label: "2년", name: "years_2", selected: years === 2, onSelect: () => setValue("years", 2, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "years_custom", selected: ![1, 2].includes(years), onSelect: () => undefined }
            ]}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="jeonseDeposit" control={control} render={({ field }) => <MoneyInput label="전세보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="principal" control={control} render={({ field }) => <MoneyInput label="대출금액" required value={field.value} onChange={field.onChange} helper="전세보증금 이하로 입력" />} />
          <Controller name="annualRate" control={control} render={({ field }) => <PercentInput label="연이율" required value={field.value} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="대출기간" required suffix="년" value={field.value} onChange={field.onChange} min={0.1} max={50} step={0.5} />} />
          <Controller
            name="repaymentType"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">상환방식</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="interest-only">만기일시상환</option>
                  <option value="equal-payment">원리금균등상환</option>
                  <option value="equal-principal">원금균등상환</option>
                </select>
              </label>
            )}
          />
          <Controller name="guaranteeFeeRate" control={control} render={({ field }) => <PercentInput label="연 보증료율" value={field.value ?? 0} onChange={field.onChange} helper="대출기간 전체의 단순 추정 보증료 계산" min={0} max={10} />} />
          <Controller name="prepaymentFeeRate" control={control} render={({ field }) => <PercentInput label="중도상환수수료율" value={field.value ?? 0} onChange={field.onChange} helper="잔존기간 감면 전 최대 추정치" min={0} max={10} />} />
        </div>
        <FormErrorSummary messages={[errors.jeonseDeposit?.message, errors.principal?.message]} />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">전세대출 이자 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
