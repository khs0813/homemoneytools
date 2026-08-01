"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateAcquisitionTax, type FirstHomeDiscountType, type HouseCount } from "@/lib/calculators/acquisition-tax";
import { trackGrowthEvent } from "@/lib/analytics";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT } from "@/lib/format";
import { getBooleanParam, getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  price: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  houseCount: z.enum(["one", "two", "three", "fourOrMore"]),
  isRegulatedArea: z.boolean(),
  isTemporaryTwoHouse: z.boolean(),
  floorAreaOver85: z.boolean(),
  firstHomeDiscountType: z.enum(["none", "standard", "expanded"])
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateAcquisitionTax> | null;

const defaultValues: FormValues = {
  price: 500_000_000,
  houseCount: "one",
  isRegulatedArea: false,
  isTemporaryTwoHouse: false,
  floorAreaOver85: false,
  firstHomeDiscountType: "none"
};

const analyticsContext = { calculator_type: "acquisition_tax", content_cluster: "housing" };

function BooleanSelect({ value, onChange, label, helper }: { value: boolean; onChange: (value: boolean) => void; label: string; helper?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select value={String(value)} onChange={(event) => onChange(event.target.value === "true")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
        <option value="false">아니오</option>
        <option value="true">예</option>
      </select>
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}

export function AcquisitionTaxCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const houseCount = useWatch({ control, name: "houseCount" });

  useEffect(() => {
    const oldHouseCount = getEnumParam("houseCount", ["one", "two", "three", "fourOrMore", "threeOrMore"] as const, defaultValues.houseCount);
    const migratedHouseCount: HouseCount = oldHouseCount === "threeOrMore" ? "three" : oldHouseCount;
    const oldFirstHome = getBooleanParam("isFirstHome", false);
    reset({
      ...defaultValues,
      price: getNumberParam("price", defaultValues.price),
      houseCount: migratedHouseCount,
      isRegulatedArea: getBooleanParam("isRegulatedArea", defaultValues.isRegulatedArea),
      isTemporaryTwoHouse: getBooleanParam("isTemporaryTwoHouse", defaultValues.isTemporaryTwoHouse),
      floorAreaOver85: getBooleanParam("floorAreaOver85", defaultValues.floorAreaOver85),
      firstHomeDiscountType: getEnumParam("firstHomeDiscountType", ["none", "standard", "expanded"] as const, oldFirstHome ? "standard" : defaultValues.firstHomeDiscountType) as FirstHomeDiscountType
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const normalized = { ...values, isTemporaryTwoHouse: values.houseCount === "two" && values.isTemporaryTwoHouse };
    const calculated = calculateAcquisitionTax(normalized);
    setResult(calculated);
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(normalized);
  }

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 총 납부액" value={formatCurrency(result.totalTax)} description={`적용 취득세율은 ${formatPercent(result.rate)}이며, 기준 버전은 ${result.version}입니다.`}>
          <ResultRow label="취득세 예상액" value={formatCurrency(result.acquisitionTax)} />
          <ResultRow label="지방교육세" value={formatCurrency(result.localEducationTax)} />
          <ResultRow label="농어촌특별세" value={formatCurrency(result.specialRuralTax)} />
          <ResultRow label="감면 적용 전 세액" value={formatCurrency(result.acquisitionTaxBeforeDiscount)} />
          <ResultRow label="감면 적용 전후 차이" value={formatCurrency(result.firstHomeDiscount)} />
          <ResultRow label="총 필요 세금" value={formatCurrency(result.totalTax)} />
          <ResultRow label="매매가 대비 실효세율" value={formatPercent(result.effectiveRate, 3)} />
          {result.warnings.map((warning) => <ResultRow key={warning} label="주의" value={warning} />)}
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="price" control={control} render={({ field }) => <MoneyInput label="주택 가격" required value={field.value} onChange={field.onChange} />} />
          <Controller
            name="houseCount"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">취득 후 세대 주택 수</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="one">1주택</option>
                  <option value="two">2주택</option>
                  <option value="three">3주택</option>
                  <option value="fourOrMore">4주택 이상</option>
                </select>
              </label>
            )}
          />
          <Controller name="isRegulatedArea" control={control} render={({ field }) => <BooleanSelect label="취득 주택이 조정대상지역" value={field.value} onChange={field.onChange} />} />
          {houseCount === "two" ? <Controller name="isTemporaryTwoHouse" control={control} render={({ field }) => <BooleanSelect label="일시적 2주택 특례 가정" value={field.value} onChange={field.onChange} helper="실제 인정 여부와 종전주택 처분기한을 별도 확인" />} /> : null}
          <Controller name="floorAreaOver85" control={control} render={({ field }) => <BooleanSelect label="전용면적 85㎡ 초과" value={field.value} onChange={field.onChange} helper="농어촌특별세 단순 반영" />} />
          <Controller
            name="firstHomeDiscountType"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">생애최초 감면</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="none">적용 안 함</option>
                  <option value="standard">일반 요건 최대 200만원</option>
                  <option value="expanded">특별대상임을 확인함 · 최대 300만원</option>
                </select>
                <span className="mt-2 block text-xs leading-5 text-slate-500">300만원 한도는 일반 주택 전체가 아니라 아파트를 제외한 전용 60㎡ 이하 공동주택·도시형생활주택·일부 다가구주택 또는 인구감소지역 주택 등 별도 요건을 충족할 때만 선택하세요.</span>
              </label>
            )}
          />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">취득세 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
