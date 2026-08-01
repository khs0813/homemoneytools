"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { calculateJeonseLoan, type RepaymentType } from "@/lib/calculators/loan";
import { trackGrowthEvent } from "@/lib/analytics";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

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
  onePointUpMonthlyPayment: number;
  halfPointUpTotalInterest: number;
  onePointUpTotalInterest: number;
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
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

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
      onePointUpMonthlyPayment: onePointUp.monthlyPayment,
      halfPointUpTotalInterest: halfPointUp.totalInterest,
      onePointUpTotalInterest: onePointUp.totalInterest
    });
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 월 납입액" value={formatCurrency(result.monthlyPayment)} description="입력하신 상환방식 기준 예상 월 납입액이며 참고용입니다.">
          <ResultRow label="월이자" value={formatCurrency(result.monthlyInterestOnly)} />
          <ResultRow label="첫 달 납입액" value={formatCurrency(result.firstMonthlyPayment)} />
          <ResultRow label="마지막 달 납입액" value={formatCurrency(result.lastMonthlyPayment)} />
          <ResultRow label="계약기간 총이자" value={formatCurrency(result.totalInterest)} />
          <ResultRow label="원금+이자 합계" value={formatCurrency(result.totalPayment)} />
          <ResultRow label="보증료" value={formatCurrency(result.guaranteeFee)} />
          <ResultRow label="중도상환수수료 최대 추정" value={formatCurrency(result.prepaymentFee)} />
          <ResultRow label="총 금융비용" value={formatCurrency(result.estimatedBorrowingCost)} />
          <ResultRow label="금리 0.5%p 상승 시 월 납입액" value={`${formatCurrency(result.halfPointUpMonthlyPayment)} · 총이자 ${formatCurrency(result.halfPointUpTotalInterest)}`} />
          <ResultRow label="금리 1.0%p 상승 시 월 납입액" value={`${formatCurrency(result.onePointUpMonthlyPayment)} · 총이자 ${formatCurrency(result.onePointUpTotalInterest)}`} />
          <ResultRow label="전세보증금 대비 대출 비율" value={formatPercent(result.loanToDepositRatio)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
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
