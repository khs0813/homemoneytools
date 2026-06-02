"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateDsr } from "@/lib/calculators/dsr";
import { formatCurrency, formatKoreanMoney, formatPercent } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  annualIncome: z.number().finite().min(1),
  mortgageAmount: z.number().finite().min(0),
  mortgageRate: z.number().finite().min(0),
  mortgageYears: z.number().finite().min(1),
  existingCreditLoanAmount: z.number().finite().min(0).optional(),
  existingCreditLoanRate: z.number().finite().min(0).optional(),
  otherAnnualRepayment: z.number().finite().min(0).optional(),
  dsrLimit: z.number().finite().min(1),
  stressRate: z.number().finite().min(0).optional(),
  creditLoanMode: z.enum(["interest-only", "amortized"])
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateDsr> | null;

const defaultValues: FormValues = {
  annualIncome: 70_000_000,
  mortgageAmount: 300_000_000,
  mortgageRate: 4.5,
  mortgageYears: 30,
  existingCreditLoanAmount: 20_000_000,
  existingCreditLoanRate: 5,
  otherAnnualRepayment: 0,
  dsrLimit: 40,
  stressRate: 1.5,
  creditLoanMode: "interest-only"
};

export function DsrCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      annualIncome: getNumberParam("annualIncome", defaultValues.annualIncome),
      mortgageAmount: getNumberParam("mortgageAmount", defaultValues.mortgageAmount),
      mortgageRate: getNumberParam("mortgageRate", defaultValues.mortgageRate),
      mortgageYears: getNumberParam("mortgageYears", defaultValues.mortgageYears),
      existingCreditLoanAmount: getNumberParam("existingCreditLoanAmount", defaultValues.existingCreditLoanAmount ?? 0),
      existingCreditLoanRate: getNumberParam("existingCreditLoanRate", defaultValues.existingCreditLoanRate ?? 0),
      otherAnnualRepayment: getNumberParam("otherAnnualRepayment", defaultValues.otherAnnualRepayment ?? 0),
      dsrLimit: getNumberParam("dsrLimit", defaultValues.dsrLimit),
      stressRate: getNumberParam("stressRate", defaultValues.stressRate ?? 0),
      creditLoanMode: getEnumParam("creditLoanMode", ["interest-only", "amortized"] as const, defaultValues.creditLoanMode)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateDsr(values);
    setResult(calculated);
    writeQueryState(values);
  }

  const statusText = result?.status === "safe" ? "기준 이내입니다" : result?.status === "warning" ? "주의 구간입니다" : "기준 초과 가능성이 있습니다";

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title={statusText} value={formatPercent(result.dsr)} description={`입력한 DSR 기준은 ${result.dsrLimit}%입니다.`}>
          <ResultRow label="연간 원리금 상환액" value={formatKoreanMoney(result.totalAnnualRepayment)} />
          <ResultRow label="월평균 상환액" value={formatCurrency(result.monthlyAverageRepayment)} />
          <ResultRow label="주담대 연상환액" value={formatKoreanMoney(result.annualMortgagePayment)} />
          <ResultRow label="신용대출 연상환액" value={formatKoreanMoney(result.annualCreditPayment)} />
          <ResultRow label="기준 대비 여유 금액" value={formatKoreanMoney(result.remainingAnnualRepaymentCapacity)} />
          <ResultRow label="스트레스 금리 적용 DSR" value={formatPercent(result.stressedDsr)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="annualIncome" control={control} render={({ field }) => <MoneyInput label="연소득" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageAmount" control={control} render={({ field }) => <MoneyInput label="주택담보대출 금액" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageRate" control={control} render={({ field }) => <PercentInput label="주담대 금리" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageYears" control={control} render={({ field }) => <NumberInput label="주담대 기간" required suffix="년" value={field.value} onChange={field.onChange} />} />
          <Controller name="existingCreditLoanAmount" control={control} render={({ field }) => <MoneyInput label="기존 신용대출 잔액" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="existingCreditLoanRate" control={control} render={({ field }) => <PercentInput label="기존 신용대출 금리" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="otherAnnualRepayment" control={control} render={({ field }) => <MoneyInput label="기타대출 연상환액" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="dsrLimit" control={control} render={({ field }) => <NumberInput label="DSR 기준" suffix="%" value={field.value} onChange={field.onChange} />} />
          <Controller name="stressRate" control={control} render={({ field }) => <PercentInput label="스트레스 금리" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller
            name="creditLoanMode"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">신용대출 반영 방식</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="interest-only">이자만 반영</option>
                  <option value="amortized">5년 원리금균등 가정</option>
                </select>
              </label>
            )}
          />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">DSR 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
