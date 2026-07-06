"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { calculateMonthlyLivingExpense } from "@/lib/calculators/finance";
import { formatKoreanMoney, formatPercent } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  monthlyNetIncome: z.number().finite().min(0),
  housing: z.number().finite().min(0),
  food: z.number().finite().min(0),
  transportation: z.number().finite().min(0),
  telecom: z.number().finite().min(0),
  insurance: z.number().finite().min(0),
  education: z.number().finite().min(0),
  leisure: z.number().finite().min(0),
  debt: z.number().finite().min(0),
  miscellaneous: z.number().finite().min(0)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateMonthlyLivingExpense> | null;

const defaultValues: FormValues = {
  monthlyNetIncome: 3_200_000,
  housing: 900_000,
  food: 600_000,
  transportation: 200_000,
  telecom: 120_000,
  insurance: 250_000,
  education: 0,
  leisure: 250_000,
  debt: 300_000,
  miscellaneous: 200_000
};

export function MonthlyLivingExpenseCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      monthlyNetIncome: getNumberParam("monthlyNetIncome", defaultValues.monthlyNetIncome),
      housing: getNumberParam("housing", defaultValues.housing),
      food: getNumberParam("food", defaultValues.food),
      transportation: getNumberParam("transportation", defaultValues.transportation),
      telecom: getNumberParam("telecom", defaultValues.telecom),
      insurance: getNumberParam("insurance", defaultValues.insurance),
      education: getNumberParam("education", defaultValues.education),
      leisure: getNumberParam("leisure", defaultValues.leisure),
      debt: getNumberParam("debt", defaultValues.debt),
      miscellaneous: getNumberParam("miscellaneous", defaultValues.miscellaneous)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateMonthlyLivingExpense(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="월 총생활비" value={formatKoreanMoney(result.totalExpense)} description={`실수령 대비 ${formatPercent(result.expenseRate)}가 지출됩니다.`}>
          <ResultRow label="주거비" value={formatKoreanMoney(result.categories.housing)} />
          <ResultRow label="식비" value={formatKoreanMoney(result.categories.food)} />
          <ResultRow label="부채상환" value={formatKoreanMoney(result.categories.debt)} />
          <ResultRow label="잔여자금" value={formatKoreanMoney(result.remaining)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="monthlyNetIncome" control={control} render={({ field }) => <MoneyInput label="월 실수령 소득" required value={field.value} onChange={field.onChange} />} />
          <Controller name="housing" control={control} render={({ field }) => <MoneyInput label="주거비" value={field.value} onChange={field.onChange} />} />
          <Controller name="food" control={control} render={({ field }) => <MoneyInput label="식비" value={field.value} onChange={field.onChange} />} />
          <Controller name="transportation" control={control} render={({ field }) => <MoneyInput label="교통비" value={field.value} onChange={field.onChange} />} />
          <Controller name="telecom" control={control} render={({ field }) => <MoneyInput label="통신비" value={field.value} onChange={field.onChange} />} />
          <Controller name="insurance" control={control} render={({ field }) => <MoneyInput label="보험료" value={field.value} onChange={field.onChange} />} />
          <Controller name="education" control={control} render={({ field }) => <MoneyInput label="교육비" value={field.value} onChange={field.onChange} />} />
          <Controller name="leisure" control={control} render={({ field }) => <MoneyInput label="여가비" value={field.value} onChange={field.onChange} />} />
          <Controller name="debt" control={control} render={({ field }) => <MoneyInput label="부채상환" value={field.value} onChange={field.onChange} />} />
          <Controller name="miscellaneous" control={control} render={({ field }) => <MoneyInput label="기타지출" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">월 생활비 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
