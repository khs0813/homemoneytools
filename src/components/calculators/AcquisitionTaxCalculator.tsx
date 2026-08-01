"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { RecommendedNextActions } from "@/components/calculator/RecommendedNextActions";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ResultSummary } from "@/components/calculator/ResultSummary";
import { ShareResult } from "@/components/calculator/ShareResult";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { calculateAcquisitionTax, type FirstHomeDiscountType, type HouseCount } from "@/lib/calculators/acquisition-tax";
import { calculateBrokerageFee } from "@/lib/calculators/brokerage-fee";
import { trackGrowthEvent } from "@/lib/analytics";
import { buildFragmentPath } from "@/lib/fragment-state";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT } from "@/lib/format";
import { getBooleanParam, getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";
import { saveRecentCalculation } from "@/lib/recent-calculations";

const schema = z.object({
  price: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  houseCount: z.enum(["one", "two", "three", "fourOrMore"]),
  isRegulatedArea: z.boolean(),
  isTemporaryTwoHouse: z.boolean(),
  floorAreaOver85: z.boolean(),
  firstHomeDiscountType: z.enum(["none", "standard", "expanded"])
});

type FormValues = z.infer<typeof schema>;
type Result = (ReturnType<typeof calculateAcquisitionTax> & {
  brokerageFeeTotal: number;
  minimumTransactionCost: number;
  submitted: FormValues;
}) | null;

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
    const brokerage = calculateBrokerageFee({ transactionType: "sale", transactionAmount: values.price, includeVat: true });
    setResult({
      ...calculated,
      brokerageFeeTotal: brokerage.total,
      minimumTransactionCost: calculated.totalTax + brokerage.total,
      submitted: normalized
    });
    saveRecentCalculation({
      calculator_type: analyticsContext.calculator_type,
      page_path: "/acquisition-tax-calculator",
      summary: "취득세 계산 결과"
    });
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(normalized);
  }

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <>
          <ResultSummary
            title="예상 총 납부액"
            value={formatCurrency(result.totalTax)}
            description={`적용 취득세율은 ${formatPercent(result.rate)}이며, 기존 취득세 서비스 결과를 그대로 사용합니다.`}
            basisDate="2026-07-01"
            assumptions={[
              `취득세 기준 버전 ${result.version}을 사용합니다.`,
              "주택 유상매매 간편 계산 범위이며 법인·증여·상속·부담부증여는 포함하지 않습니다.",
              "최소 거래비용은 취득세 합계와 매매 중개보수 예상액을 단순 합산한 참고값입니다."
            ]}
          >
            <ResultRow label="취득세 예상액" value={formatCurrency(result.acquisitionTax)} />
            <ResultRow label="지방교육세" value={formatCurrency(result.localEducationTax)} />
            <ResultRow label="농어촌특별세" value={formatCurrency(result.specialRuralTax)} />
            <ResultRow label="합계" value={formatCurrency(result.totalTax)} />
            <ResultRow label="주택가격 대비 세금 비율" value={formatPercent(result.effectiveRate, 3)} />
            <ResultRow label="중개수수료 포함 최소 거래비용" value={formatCurrency(result.minimumTransactionCost)} />
            <ResultRow label="감면 적용 전 세액" value={formatCurrency(result.acquisitionTaxBeforeDiscount)} />
            <ResultRow label="감면 적용 전후 차이" value={formatCurrency(result.firstHomeDiscount)} />
            <ResultRow label="매매 중개보수 예상액" value={formatCurrency(result.brokerageFeeTotal)} />
            {result.warnings.map((warning) => <ResultRow key={warning} label="주의" value={warning} />)}
            <ShareResult
              title="취득세 계산 결과"
              text={`취득세 합계 ${formatCurrency(result.totalTax)}\n지방교육세 ${formatCurrency(result.localEducationTax)}\n농어촌특별세 ${formatCurrency(result.specialRuralTax)}\n기준일 2026-07-01\n집계산에서 직접 계산`}
              path="/acquisition-tax-calculator"
              fragmentState={result.submitted}
            />
          </ResultSummary>
          <RecommendedNextActions
            calculatorType="acquisition_tax"
            actions={[
              {
                href: buildFragmentPath("/real-estate-brokerage-fee-calculator", {
                  transactionType: "sale",
                  transactionAmount: result.submitted.price
                }),
                title: "중개수수료 계산",
                description: "같은 매매가로 중개보수 상한액과 부가세 포함 예상액을 확인합니다."
              },
              {
                href: buildFragmentPath("/loan-interest-calculator", {
                  principal: Math.round(result.submitted.price * 0.6)
                }),
                title: "주택담보대출 월상환액 확인",
                description: "매수 자금 중 대출이 필요한 경우 월 납입액을 따로 계산합니다."
              },
              {
                href: buildFragmentPath("/home-purchase-total-cost-calculator", {
                  price: result.submitted.price,
                  houseCount: result.submitted.houseCount,
                  isRegulatedArea: result.submitted.isRegulatedArea,
                  floorAreaOver85: result.submitted.floorAreaOver85
                }),
                title: "내 집 마련 총비용 계산",
                description: "취득세, 중개보수, 대출, 기타 비용까지 초기 현금을 이어서 계산합니다."
              }
            ]}
          />
        </>
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
