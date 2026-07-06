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
import { calculateOverseasStockTax } from "@/lib/calculators/finance";
import { formatKoreanMoney } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  buyPrice: z.number().finite().min(0),
  sellPrice: z.number().finite().min(0),
  shares: z.number().finite().min(0),
  buyRate: z.number().finite().min(0.0001),
  sellRate: z.number().finite().min(0.0001),
  fees: z.number().finite().min(0)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateOverseasStockTax> | null;

const defaultValues: FormValues = {
  buyPrice: 150,
  sellPrice: 200,
  shares: 100,
  buyRate: 1300,
  sellRate: 1350,
  fees: 50_000
};

export function OverseasStockTaxCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      buyPrice: getNumberParam("buyPrice", defaultValues.buyPrice),
      sellPrice: getNumberParam("sellPrice", defaultValues.sellPrice),
      shares: getNumberParam("shares", defaultValues.shares),
      buyRate: getNumberParam("buyRate", defaultValues.buyRate),
      sellRate: getNumberParam("sellRate", defaultValues.sellRate),
      fees: getNumberParam("fees", defaultValues.fees)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateOverseasStockTax(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 양도세" value={formatKoreanMoney(result.estimatedTax)} description={`과세표준은 ${formatKoreanMoney(result.taxableGain)}입니다.`}>
          <ResultRow label="원화 기준 취득금액" value={formatKoreanMoney(result.purchaseAmountKrw)} />
          <ResultRow label="원화 기준 매도금액" value={formatKoreanMoney(result.saleAmountKrw)} />
          <ResultRow label="양도차익" value={formatKoreanMoney(result.capitalGain)} />
          <ResultRow label="기본공제" value={formatKoreanMoney(result.deduction)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="buyPrice" control={control} render={({ field }) => <NumberInput label="매수 단가(외화)" required value={field.value} onChange={field.onChange} />} />
          <Controller name="sellPrice" control={control} render={({ field }) => <NumberInput label="매도 단가(외화)" required value={field.value} onChange={field.onChange} />} />
          <Controller name="shares" control={control} render={({ field }) => <NumberInput label="수량" required value={field.value} onChange={field.onChange} />} />
          <Controller name="buyRate" control={control} render={({ field }) => <NumberInput label="매수 환율" required value={field.value} onChange={field.onChange} />} />
          <Controller name="sellRate" control={control} render={({ field }) => <NumberInput label="매도 환율" required value={field.value} onChange={field.onChange} />} />
          <Controller name="fees" control={control} render={({ field }) => <MoneyInput label="거래비용" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">해외주식 양도세 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
