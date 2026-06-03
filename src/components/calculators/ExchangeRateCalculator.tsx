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
import { calculateExchangeRate } from "@/lib/calculators/finance";
import { formatCurrency, formatKoreanMoney, formatNumber } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  krwAmount: z.number().finite().min(0),
  exchangeRate: z.number().finite().min(0.0001),
  feeRate: z.number().finite().min(0),
  backExchangeRate: z.number().finite().min(0.0001)
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateExchangeRate> | null;

const defaultValues: FormValues = {
  krwAmount: 1_300_000,
  exchangeRate: 1350,
  feeRate: 1,
  backExchangeRate: 1360
};

export function ExchangeRateCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      krwAmount: getNumberParam("krwAmount", defaultValues.krwAmount),
      exchangeRate: getNumberParam("exchangeRate", defaultValues.exchangeRate),
      feeRate: getNumberParam("feeRate", defaultValues.feeRate),
      backExchangeRate: getNumberParam("backExchangeRate", defaultValues.backExchangeRate)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    setResult(calculateExchangeRate(values));
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 외화 수령액" value={`${formatNumber(result.foreignAfterFee)} 외화`} description={`재환산 시 ${formatKoreanMoney(result.backToKrw)}입니다.`}>
          <ResultRow label="수수료 전 외화" value={`${formatNumber(result.foreignAmount)} 외화`} />
          <ResultRow label="수수료 차감 외화" value={`${formatNumber(result.feeAmountForeign)} 외화`} />
          <ResultRow label="왕복 환산 차이" value={formatCurrency(result.roundTripDifference)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="krwAmount" control={control} render={({ field }) => <MoneyInput label="원화 금액" required value={field.value} onChange={field.onChange} />} />
          <Controller name="exchangeRate" control={control} render={({ field }) => <NumberInput label="적용 환율" required value={field.value} onChange={field.onChange} />} />
          <Controller name="feeRate" control={control} render={({ field }) => <PercentInput label="환전 수수료율" value={field.value} onChange={field.onChange} />} />
          <Controller name="backExchangeRate" control={control} render={({ field }) => <NumberInput label="재환산 환율" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">환율 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
