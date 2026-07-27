"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErrorSummary } from "@/components/calculator/FormErrorSummary";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateRentVsJeonse } from "@/lib/calculators/rent-vs-jeonse";
import { formatCurrency, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  jeonseDeposit: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  rentDeposit: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  monthlyRent: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  years: z.number().finite().min(0.1).max(MAX_SAFE_YEARS),
  savingRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  jeonseLoanRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  jeonseLoanAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  rentGrowthRate: z.number().finite().min(0).max(30).optional()
}).superRefine((values, context) => {
  if (values.jeonseLoanAmount > values.jeonseDeposit) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["jeonseLoanAmount"], message: "전세대출금액은 전세보증금을 초과할 수 없습니다." });
  }
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateRentVsJeonse> | null;

const defaultValues: FormValues = {
  jeonseDeposit: 500_000_000,
  rentDeposit: 100_000_000,
  monthlyRent: 1_200_000,
  years: 2,
  savingRate: 3.5,
  jeonseLoanRate: 4.2,
  jeonseLoanAmount: 250_000_000,
  rentGrowthRate: 0
};

export function RentVsJeonseCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      jeonseDeposit: getNumberParam("jeonseDeposit", defaultValues.jeonseDeposit),
      rentDeposit: getNumberParam("rentDeposit", defaultValues.rentDeposit),
      monthlyRent: getNumberParam("monthlyRent", defaultValues.monthlyRent),
      years: getNumberParam("years", defaultValues.years),
      savingRate: getNumberParam("savingRate", defaultValues.savingRate),
      jeonseLoanRate: getNumberParam("jeonseLoanRate", defaultValues.jeonseLoanRate),
      jeonseLoanAmount: getNumberParam("jeonseLoanAmount", defaultValues.jeonseLoanAmount),
      rentGrowthRate: getNumberParam("rentGrowthRate", defaultValues.rentGrowthRate ?? 0)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateRentVsJeonse(values);
    setResult(calculated);
    writeQueryState(values);
  }

  const winnerText = result?.winner === "jeonse" ? "전세가 유리합니다" : result?.winner === "rent" ? "월세가 유리합니다" : "전세와 월세가 비슷합니다";

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title={winnerText} value={formatCurrency(result.difference)} description={`비교기간 전체 차이이며, 월평균으로는 ${formatCurrency(result.monthlyDifference)}입니다.`}>
          <ResultRow label="전세 총 주거비" value={formatCurrency(result.jeonseTotalCost)} />
          <ResultRow label="월세 총 주거비" value={formatCurrency(result.rentTotalCost)} />
          <ResultRow label="전세 보증금 기회비용" value={formatCurrency(result.jeonseOpportunityCost)} />
          <ResultRow label="전세대출 이자" value={formatCurrency(result.jeonseLoanInterest)} />
          <ResultRow label="월세 납부 총액" value={formatCurrency(result.monthlyRentTotal)} />
          <ResultRow label="월세 보증금 기회비용" value={formatCurrency(result.rentDepositOpportunityCost)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="jeonseDeposit" control={control} render={({ field }) => <MoneyInput label="전세보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="rentDeposit" control={control} render={({ field }) => <MoneyInput label="월세보증금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="monthlyRent" control={control} render={({ field }) => <MoneyInput label="월세" required value={field.value} onChange={field.onChange} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="비교기간" required suffix="년" value={field.value} onChange={field.onChange} min={0.1} max={30} step={0.5} />} />
          <Controller name="savingRate" control={control} render={({ field }) => <PercentInput label="예금금리" required value={field.value} onChange={field.onChange} helper="보증금 기회비용은 단리로 추정" min={0} max={30} />} />
          <Controller name="jeonseLoanRate" control={control} render={({ field }) => <PercentInput label="전세대출금리" value={field.value} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="jeonseLoanAmount" control={control} render={({ field }) => <MoneyInput label="전세대출금액" value={field.value} onChange={field.onChange} helper="전세보증금 이하로 입력" />} />
          <Controller name="rentGrowthRate" control={control} render={({ field }) => <PercentInput label="연 월세 상승률" value={field.value ?? 0} onChange={field.onChange} min={0} max={30} />} />
        </div>
        <FormErrorSummary messages={[errors.jeonseLoanAmount?.message]} />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">월세와 전세 비교하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
