"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/calculator/MoneyInput";
import { NumberInput } from "@/components/calculator/NumberInput";
import { PercentInput } from "@/components/calculator/PercentInput";
import { QuickPresetGroup } from "@/components/calculator/QuickPresetGroup";
import { ResultRow } from "@/components/calculator/ResultRow";
import { ResultSummary } from "@/components/calculator/ResultSummary";
import { ShareButton } from "@/components/calculator/ShareButton";
import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { dsrRules } from "@/config/dsr-rules";
import { trackGrowthEvent } from "@/lib/analytics";
import { calculateDsr } from "@/lib/calculators/dsr";
import { formatCurrency, formatPercent, MAX_SAFE_MONEY_AMOUNT, MAX_SAFE_RATE_PERCENT, MAX_SAFE_YEARS } from "@/lib/format";
import { getEnumParam, getNumberParam, writeQueryState } from "@/lib/query-state";

const schema = z.object({
  annualIncome: z.number().finite().min(1).max(MAX_SAFE_MONEY_AMOUNT),
  mortgageAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT),
  mortgageRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT),
  mortgageYears: z.number().finite().min(1).max(MAX_SAFE_YEARS),
  existingCreditLoanAmount: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  existingCreditLoanRate: z.number().finite().min(0).max(MAX_SAFE_RATE_PERCENT).optional(),
  otherAnnualRepayment: z.number().finite().min(0).max(MAX_SAFE_MONEY_AMOUNT).optional(),
  dsrLimit: z.number().finite().min(1).max(100),
  stressRate: z.number().finite().min(0).max(10).optional(),
  creditLoanMode: z.enum(["interest-only", "amortized"])
});

type FormValues = z.infer<typeof schema>;
type Result = (ReturnType<typeof calculateDsr> & {
  halfPointUpAssessmentDsrDelta: number;
}) | null;

const defaultValues: FormValues = {
  annualIncome: 70_000_000,
  mortgageAmount: 300_000_000,
  mortgageRate: 4.5,
  mortgageYears: 30,
  existingCreditLoanAmount: 20_000_000,
  existingCreditLoanRate: 5,
  otherAnnualRepayment: 0,
  dsrLimit: 40,
  stressRate: dsrRules.defaultStressRate,
  creditLoanMode: "amortized"
};

const analyticsContext = { calculator_type: "dsr", content_cluster: "housing" };

