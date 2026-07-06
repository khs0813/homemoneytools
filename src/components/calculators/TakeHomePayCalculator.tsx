"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { calculateTakeHomePay } from "@/lib/calculators/finance";
import { formatKoreanMoney, formatPercent } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  annualSalary: z.number().finite().min(0),
  annualBonus: z.number().finite().min(0),
  monthlyNonTaxable: z.number().finite().min(0),
  dependents: z.number().finite().min(1).max(10),
  childrenUnder20: z.number().finite().min(0).max(10)
});

type FormValues = z.infer<typeof schema>;

type Result = ReturnType<typeof calculateTakeHomePay> | null;

const defaultValues: FormValues = {
  annualSalary: 50_000_000,
  annualBonus: 0,
  monthlyNonTaxable: 200_000,
  dependents: 1,
  childrenUnder20: 0
};

export function TakeHomePayCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      annualSalary: getNumberParam("annualSalary", defaultValues.annualSalary),
      annualBonus: getNumberParam("annualBonus", defaultValues.annualBonus),
      monthlyNonTaxable: getNumberParam("monthlyNonTaxable", defaultValues.monthlyNonTaxable),
      dependents: getNumberParam("dependents", defaultValues.dependents),
      childrenUnder20: getNumberParam("childrenUnder20", defaultValues.childrenUnder20)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateTakeHomePay(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 월 실수령액" value={formatKoreanMoney(result.monthlyNet)} description={`월 공제율은 약 ${formatPercent(result.deductionRate)}입니다.`}>
          <ResultRow label="세전 월급" value={formatKoreanMoney(result.grossMonthly)} />
          <ResultRow label="월 공제 합계" value={formatKoreanMoney(result.monthlyDeductions)} />
          <ResultRow label="국민연금" value={formatKoreanMoney(result.nationalPension)} />
          <ResultRow label="건강보험+장기요양" value={formatKoreanMoney(result.healthInsurance + result.longTermCare)} />
          <ResultRow label="고용보험" value={formatKoreanMoney(result.employmentInsurance)} />
          <ResultRow label="소득세+지방소득세" value={formatKoreanMoney(result.incomeTax + result.localIncomeTax)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="annualSalary" control={control} render={({ field }) => <MoneyInput label="연봉" required value={field.value} onChange={field.onChange} />} />
          <Controller name="annualBonus" control={control} render={({ field }) => <MoneyInput label="연간 상여금" value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyNonTaxable" control={control} render={({ field }) => <MoneyInput label="월 비과세 수당" value={field.value} onChange={field.onChange} helper="예: 식대" />} />
          <Controller name="dependents" control={control} render={({ field }) => <NumberInput label="부양가족 수" value={field.value} onChange={field.onChange} min={1} max={10} suffix="명" />} />
          <Controller name="childrenUnder20" control={control} render={({ field }) => <NumberInput label="20세 이하 자녀 수" value={field.value} onChange={field.onChange} min={0} max={10} suffix="명" />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">실수령액 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
