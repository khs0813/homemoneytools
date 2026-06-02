"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateJeonseLoan, type RepaymentType } from "@/lib/calculators/loan";
import { formatCurrency, formatKoreanMoney, formatPercent } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  jeonseDeposit: z.number().finite().min(1),
  principal: z.number().finite().min(1),
  annualRate: z.number().finite().min(0),
  years: z.number().finite().min(0.1),
  repaymentType: z.enum(["interest-only", "equal-payment", "equal-principal"]),
  guaranteeFeeRate: z.number().finite().min(0).optional(),
  prepaymentFeeRate: z.number().finite().min(0).optional()
});

type FormValues = z.infer<typeof schema>;

type Result = ReturnType<typeof calculateJeonseLoan> | null;

const defaultValues: FormValues = {
  jeonseDeposit: 500_000_000,
  principal: 350_000_000,
  annualRate: 4.2,
  years: 2,
  repaymentType: "interest-only",
  guaranteeFeeRate: 0,
  prepaymentFeeRate: 0
};

export function JeonseLoanCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

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
    setResult(calculated);
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 월 납입액" value={formatCurrency(result.monthlyPayment)} description="입력하신 상환방식 기준 예상 월 납입액입니다.">
          <ResultRow label="월 이자만 낼 경우" value={formatCurrency(result.monthlyInterestOnly)} />
          <ResultRow label="첫 달 납입액" value={formatCurrency(result.firstMonthlyPayment)} />
          <ResultRow label="마지막 달 납입액" value={formatCurrency(result.lastMonthlyPayment)} />
          <ResultRow label="총 이자" value={formatKoreanMoney(result.totalInterest)} />
          <ResultRow label="총 납입액" value={formatKoreanMoney(result.totalPayment)} />
          <ResultRow label="예상 보증료" value={formatCurrency(result.guaranteeFee)} />
          <ResultRow label="전세금 대비 대출비율" value={formatPercent(result.loanToDepositRatio)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="jeonseDeposit" control={control} render={({ field }) => <MoneyInput label="전세보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="principal" control={control} render={({ field }) => <MoneyInput label="대출금액" required value={field.value} onChange={field.onChange} helper="전세대출로 실제 빌리는 금액" />} />
          <Controller name="annualRate" control={control} render={({ field }) => <PercentInput label="연이율" required value={field.value} onChange={field.onChange} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="대출기간" required suffix="년" value={field.value} onChange={field.onChange} step={0.5} />} />
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
          <Controller name="guaranteeFeeRate" control={control} render={({ field }) => <PercentInput label="보증료율" value={field.value ?? 0} onChange={field.onChange} helper="선택 입력" />} />
          <Controller name="prepaymentFeeRate" control={control} render={({ field }) => <PercentInput label="중도상환수수료율" value={field.value ?? 0} onChange={field.onChange} helper="선택 입력" />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">전세대출 이자 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
