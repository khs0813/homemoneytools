"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { calculateDividendIncome } from "@/lib/calculators/finance";
import { formatKoreanMoney } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  investmentAmount: z.number().finite().min(0),
  dividendYield: z.number().finite().min(0),
  taxRate: z.number().finite().min(0),
  frequency: z.number().finite().min(1).max(12),
  targetMonthlyDividend: z.number().finite().min(0)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateDividendIncome> | null;

const defaultValues: FormValues = {
  investmentAmount: 100_000_000,
  dividendYield: 4,
  taxRate: 15.4,
  frequency: 4,
  targetMonthlyDividend: 1_000_000
};

export function DividendIncomeCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      investmentAmount: getNumberParam("investmentAmount", defaultValues.investmentAmount),
      dividendYield: getNumberParam("dividendYield", defaultValues.dividendYield),
      taxRate: getNumberParam("taxRate", defaultValues.taxRate),
      frequency: getNumberParam("frequency", defaultValues.frequency),
      targetMonthlyDividend: getNumberParam("targetMonthlyDividend", defaultValues.targetMonthlyDividend)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateDividendIncome(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="세후 월 배당금" value={formatKoreanMoney(result.netMonthlyDividend)} description={`세후 연 배당금은 ${formatKoreanMoney(result.netAnnualDividend)}입니다.`}>
          <ResultRow label="세전 연 배당금" value={formatKoreanMoney(result.grossAnnualDividend)} />
          <ResultRow label="세후 1회 지급액" value={formatKoreanMoney(result.dividendPerPayment)} />
          <ResultRow label="월 목표 달성 필요 원금" value={formatKoreanMoney(result.neededPrincipalForTarget)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="investmentAmount" control={control} render={({ field }) => <MoneyInput label="투자금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="dividendYield" control={control} render={({ field }) => <PercentInput label="배당수익률" required value={field.value} onChange={field.onChange} />} />
          <Controller name="taxRate" control={control} render={({ field }) => <PercentInput label="원천징수세율" value={field.value} onChange={field.onChange} />} />
          <Controller name="frequency" control={control} render={({ field }) => <NumberInput label="연간 지급 횟수" value={field.value} onChange={field.onChange} min={1} max={12} suffix="회" />} />
          <Controller name="targetMonthlyDividend" control={control} render={({ field }) => <MoneyInput label="목표 월 배당금" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">배당금 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
