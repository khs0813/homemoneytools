"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@/components/calculator/NumberInput";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { calculateAirConditionerCost } from "@/lib/calculators/finance";
import { formatCurrency, formatKoreanMoney } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  powerWatts: z.number().finite().min(0),
  hoursPerDay: z.number().finite().min(0),
  daysPerMonth: z.number().finite().min(0),
  pricePerKwh: z.number().finite().min(0)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateAirConditionerCost> | null;

const defaultValues: FormValues = {
  powerWatts: 1200,
  hoursPerDay: 8,
  daysPerMonth: 30,
  pricePerKwh: 180
};

export function AirConditionerElectricityCostCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      powerWatts: getNumberParam("powerWatts", defaultValues.powerWatts),
      hoursPerDay: getNumberParam("hoursPerDay", defaultValues.hoursPerDay),
      daysPerMonth: getNumberParam("daysPerMonth", defaultValues.daysPerMonth),
      pricePerKwh: getNumberParam("pricePerKwh", defaultValues.pricePerKwh)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateAirConditionerCost(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 월 냉방비" value={formatKoreanMoney(result.estimatedCost)} description={`월 사용량은 ${result.monthlyUsageKwh}kWh 입니다.`}>
          <ResultRow label="하루 평균 비용" value={formatKoreanMoney(result.dailyCost)} />
          <ResultRow label="시간당 비용" value={formatCurrency(result.hourlyCost)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="powerWatts" control={control} render={({ field }) => <NumberInput label="소비전력" required value={field.value} onChange={field.onChange} suffix="W" />} />
          <Controller name="hoursPerDay" control={control} render={({ field }) => <NumberInput label="하루 사용시간" required value={field.value} onChange={field.onChange} suffix="시간" step={0.5} />} />
          <Controller name="daysPerMonth" control={control} render={({ field }) => <NumberInput label="월 사용일수" required value={field.value} onChange={field.onChange} suffix="일" />} />
          <Controller name="pricePerKwh" control={control} render={({ field }) => <NumberInput label="kWh당 단가" required value={field.value} onChange={field.onChange} suffix="원" />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">에어컨 전기세 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