export function DsrCalculator() {
  const [result, setResult] = useState<Result>(null);
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });
  const annualIncome = useWatch({ control, name: "annualIncome" });
  const dsrLimit = useWatch({ control, name: "dsrLimit" });
  const existingCreditLoanAmount = useWatch({ control, name: "existingCreditLoanAmount" });
  const mortgageYears = useWatch({ control, name: "mortgageYears" });

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
    const halfPointUp = calculateDsr({ ...values, mortgageRate: values.mortgageRate + 0.5 });
    setResult({
      ...calculated,
      halfPointUpAssessmentDsrDelta: halfPointUp.assessmentDsr - calculated.assessmentDsr
    });
    trackGrowthEvent("calculator_complete", analyticsContext);
    writeQueryState(values);
  }

  const statusText = result?.status === "safe" ? "기준 이내입니다" : result?.status === "warning" ? "주의 구간입니다" : "기준 초과 가능성이 있습니다";
  const marginLabel = result && result.remainingAnnualRepaymentCapacity >= 0 ? "기준 대비 여유 비율" : "기준 초과 비율";
  const marginRatio = result ? Math.abs(result.assessmentDsr - result.dsrLimit) : 0;
  const existingLoanShare = result && result.totalAnnualRepayment > 0
    ? (result.annualCreditPayment + result.otherAnnualRepayment) / result.totalAnnualRepayment * 100
    : 0;

  return (
    <CalculatorWorkspace
      analyticsContext={analyticsContext}
      pinForm={Boolean(result)}
      result={result ? (
        <ResultSummary
          title={statusText}
          value={formatPercent(result.assessmentDsr)}
          description={`${result.useStressAssessment ? "스트레스 DSR" : "일반 DSR"} 기준 상환 여력 참고값입니다. 금융회사 실제 승인 한도가 아닙니다.`}
          basisDate="2026-07-01"
          assumptions={[
            `DSR 규칙 버전 ${result.version}을 사용합니다.`,
            "주담대 월 상환액은 기존 대출 계산 서비스의 원리금균등 공식을 사용합니다.",
            "신용대출은 선택한 방식에 따라 5년 산정만기 또는 이자만 현금흐름 참고값으로 반영합니다."
          ]}
        >
          <ResultRow label="일반 DSR" value={formatPercent(result.dsr)} />
          <ResultRow label="스트레스 DSR" value={formatPercent(result.stressedDsr)} />
          <ResultRow label="목표 기준" value={formatPercent(result.dsrLimit)} />
          <ResultRow label={marginLabel} value={formatPercent(marginRatio, 2)} />
          <ResultRow label="실제 기준 연간 원리금" value={formatCurrency(result.totalAnnualRepayment)} />
          <ResultRow label="실제 기준 월환산 원리금" value={formatCurrency(result.monthlyAverageRepayment)} />
          <ResultRow label="심사용 연간 원리금" value={formatCurrency(result.assessmentTotalAnnualRepayment)} />
          <ResultRow label="심사용 월환산 원리금" value={formatCurrency(result.assessmentMonthlyAverageRepayment)} />
          <ResultRow label="주담대 연상환액(계약금리)" value={formatCurrency(result.annualMortgagePayment)} />
          <ResultRow label="기존대출 반영액" value={formatCurrency(result.annualCreditPayment + result.otherAnnualRepayment)} />
          <ResultRow label="기존 대출이 차지하는 비중" value={formatPercent(existingLoanShare, 2)} />
          <ResultRow label="금리 0.5%p 상승 시 DSR 차이" value={`${formatPercent(Math.abs(result.halfPointUpAssessmentDsrDelta), 2)}p`} />
          <ResultRow label="기준 대비 여유 금액" value={formatCurrency(result.remainingAnnualRepaymentCapacity)} />
          <ResultRow label="적용한 계산 공식" value="DSR = 연간 원리금 상환액 ÷ 연소득 × 100" />
          {result.creditLoanMode === "interest-only" ? <ResultRow label="주의" value="신용대출을 이자만 반영한 현금흐름 참고값입니다." /> : null}
          <ShareButton />
        </ResultSummary>
      ) : null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <div className="mb-6 grid gap-3">
          <QuickPresetGroup
            label="연소득 빠른 선택"
            calculatorType="dsr"
            options={[
              { label: "5,000만원", name: "income_50m", selected: annualIncome === 50_000_000, onSelect: () => setValue("annualIncome", 50_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "7,000만원", name: "income_70m", selected: annualIncome === 70_000_000, onSelect: () => setValue("annualIncome", 70_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "1억원", name: "income_100m", selected: annualIncome === 100_000_000, onSelect: () => setValue("annualIncome", 100_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "income_custom", selected: ![50_000_000, 70_000_000, 100_000_000].includes(annualIncome), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="DSR 기준 빠른 선택"
            calculatorType="dsr"
            options={[
              { label: "40%", name: "dsr_limit_40", selected: dsrLimit === 40, onSelect: () => setValue("dsrLimit", 40, { shouldDirty: true, shouldValidate: true }) },
              { label: "50%", name: "dsr_limit_50", selected: dsrLimit === 50, onSelect: () => setValue("dsrLimit", 50, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "dsr_limit_custom", selected: ![40, 50].includes(dsrLimit), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="기존 신용대출 빠른 선택"
            calculatorType="dsr"
            options={[
              { label: "없음", name: "credit_loan_none", selected: existingCreditLoanAmount === 0, onSelect: () => setValue("existingCreditLoanAmount", 0, { shouldDirty: true, shouldValidate: true }) },
              { label: "3,000만원", name: "credit_loan_30m", selected: existingCreditLoanAmount === 30_000_000, onSelect: () => setValue("existingCreditLoanAmount", 30_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "5,000만원", name: "credit_loan_50m", selected: existingCreditLoanAmount === 50_000_000, onSelect: () => setValue("existingCreditLoanAmount", 50_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "1억원", name: "credit_loan_100m", selected: existingCreditLoanAmount === 100_000_000, onSelect: () => setValue("existingCreditLoanAmount", 100_000_000, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "credit_loan_custom", selected: ![0, 30_000_000, 50_000_000, 100_000_000].includes(existingCreditLoanAmount ?? 0), onSelect: () => undefined }
            ]}
          />
          <QuickPresetGroup
            label="주담대 기간 빠른 선택"
            calculatorType="dsr"
            options={[
              { label: "20년", name: "mortgage_years_20", selected: mortgageYears === 20, onSelect: () => setValue("mortgageYears", 20, { shouldDirty: true, shouldValidate: true }) },
              { label: "30년", name: "mortgage_years_30", selected: mortgageYears === 30, onSelect: () => setValue("mortgageYears", 30, { shouldDirty: true, shouldValidate: true }) },
              { label: "40년", name: "mortgage_years_40", selected: mortgageYears === 40, onSelect: () => setValue("mortgageYears", 40, { shouldDirty: true, shouldValidate: true }) },
              { label: "직접 입력", name: "mortgage_years_custom", selected: ![20, 30, 40].includes(mortgageYears), onSelect: () => undefined }
            ]}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="annualIncome" control={control} render={({ field }) => <MoneyInput label="연소득" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageAmount" control={control} render={({ field }) => <MoneyInput label="주택담보대출 금액" required value={field.value} onChange={field.onChange} />} />
          <Controller name="mortgageRate" control={control} render={({ field }) => <PercentInput label="주담대 금리" required value={field.value} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="mortgageYears" control={control} render={({ field }) => <NumberInput label="주담대 기간" required suffix="년" value={field.value} onChange={field.onChange} min={1} max={50} />} />
          <Controller name="existingCreditLoanAmount" control={control} render={({ field }) => <MoneyInput label="기존 신용대출 잔액" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="existingCreditLoanRate" control={control} render={({ field }) => <PercentInput label="기존 신용대출 금리" value={field.value ?? 0} onChange={field.onChange} min={0} max={30} />} />
          <Controller name="otherAnnualRepayment" control={control} render={({ field }) => <MoneyInput label="기타대출 연상환액" value={field.value ?? 0} onChange={field.onChange} />} />
          <Controller name="dsrLimit" control={control} render={({ field }) => <NumberInput label="DSR 기준" suffix="%" value={field.value} onChange={field.onChange} min={1} max={100} />} />
          <Controller name="stressRate" control={control} render={({ field }) => <PercentInput label="스트레스 금리" value={field.value ?? 0} onChange={field.onChange} helper="2026년 하반기 참고값: 수도권·규제지역 변동형 3.0%, 지방 비규제지역 변동형 0.75%, 기타 적용대상 대출 1.5%. 혼합·주기형은 실제 상품값을 입력하세요." min={0} max={10} />} />
          <Controller
            name="creditLoanMode"
            control={control}
            render={({ field }) => (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">신용대출 반영 방식</span>
                <select {...field} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-navy focus:ring-4 focus:ring-blue-50">
                  <option value="amortized">DSR 산정상 5년 만기 가정</option>
                  <option value="interest-only">이자만 반영(현금흐름 참고)</option>
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
