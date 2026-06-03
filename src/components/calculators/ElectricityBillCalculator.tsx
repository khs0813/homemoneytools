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
import { calculateElectricityBill } from "@/lib/calculators/finance";
import { formatCurrency, formatKoreanMoney } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  monthlyUsageKwh: z.number().finite().min(0),
  season: z.enum(["normal", "summer"])
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateElectricityBill> | null;

const defaultValues: FormValues = {
  monthlyUsageKwh: 350,
  season: "normal"
};

export function ElectricityBillCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      monthlyUsageKwh: getNumberParam("monthlyUsageKwh", defaultValues.monthlyUsageKwh),
      season: getEnumParam("season", ["normal", "summer"] as const, defaultValues.season)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateElectricityBill(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 전기요금" value={formatKoreanMoney(result.total)} description={`평균 체감단가는 ${formatCurrency(result.averageRate)} / kWh 입니다.`}>
          <ResultRow label="기본요금" value={formatKoreanMoney(result.baseFee)} />
          <ResultRow label="전력량요금" value={formatKoreanMoney(result.energyCharge)} />
          <ResultRow label="기후환경요금" value={formatKoreanMoney(result.climateCharge)} />
          <ResultRow label="연료비조정액" value={formatKoreanMoney(result.fuelAdjustment)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="monthlyUsageKwh" control={control} render={({ field }) => <NumberInput label="월 사용량" required value={field.value} onChange={field.onChange} suffix="kWh" />} />
          <Controller
            name="season"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">계절 구분</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="normal">일반철</option>
                  <option value="summer">여름철</option>
                </select>
              </label>
            )}
          />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">전기요금 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
