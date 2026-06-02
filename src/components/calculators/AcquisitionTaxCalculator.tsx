"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { ResultCard } from "@/components/calculator/ResultCard";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateAcquisitionTax, type AcquisitionType, type HouseCount } from "@/lib/calculators/acquisition-tax";
import { formatKoreanMoney, formatPercent } from "@/lib/format";
import { getBooleanParam, getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  price: z.number().finite().min(1),
  houseCount: z.enum(["one", "two", "threeOrMore"]),
  isRegulatedArea: z.boolean(),
  acquisitionType: z.enum(["purchase", "gift", "inheritance"]),
  isFirstHome: z.boolean(),
  includeLocalEducationTax: z.boolean(),
  includeSpecialRuralTax: z.boolean()
});

type FormValues = z.infer<typeof schema>;
type Result = ReturnType<typeof calculateAcquisitionTax> | null;

const defaultValues: FormValues = {
  price: 500_000_000,
  houseCount: "one",
  isRegulatedArea: false,
  acquisitionType: "purchase",
  isFirstHome: false,
  includeLocalEducationTax: true,
  includeSpecialRuralTax: false
};

function BooleanSelect({ value, onChange, label }: { value: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select value={String(value)} onChange={(event) => onChange(event.target.value === "true")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
        <option value="false">아니오</option>
        <option value="true">예</option>
      </select>
    </label>
  );
}

export function AcquisitionTaxCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      price: getNumberParam("price", defaultValues.price),
      houseCount: getEnumParam("houseCount", ["one", "two", "threeOrMore"] as const, defaultValues.houseCount) as HouseCount,
      isRegulatedArea: getBooleanParam("isRegulatedArea", defaultValues.isRegulatedArea),
      acquisitionType: getEnumParam("acquisitionType", ["purchase", "gift", "inheritance"] as const, defaultValues.acquisitionType) as AcquisitionType,
      isFirstHome: getBooleanParam("isFirstHome", defaultValues.isFirstHome),
      includeLocalEducationTax: getBooleanParam("includeLocalEducationTax", defaultValues.includeLocalEducationTax),
      includeSpecialRuralTax: getBooleanParam("includeSpecialRuralTax", defaultValues.includeSpecialRuralTax)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const calculated = calculateAcquisitionTax(values);
    setResult(calculated);
    writeQueryState(values);
  }

  return (
    <CalculatorWorkspace
      pinForm={Boolean(result)}
      result={result ? (
        <ResultCard title="예상 총 납부액" value={formatKoreanMoney(result.totalTax)} description={`적용 세율은 약 ${formatPercent(result.rate)}이며, 기준 버전은 ${result.version}입니다.`}>
          <ResultRow label="취득세 감면 전" value={formatKoreanMoney(result.acquisitionTaxBeforeDiscount)} />
          <ResultRow label="생애최초 감면 추정" value={formatKoreanMoney(result.firstHomeDiscount)} />
          <ResultRow label="취득세" value={formatKoreanMoney(result.acquisitionTax)} />
          <ResultRow label="지방교육세" value={formatKoreanMoney(result.localEducationTax)} />
          <ResultRow label="농어촌특별세" value={formatKoreanMoney(result.specialRuralTax)} />
          <ResultRow label="실효 세율" value={formatPercent(result.effectiveRate, 3)} />
          <ShareButton />
        </ResultCard>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="price" control={control} render={({ field }) => <MoneyInput label="주택 가격" required value={field.value} onChange={field.onChange} />} />
          <Controller
            name="houseCount"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">주택 수</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="one">1주택</option>
                  <option value="two">2주택</option>
                  <option value="threeOrMore">3주택 이상</option>
                </select>
              </label>
            )}
          />
          <Controller name="isRegulatedArea" control={control} render={({ field }) => <BooleanSelect label="조정대상지역" value={field.value} onChange={field.onChange} />} />
          <Controller
            name="acquisitionType"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">취득 유형</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="purchase">매매</option>
                  <option value="gift">증여</option>
                  <option value="inheritance">상속</option>
                </select>
              </label>
            )}
          />
          <Controller name="isFirstHome" control={control} render={({ field }) => <BooleanSelect label="생애최초 감면 단순 반영" value={field.value} onChange={field.onChange} />} />
          <Controller name="includeLocalEducationTax" control={control} render={({ field }) => <BooleanSelect label="지방교육세 포함" value={field.value} onChange={field.onChange} />} />
          <Controller name="includeSpecialRuralTax" control={control} render={({ field }) => <BooleanSelect label="농어촌특별세 포함" value={field.value} onChange={field.onChange} />} />
        </div>
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">취득세 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
