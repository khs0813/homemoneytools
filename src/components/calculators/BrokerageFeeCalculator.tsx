"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { QuickPresetGroup } from "@/components/calculator/QuickPresetGroup";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ResultSummary } from "@/components/calculator/ResultSummary";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateBrokerageFee, type BrokerageTransactionType } from "@/lib/calculators/brokerage-fee";
import { trackGrowthEvent } from "@/lib/analytics";
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

const analyticsContext = { calculator_type: "brokerage_fee", content_cluster: "housing" };

export function BrokerageFeeCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const transactionType = useWatch({ control, name: "transactionType" });
  const transactionAmount = useWatch({ control, name: "transactionAmount" });
  const deposit = useWatch({ control, name: "deposit" });
  const monthlyRent = useWatch({ control, name: "monthlyRent" });

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
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(normalized);
  }

  const legalUpperAmount = result
    ? Math.min(result.transactionAmount * result.legalRate / 100, result.limit ?? Number.POSITIVE_INFINITY)
    : 0;
  const legalSavings = result ? Math.max(0, legalUpperAmount - result.brokerageFee) : 0;
  const vatIncludedEstimate = result ? result.brokerageFee * 1.1 : 0;

  function applyPreset(values: Partial<FormValues>) {
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as keyof FormValues, value as never, { shouldDirty: true, shouldValidate: true });
    });
  }

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <ResultSummary
          title="예상 총 중개비"
          value={formatCurrency(result.total)}
          description={`${result.includeVat ? "부가세 포함" : "부가세 제외"} 예상액이며, 중개보수 상한과 협의요율을 함께 비교합니다.`}
          basisDate="2026-01-01"
          assumptions={[
            `중개보수 요율 데이터 버전 ${result.version}을 사용합니다.`,
            "월세 거래금액은 기존 중개보수 서비스의 환산거래금액 공식을 사용합니다.",
            "협의요율이 상한요율을 넘으면 기존 서비스가 법정 상한으로 제한합니다."
          ]}
        >
          <ResultRow label="거래금액" value={formatCurrency(result.transactionAmount)} />
          {transactionType === "monthlyRent" ? <ResultRow label="월세 환산 거래금액" value={formatCurrency(result.transactionAmount)} /> : null}
          <ResultRow label="적용 상한요율" value={formatPercent(result.legalRate, 4)} />
          <ResultRow label="법정 상한액" value={formatCurrency(legalUpperAmount)} />
          <ResultRow label="사용자 입력 협의요율" value={formatPercent(result.requestedRate, 4)} />
          <ResultRow label="협의요율 적용액" value={formatCurrency(result.brokerageFee)} />
          <ResultRow label="상한 대비 절감액" value={formatCurrency(legalSavings)} />
          <ResultRow label="부가세 제외 금액" value={formatCurrency(result.brokerageFee)} />
          <ResultRow label="부가세 포함 예상액" value={formatCurrency(vatIncludedEstimate)} />
          <ResultRow label="부가세" value={formatCurrency(result.vat)} />
          <ResultRow label="총 지급 예상액" value={formatCurrency(result.total)} />
          {result.wasRateCapped ? <ResultRow label="주의" value="입력 요율이 상한을 넘어 법정 상한으로 제한했습니다." /> : null}
          <ShareButton />
        </ResultSummary>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="mb-6">
          <QuickPresetGroup
            label="거래 조건 빠른 선택"
            calculatorType="brokerage_fee"
            options={[
              { label: "매매 3억원", name: "sale_300m", selected: transactionType === "sale" && transactionAmount === 300_000_000, onSelect: () => applyPreset({ transactionType: "sale", transactionAmount: 300_000_000 }) },
              { label: "매매 5억원", name: "sale_500m", selected: transactionType === "sale" && transactionAmount === 500_000_000, onSelect: () => applyPreset({ transactionType: "sale", transactionAmount: 500_000_000 }) },
              { label: "전세 2억원", name: "jeonse_200m", selected: transactionType === "jeonse" && transactionAmount === 200_000_000, onSelect: () => applyPreset({ transactionType: "jeonse", transactionAmount: 200_000_000 }) },
              { label: "전세 3억원", name: "jeonse_300m", selected: transactionType === "jeonse" && transactionAmount === 300_000_000, onSelect: () => applyPreset({ transactionType: "jeonse", transactionAmount: 300_000_000 }) },
              { label: "보증금 1천·월세 50", name: "rent_deposit_10m_rent_500k", selected: transactionType === "monthlyRent" && deposit === 10_000_000 && monthlyRent === 500_000, onSelect: () => applyPreset({ transactionType: "monthlyRent", deposit: 10_000_000, monthlyRent: 500_000 }) },
              { label: "보증금 1억·월세 100", name: "rent_deposit_100m_rent_1m", selected: transactionType === "monthlyRent" && deposit === 100_000_000 && monthlyRent === 1_000_000, onSelect: () => applyPreset({ transactionType: "monthlyRent", deposit: 100_000_000, monthlyRent: 1_000_000 }) }
            ]}
          />
        </div>
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
