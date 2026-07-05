"use client";

import { useState } from "react";
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
import { calculateLoanInterest } from "@/lib/calculators/finance";
import { formatKoreanMoney, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";

const schema = z.object({
  principal: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  annualRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  years: z.number().finite().min(0.5).max(MAX_SAFE_YEARS),
  repaymentType: z.enum(["interest-only", "equal-payment", "equal-principal"])
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateLoanInterest> | null;

const defaultValues: FormValues = {
  principal: 100_000_000,
  annualRate: 5,
  years: 10,
  repaymentType: "interest-only"
};

export function LoanInterestCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  function onSubmit(values: FormValues) {
    setResult(calculateLoanInterest(values));
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="월 예상 납입액" value={formatKoreanMoney(result.monthlyPayment)} description={`${result.months}개월 기준 총 이자는 ${formatKoreanMoney(result.totalInterest)}입니다.`}>
          <ResultRow label="첫 달 납입액" value={formatKoreanMoney(result.firstMonthlyPayment)} />
          <ResultRow label="마지막 달 납입액" value={formatKoreanMoney(result.lastMonthlyPayment)} />
          <ResultRow label="이자만 냈을 때 월 이자" value={formatKoreanMoney(result.monthlyInterestOnly)} />
          <ResultRow label="총 납입액" value={formatKoreanMoney(result.totalPayment)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="principal" control={control} render={({ field }) => <MoneyInput label="대출원금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="annualRate" control={control} render={({ field }) => <PercentInput label="연이율" required value={field.value} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="years" control={control} render={({ field }) => <NumberInput label="대출기간" required value={field.value} onChange={field.onChange} suffix="년" min={0.5} max={50} step={0.5} />} />
          <Controller
            name="repaymentType"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">상환방식</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="interest-only">만기일시상환</option>
                  <option value="equal-payment">원리금균등상환</option>
                  <option value="equal-principal">원금균등상환</option>
                </select>
              </label>
            )}
          />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">대출이자 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
