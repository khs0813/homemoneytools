import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, CalculatorItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "전체 계산기 목록",
  "실수령액, 대출이자, 퇴직금, 배당금, 환율, 전기요금, 생활비, 부동산 비용 계산기를 한 곳에서 확인하세요.",
  "/calculators"
);

export default function CalculatorsPage() {
  return (
    <>
      <WebPageJsonLd title="전체 계산기 목록" description="실수령액, 대출이자, 퇴직금, 배당금, 환율, 전기요금, 생활비, 부동산 비용 계산기를 한 곳에서 확인하세요." path="/calculators" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "계산기", path: "/calculators" }]} />
      <CalculatorItemListJsonLd />
      <PageContainer className="py-10 md:py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-bold text-brand-emerald">Calculators</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">전체 계산기 목록</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            이 페이지는 급여·세금, 대출·상환, 투자·환율, 공과금·생활비, 부동산 비용 계산기를 카테고리별로 모아둔 허브 페이지입니다.
            각 계산기에는 계산 공식, 예시, 결과 해석, FAQ가 포함되어 있어 단순 도구가 아니라 설명형 콘텐츠로 활용할 수 있습니다.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            결과는 참고용이며 실제 세금, 대출 심사, 급여명세서, 공과금 청구액과 차이가 날 수 있습니다. 중요한 결정 전에는 반드시 공식 기관 또는 전문가 확인이 필요합니다.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
        </div>
      </PageContainer>
    </>
  );
}
