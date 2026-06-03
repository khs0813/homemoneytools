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
import { calculateSeverancePay } from "@/lib/calculators/finance";
import { formatKoreanMoney } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  averageMonthlyWage: z.number().finite().min(1),
  years: z.number().finite().min(0),
  extraMonths: z.number().finite().min(0).max(11),
  taxRate: z.number().finite().min(0).max(100)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateSeverancePay> | null;

const defaultValues: FormValues = {
  averageMonthlyWage: 3_500_000,
  years: 5,
  extraMonths: 0,
  taxRate: 3
};

export function SeverancePayCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      averageMonthlyWage: getNumberParam("averageMonthlyWage", defaultValues.averageMonthlyWage),
      years: getNumberParam("years", defaultValues.years),
      extraMonths: getNumberParam("extraMonths", defaultValues.extraMonths),
      taxRate: getNumberParam("taxRate", defaultValues.taxRate)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateSeverancePay(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 퇴직금" value={formatKoreanMoney(result.grossSeverance)} description={`세후 추정액은 ${formatKoreanMoney(result.netSeverance)}입니다.`}>
          <ResultRow label="근속연수" value={`${result.serviceYears}년`} />
          <ResultRow label="예상 세금" value={formatKoreanMoney(result.estimatedTax)} />
          <ResultRow label="세후 추정액" value={formatKoreanMoney(result.netSeverance)} />
          <ResultRow label="월 적립 감각" value={formatKoreanMoney(result.monthlyReserveEquivalent)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="averageMonthlyWage" control={control} render={({ field }) => <MoneyInput label="평균 월임금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="근속연수" required value={field.value} onChange={field.onChange} suffix="년" />} />
          <Controller name="extraMonths" control={control} render={({ field }) => <NumberInput label="추가 근속개월" value={field.value} onChange={field.onChange} suffix="개월" min={0} max={11} />} />
          <Controller name="taxRate" control={control} render={({ field }) => <PercentInput label="퇴직소득세율 가정" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">퇴직금 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
