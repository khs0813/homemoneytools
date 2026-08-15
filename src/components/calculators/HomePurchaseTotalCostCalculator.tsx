"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdFitSlot } from "@/components/adfit/AdFitSlot";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { FormErrorSummary } from "@/components/calculator/FormErrorSummary";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { QuickPresetGroup } from "@/components/calculator/QuickPresetGroup";
import { RecommendedNextActions } from "@/components/calculator/RecommendedNextActions";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ResultSummary } from "@/components/calculator/ResultSummary";
import { ShareResult } from "@/components/calculator/ShareResult";
import { trackGrowthEvent } from "@/lib/analytics";
import { calculateHomePurchaseTotalCost } from "@/lib/calculators/home-purchase-total-cost";
import { buildFragmentPath } from "@/lib/fragment-state";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getBooleanParam, getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";
import { saveRecentCalculation } from "@/lib/recent-calculations";

const schema = z.object({
  price: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  cashOnHand: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  mortgageAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  mortgageRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  mortgageYears: z.number().finite().min(1).max(MAX_SAFE_YEARS),
  annualIncome: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  existingCreditLoanAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  existingCreditLoanRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT).optional(),
  otherAnnualRepayment: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  dsrLimit: z.number().finite().min(1).max(100),
  stressRate: z.number().finite().min(0).max(10).optional(),
  houseCount: z.enum(["one", "two", "three", "fourOrMore"]),
  isRegulatedArea: z.boolean(),
  isTemporaryTwoHouse: z.boolean(),
  floorAreaOver85: z.boolean(),
  firstHomeDiscountType: z.enum(["none", "standard", "expanded"]),
  brokerageRate: z.number().finite().min(0).max(10).optional(),
  contractDeposit: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  movingCost: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  legalServiceCost: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  otherCost: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  targetEmergencyCash: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional()
}).superRefine((values, context) => {
  if (values.mortgageAmount > values.price) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["mortgageAmount"], message: "예상 주택담보대출은 주택가격을 초과할 수 없습니다." });
  }
  if (values.contractDeposit > values.price) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["contractDeposit"], message: "계약금은 주택가격을 초과할 수 없습니다." });
  }
});

type FormValues = z.infer<typeof schema>;
type Result = (ReturnType<typeof calculateHomePurchaseTotalCost> & { submitted: FormValues }) | null;

const defaultValues: FormValues = {
  price: 500_000_000,
  cashOnHand: 150_000_000,
  mortgageAmount: 300_000_000,
  mortgageRate: 4.5,
  mortgageYears: 30,
  annualIncome: 70_000_000,
  existingCreditLoanAmount: 0,
  existingCreditLoanRate: 5,
  otherAnnualRepayment: 0,
  dsrLimit: 40,
  stressRate: 1.5,
  houseCount: "one",
  isRegulatedArea: false,
  isTemporaryTwoHouse: false,
  floorAreaOver85: false,
  firstHomeDiscountType: "none",
  brokerageRate: 0,
  contractDeposit: 50_000_000,
  movingCost: 0,
  legalServiceCost: 0,
  otherCost: 0,
  targetEmergencyCash: 0
};

const analyticsContext = { calculator_type: "home_purchase_total_cost", content_cluster: "housing" };

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

export function HomePurchaseTotalCostCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const price = useWatch({ control, name: "price" });
  const mortgageYears = useWatch({ control, name: "mortgageYears" });
  const houseCount = useWatch({ control, name: "houseCount" });

  useEffect(() => {
    reset({
      ...defaultValues,
      price: getNumberParam("price", defaultValues.price),
      cashOnHand: getNumberParam("cashOnHand", defaultValues.cashOnHand),
      mortgageAmount: getNumberParam("mortgageAmount", defaultValues.mortgageAmount),
      mortgageRate: getNumberParam("mortgageRate", defaultValues.mortgageRate),
      mortgageYears: getNumberParam("mortgageYears", defaultValues.mortgageYears),
      annualIncome: getNumberParam("annualIncome", defaultValues.annualIncome),
      existingCreditLoanAmount: getNumberParam("existingCreditLoanAmount", defaultValues.existingCreditLoanAmount ?? 0),
      existingCreditLoanRate: getNumberParam("existingCreditLoanRate", defaultValues.existingCreditLoanRate ?? 0),
      otherAnnualRepayment: getNumberParam("otherAnnualRepayment", defaultValues.otherAnnualRepayment ?? 0),
      dsrLimit: getNumberParam("dsrLimit", defaultValues.dsrLimit),
      stressRate: getNumberParam("stressRate", defaultValues.stressRate ?? 0),
      houseCount: getEnumParam("houseCount", ["one", "two", "three", "fourOrMore"] as const, defaultValues.houseCount),
      isRegulatedArea: getBooleanParam("isRegulatedArea", defaultValues.isRegulatedArea),
      isTemporaryTwoHouse: getBooleanParam("isTemporaryTwoHouse", defaultValues.isTemporaryTwoHouse),
      floorAreaOver85: getBooleanParam("floorAreaOver85", defaultValues.floorAreaOver85),
      firstHomeDiscountType: getEnumParam("firstHomeDiscountType", ["none", "standard", "expanded"] as const, defaultValues.firstHomeDiscountType),
      brokerageRate: getNumberParam("brokerageRate", defaultValues.brokerageRate ?? 0),
      contractDeposit: getNumberParam("contractDeposit", defaultValues.contractDeposit),
      movingCost: getNumberParam("movingCost", defaultValues.movingCost ?? 0),
      legalServiceCost: getNumberParam("legalServiceCost", defaultValues.legalServiceCost ?? 0),
      otherCost: getNumberParam("otherCost", defaultValues.otherCost ?? 0),
      targetEmergencyCash: getNumberParam("targetEmergencyCash", defaultValues.targetEmergencyCash ?? 0)
    });
  }, [reset]);

  function onSubmit(values: FormValues) {
    const normalized = { ...values, isTemporaryTwoHouse: values.houseCount === "two" && values.isTemporaryTwoHouse };
    const calculated = calculateHomePurchaseTotalCost(normalized);
    setResult({ ...calculated, submitted: normalized });
    saveRecentCalculation({
      calculator_type: analyticsContext.calculator_type,
      page_path: "/home-purchase-total-cost-calculator",
      summary: "내 집 마련 총비용 계산 결과"
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
            title="대출 실행 후 필요한 자기자본"
            value={formatCurrency(result.cashNeededAfterLoan)}
            description="주택가격, 취득세, 중개수수료, 사용자가 직접 입력한 기타 비용에서 예상 주담대를 뺀 참고 현금 필요액입니다."
            basisDate="2026-07-01"
            assumptions={[
              "취득세, 중개보수, DSR, 대출 월상환액은 기존 계산 서비스를 조합해 계산합니다.",
              "이사비, 법무비, 기타 비용, 계약금, 목표 비상자금은 사용자가 직접 입력한 값만 반영합니다.",
              "계산 결과는 자금계획 참고용이며 실제 승인, 신고, 계약 조건을 확정하지 않습니다."
            ]}
          >
            <ResultRow label="취득세" value={formatCurrency(result.acquisitionTax.acquisitionTax)} />
            <ResultRow label="지방교육세" value={formatCurrency(result.acquisitionTax.localEducationTax)} />
            <ResultRow label="농어촌특별세" value={formatCurrency(result.acquisitionTax.specialRuralTax)} />
            <ResultRow label="취득세 합계" value={formatCurrency(result.acquisitionTax.totalTax)} />
            <ResultRow label="중개수수료" value={formatCurrency(result.brokerageFee.total)} />
            <ResultRow label="월 원리금" value={formatCurrency(result.mortgage.monthlyPayment)} />
            <ResultRow label="현재 또는 예상 DSR" value={formatPercent(result.dsr.assessmentDsr)} />
            <ResultRow label="계약금 시점 필요 현금" value={formatCurrency(result.contractDeposit)} />
            <ResultRow label="잔금 시점 필요 현금" value={formatCurrency(result.balanceCashNeeded)} />
            <ResultRow label="이사·법무·기타 비용 포함 총 초기비용" value={formatCurrency(result.additionalCosts)} />
            <ResultRow label="거래 후 남는 현금" value={formatCurrency(result.remainingCash)} />
            <ResultRow label="비상자금 부족 여부" value={result.isEmergencyCashShort ? `${formatCurrency(result.emergencyCashShortfall)} 부족 가능` : "입력한 목표 비상자금 기준 부족 없음"} />
            <ShareResult
              title="내 집 마련 총비용 계산 결과"
              text={`대출 실행 후 필요한 자기자본 ${formatCurrency(result.cashNeededAfterLoan)}\n취득세 합계 ${formatCurrency(result.acquisitionTax.totalTax)}\n중개수수료 ${formatCurrency(result.brokerageFee.total)}\n월 원리금 ${formatCurrency(result.mortgage.monthlyPayment)}\n기준일 2026-07-01\n집계산에서 직접 계산`}
              path="/home-purchase-total-cost-calculator"
              fragmentState={result.submitted}
            />
          </ResultSummary>
          <AdFitSlot placement="calculator_result_primary" />
          <RecommendedNextActions
            calculatorType="home_purchase_total_cost"
            actions={[
              {
                href: buildFragmentPath("/dsr-calculator", {
                  annualIncome: result.submitted.annualIncome,
                  mortgageAmount: result.submitted.mortgageAmount,
                  mortgageRate: result.submitted.mortgageRate,
                  mortgageYears: result.submitted.mortgageYears,
                  existingCreditLoanAmount: result.submitted.existingCreditLoanAmount
                }),
                title: "DSR 상세 계산",
                description: "상환 여력과 스트레스 DSR을 더 자세히 확인합니다."
              },
              {
                href: buildFragmentPath("/acquisition-tax-calculator", {
                  price: result.submitted.price,
                  houseCount: result.submitted.houseCount,
                  isRegulatedArea: result.submitted.isRegulatedArea,
                  floorAreaOver85: result.submitted.floorAreaOver85
                }),
                title: "취득세 상세 계산",
                description: "감면, 주택 수, 지역 조건을 취득세 계산기에서 따로 점검합니다."
              },
              {
                href: buildFragmentPath("/real-estate-brokerage-fee-calculator", {
                  transactionType: "sale",
                  transactionAmount: result.submitted.price,
                  customRate: result.submitted.brokerageRate
                }),
                title: "중개수수료 상세 계산",
                description: "협의요율과 부가세 포함 예상액을 별도로 확인합니다."
              }
            ]}
          />
        </>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="mb-6 grid gap-3">
          <QuickPresetGroup
            label="주택가격 빠른 선택"
            calculatorType="home_purchase_total_cost"
            options={[
              { label: "3억원", name: "price_300m", selected: price === 300_000_000, onSelect: () => setValue("price", 300_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "5억원", name: "price_500m", selected: price === 500_000_000, onSelect: () => setValue("price", 500_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "7억원", name: "price_700m", selected: price === 700_000_000, onSelect: () => setValue("price", 700_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "price_custom", selected: ![300_000_000, 500_000_000, 700_000_000].includes(price), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="대출 기간 빠른 선택"
            calculatorType="home_purchase_total_cost"
            options={[
              { label: "20년", name: "mortgage_years_20", selected: mortgageYears === 20, onSelect: () => setValue("mortgageYears", 20, { shouldDirty: true, shouldValidate: true }) },
              { label: "30년", name: "mortgage_years_30", selected: mortgageYears === 30, onSelect: () => setValue("mortgageYears", 30, { shouldDirty: true, shouldValidate: true }) },
              { label: "40년", name: "mortgage_years_40", selected: mortgageYears === 40, onSelect: () => setValue("mortgageYears", 40, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "mortgage_years_custom", selected: ![20, 30, 40].includes(mortgageYears), onSelect: () => undefined }
            ]}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="price" control={control} render={({ field }) => <MoneyInput label="주택가격" required value={field.value} onChange={field.onChange} />} />
          <Controller name="cashOnHand" control={control} render={({ field }) => <MoneyInput label="보유 현금" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageAmount" control={control} render={({ field }) => <MoneyInput label="예상 주택담보대출" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageRate" control={control} render={({ field }) => <PercentInput label="금리" required value={field.value} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="mortgageYears" control={control} render={({ field }) => <NumberInput label="대출 기간" required suffix="년" value={field.value} onChange={field.onChange} min={1} max={50} />} />
          <Controller name="annualIncome" control={control} render={({ field }) => <MoneyInput label="연소득" required value={field.value} onChange={field.onChange} />} />
          <Controller name="existingCreditLoanAmount" control={control} render={({ field }) => <MoneyInput label="기존 대출" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="existingCreditLoanRate" control={control} render={({ field }) => <PercentInput label="기존 대출 금리" value={field.value ?? 0} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="otherAnnualRepayment" control={control} render={({ field }) => <MoneyInput label="기타대출 연상환액" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="dsrLimit" control={control} render={({ field }) => <NumberInput label="DSR 기준" suffix="%" value={field.value} onChange={field.onChange} min={1} max={100} />} />
          <Controller name="stressRate" control={control} render={({ field }) => <PercentInput label="스트레스 금리" value={field.value ?? 0} onChange={field.onChange} min={0} max={10} />} />
          <Controller
            name="houseCount"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">취득 후 주택 수</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="one">1주택</option>
                  <option value="two">2주택</option>
                  <option value="three">3주택</option>
                  <option value="fourOrMore">4주택 이상</option>
                </select>
              </label>
            )}
          />
          <Controller name="isRegulatedArea" control={control} render={({ field }) => <BooleanSelect label="조정대상지역" value={field.value} onChange={field.onChange} />} />
          {houseCount === "two" ? <Controller name="isTemporaryTwoHouse" control={control} render={({ field }) => <BooleanSelect label="일시적 2주택 특례 가정" value={field.value} onChange={field.onChange} />} /> : null}
          <Controller name="floorAreaOver85" control={control} render={({ field }) => <BooleanSelect label="전용면적 85㎡ 초과" value={field.value} onChange={field.onChange} />} />
          <Controller
            name="firstHomeDiscountType"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">생애최초 감면</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="none">적용 안 함</option>
                  <option value="standard">일반 요건 최대 200만원</option>
                  <option value="expanded">특별대상 확인 · 최대 300만원</option>
                </select>
              </label>
            )}
          />
          <Controller name="brokerageRate" control={control} render={({ field }) => <PercentInput label="중개 협의요율" value={field.value ?? 0} onChange={field.onChange} helper="0이면 법정 상한요율 적용" min={0} max={10} />} />
          <Controller name="contractDeposit" control={control} render={({ field }) => <MoneyInput label="계약금" value={field.value} onChange={field.onChange} helper="추정하지 않고 실제 계약 예정 금액을 입력" />} />
          <Controller name="movingCost" control={control} render={({ field }) => <MoneyInput label="이사비" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="legalServiceCost" control={control} render={({ field }) => <MoneyInput label="법무비" value={field.value ?? 0} onChange={field.onChange} helper="견적 또는 직접 입력값만 반영" />} />
          <Controller name="otherCost" control={control} render={({ field }) => <MoneyInput label="기타 비용" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="targetEmergencyCash" control={control} render={({ field }) => <MoneyInput label="목표 비상자금" value={field.value ?? 0} onChange={field.onChange} />} />
        </div>
        <FormErrorSummary messages={[errors.mortgageAmount?.message, errors.contractDeposit?.message]} />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-brand-navy px-5 py-4 font-bold text-white transition hover:bg-blue-950">내 집 마련 총비용 계산하기</button>
      </form>
    </CalculatorWorkspace>
  );
}
