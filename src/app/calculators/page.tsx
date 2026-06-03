import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { isHousingCalculator } from "@/config/housing-content";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, CalculatorItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "주거비 계산기 목록",
  "전세대출 이자, 월세 vs 전세, DSR, 취득세, 중개수수료, 전월세 전환, 청약가점을 계산하는 주거비 계산기 목록입니다.",
  "/calculators"
);

export default function CalculatorsPage() {
  const visibleCalculators = calculators.filter((calculator) => isHousingCalculator(calculator.slug));

  return (
    <>
      <WebPageJsonLd title="주거비 계산기 목록" description="전세대출 이자, 월세 vs 전세, DSR, 취득세, 중개수수료, 전월세 전환, 청약가점을 계산하는 주거비 계산기 목록입니다." path="/calculators" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "계산기", path: "/calculators" }]} />
      <CalculatorItemListJsonLd />
      <PageContainer className="py-10 md:py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-bold text-brand-emerald">주거비 계산기</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">주거비 계산기 목록</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            전세, 월세, 매매, 대출, 청약처럼 집을 구하고 유지하는 과정에서 실제로 자주 부딪히는 비용을 계산할 수 있는 페이지입니다.
            각 계산기에는 월 부담액, 총비용, 금리 변화 영향, 위험 구간, FAQ, 공식 참고 출처를 함께 정리했습니다.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleCalculators.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
        </div>
      </PageContainer>
    </>
  );
}
