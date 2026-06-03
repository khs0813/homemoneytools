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
import { calculateCarMaintenanceCost } from "@/lib/calculators/finance";
import { formatCurrency, formatKoreanMoney } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  monthlyDistanceKm: z.number().finite().min(0),
  fuelEfficiencyKmPerL: z.number().finite().min(0.1),
  fuelPricePerL: z.number().finite().min(0),
  annualInsurance: z.number().finite().min(0),
  annualTax: z.number().finite().min(0),
  monthlyParking: z.number().finite().min(0),
  monthlyToll: z.number().finite().min(0),
  monthlyMaintenanceReserve: z.number().finite().min(0),
  monthlyInstallment: z.number().finite().min(0)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateCarMaintenanceCost> | null;

const defaultValues: FormValues = {
  monthlyDistanceKm: 1200,
  fuelEfficiencyKmPerL: 12,
  fuelPricePerL: 1700,
  annualInsurance: 1_200_000,
  annualTax: 400_000,
  monthlyParking: 100_000,
  monthlyToll: 50_000,
  monthlyMaintenanceReserve: 70_000,
  monthlyInstallment: 0
};

export function CarMaintenanceCostCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      monthlyDistanceKm: getNumberParam("monthlyDistanceKm", defaultValues.monthlyDistanceKm),
      fuelEfficiencyKmPerL: getNumberParam("fuelEfficiencyKmPerL", defaultValues.fuelEfficiencyKmPerL),
      fuelPricePerL: getNumberParam("fuelPricePerL", defaultValues.fuelPricePerL),
      annualInsurance: getNumberParam("annualInsurance", defaultValues.annualInsurance),
      annualTax: getNumberParam("annualTax", defaultValues.annualTax),
      monthlyParking: getNumberParam("monthlyParking", defaultValues.monthlyParking),
      monthlyToll: getNumberParam("monthlyToll", defaultValues.monthlyToll),
      monthlyMaintenanceReserve: getNumberParam("monthlyMaintenanceReserve", defaultValues.monthlyMaintenanceReserve),
      monthlyInstallment: getNumberParam("monthlyInstallment", defaultValues.monthlyInstallment)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateCarMaintenanceCost(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="월 자동차 유지비" value={formatKoreanMoney(result.totalMonthlyCost)} description={`연간 기준으로는 ${formatKoreanMoney(result.annualCost)}입니다.`}>
          <ResultRow label="월 유류비" value={formatKoreanMoney(result.monthlyFuelCost)} />
          <ResultRow label="보험료 월환산" value={formatKoreanMoney(result.monthlyInsurance)} />
          <ResultRow label="자동차세 월환산" value={formatKoreanMoney(result.monthlyTax)} />
          <ResultRow label="km당 비용" value={formatCurrency(result.costPerKm)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="monthlyDistanceKm" control={control} render={({ field }) => <NumberInput label="월 주행거리" required value={field.value} onChange={field.onChange} suffix="km" />} />
          <Controller name="fuelEfficiencyKmPerL" control={control} render={({ field }) => <NumberInput label="연비" required value={field.value} onChange={field.onChange} suffix="km/L" step={0.1} />} />
          <Controller name="fuelPricePerL" control={control} render={({ field }) => <NumberInput label="리터당 유가" required value={field.value} onChange={field.onChange} suffix="원" />} />
          <Controller name="annualInsurance" control={control} render={({ field }) => <MoneyInput label="연 보험료" value={field.value} onChange={field.onChange} />} />
          <Controller name="annualTax" control={control} render={({ field }) => <MoneyInput label="연 자동차세" value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyParking" control={control} render={({ field }) => <MoneyInput label="월 주차비" value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyToll" control={control} render={({ field }) => <MoneyInput label="월 통행료" value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyMaintenanceReserve" control={control} render={({ field }) => <MoneyInput label="월 정비 적립금" value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyInstallment" control={control} render={({ field }) => <MoneyInput label="월 할부금" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">자동차 유지비 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
