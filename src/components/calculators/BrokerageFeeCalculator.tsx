"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateBrokerageFee, type BrokerageTransactionType } from "@/lib/calculators/brokerage-fee";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getBooleanParam, getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  transactionType: z.enum(["sale", "jeonse", "monthlyRent"]),
  transactionAmount: z.number().finite().min(0).optional(),
  deposit: z.number().finite().min(0).optional(),
  monthlyRent: z.number().finite().min(0).optional(),
  customRate: z.number().finite().min(0).optional(),
  includeVat: z.boolean()
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateBrokerageFee> | null;

const defaultValues: FormValues = {
  transactionType: "sale",
  transactionAmount: 500_000_000,
  deposit: 100_000_000,
  monthlyRent: 1_200_000,
  customRate: undefined,
  includeVat: true
};

export function BrokerageFeeCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const transactionType = useWatch({ control, name: "transactionType" });

  useEffect(() => {
    reset({
      ...defaultValues,
      transactionType: getEnumParam("transactionType", ["sale", "jeonse", "monthlyRent"] as const, defaultValues.transactionType) as BrokerageTransactionType,
      transactionAmount: getNumberParam("transactionAmount", defaultValues.transactionAmount ?? 0),
      deposit: getNumberParam("deposit", defaultValues.deposit ?? 0),
      monthlyRent: getNumberParam("monthlyRent", defaultValues.monthlyRent ?? 0),
      customRate: getNumberParam("customRate", 0),
      includeVat: getBooleanParam("includeVat", defaultValues.includeVat)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const normalized = { ...values, customRate: values.customRate && values.customRate > 0 ? values.customRate : undefined };
    const calculated = calculateBrokerageFee(normalized);
    setResult(calculated);
    writeQueryState(normalized);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 총 중개비" value={formatCurrency(result.total)} description={`${result.includeVat ? "부가세 포함" : "부가세 제외"} 예상액이며, 기준 버전은 ${result.version}입니다.`}>
          <ResultRow label="적용 거래금액" value={formatCurrency(result.transactionAmount)} />
          <ResultRow label="입력한 협의 요율" value={formatPercent(result.requestedRate, 4)} />
          <ResultRow label="실제 적용 요율" value={formatPercent(result.appliedRate, 4)} />
          <ResultRow label="법정 상한요율" value={formatPercent(result.legalRate, 4)} />
          <ResultRow label="한도액" value={result.limit ? formatCurrency(result.limit) : "한도 없음"} />
          <ResultRow label="중개보수" value={formatCurrency(result.brokerageFee)} />
          <ResultRow label="부가세" value={formatCurrency(result.vat)} />
          {result.wasRateCapped ? <ResultRow label="주의" value="입력 요율이 상한을 넘어 법정 상한으로 제한했습니다." /> : null}
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">거래 유형</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="sale">매매</option>
                  <option value="jeonse">전세</option>
                  <option value="monthlyRent">월세</option>
                </select>
              </label>
            )}
          />
          {transactionType === "monthlyRent" ? (
            <>
              <Controller name="deposit" control={control} render={({ field }) => <MoneyInput label="월세 보증금" required value={field.value ?? 0} onChange={field.onChange} />} />
              <Controller name="monthlyRent" control={control} render={({ field }) => <MoneyInput label="월세" required value={field.value ?? 0} onChange={field.onChange} />} />
            </>
          ) : (
            <Controller name="transactionAmount" control={control} render={({ field }) => <MoneyInput label={transactionType === "sale" ? "매매가" : "전세보증금"} required value={field.value ?? 0} onChange={field.onChange} />} />
          )}
          <Controller name="customRate" control={control} render={({ field }) => <PercentInput label="협의 요율" value={field.value ?? 0} onChange={field.onChange} helper="0이면 법정 상한요율 적용. 상한을 넘게 입력해도 자동으로 상한까지만 반영" />} />
          <Controller
            name="includeVat"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">부가세 10% 포함</span>
                <select value={String(field.value)} onChange={(event) => field.onChange(event.target.value === "true")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="true">포함</option>
                  <option value="false">제외</option>
                </select>
                <span className="mt-2 block text-xs leading-5 text-slate-500">중개업소의 과세유형에 따라 실제 부가세 청구 여부가 달라질 수 있어 선택해서 계산합니다.</span>
              </label>
            )}
          />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">중개수수료 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
