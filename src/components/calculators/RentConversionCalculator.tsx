"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { calculateRentConversion, type RentConversionType } from "@/lib/calculators/rent-conversion";
import { formatKoreanMoney } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  type: z.enum(["jeonse-to-rent", "rent-to-jeonse"]),
  jeonseAmount: z.number().finite().min(0).optional(),
  deposit: z.number().finite().min(0),
  monthlyRent: z.number().finite().min(0).optional(),
  conversionRate: z.number().finite().min(0.01),
  years: z.number().finite().min(0.1)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateRentConversion> | null;

const defaultValues: FormValues = {
  type: "jeonse-to-rent",
  jeonseAmount: 500_000_000,
  deposit: 100_000_000,
  monthlyRent: 1_500_000,
  conversionRate: 5,
  years: 2
};

export function RentConversionCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    reset({
      ...defaultValues,
      type: getEnumParam("type", ["jeonse-to-rent", "rent-to-jeonse"] as const, defaultValues.type) as RentConversionType,
      jeonseAmount: getNumberParam("jeonseAmount", defaultValues.jeonseAmount ?? 0),
      deposit: getNumberParam("deposit", defaultValues.deposit),
      monthlyRent: getNumberParam("monthlyRent", defaultValues.monthlyRent ?? 0),
      conversionRate: getNumberParam("conversionRate", defaultValues.conversionRate),
      years: getNumberParam("years", defaultValues.years)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateRentConversion(values);
    setResult(calculated);
    writeQueryState(values);
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">계산 유형</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="jeonse-to-rent">전세 → 월세</option>
                  <option value="rent-to-jeonse">월세 → 전세</option>
                </select>
              </label>
            )}
          />
          {type === "jeonse-to-rent" ? (
            <Controller name="jeonseAmount" control={control} render={({ field }) => <MoneyInput label="전세금" required value={field.value ?? 0} onChange={field.onChange} />} />
          ) : (
            <Controller name="monthlyRent" control={control} render={({ field }) => <MoneyInput label="월세" required value={field.value ?? 0} onChange={field.onChange} />} />
          )}
          <Controller name="deposit" control={control} render={({ field }) => <MoneyInput label="보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="conversionRate" control={control} render={({ field }) => <PercentInput label="전월세 전환율" required value={field.value} onChange={field.onChange} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="비교 기간" suffix="년" value={field.value} onChange={field.onChange} step={0.5} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">월세 환산 계산하기</button>
      </form>

      {result ? (
        <ResultCard title={result.type === "jeonse-to-rent" ? "예상 월세" : "전세 환산 금액"} value={result.type === "jeonse-to-rent" ? formatKoreanMoney(result.monthlyRent) : formatKoreanMoney(result.jeonseEquivalent)} description={`${result.years}년 기준 총 월세는 ${formatKoreanMoney(result.totalRentForPeriod)}입니다.`}>
          <ResultRow label="예상 월세" value={formatKoreanMoney(result.monthlyRent)} />
          <ResultRow label="전세 환산 금액" value={formatKoreanMoney(result.jeonseEquivalent)} />
          <ResultRow label="기간 내 월세 총액" value={formatKoreanMoney(result.totalRentForPeriod)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    </div>
  );
}
