import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, CalculatorItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "전체 계산기 목록",
  "전세대출, 월세와 전세 비교, DSR, 취득세, 중개수수료, 월세 환산, 청약 가점 계산기를 한 곳에서 확인하세요.",
  "/calculators"
);

export default function CalculatorsPage() {
  return (
    <>
      <WebPageJsonLd title="전체 계산기 목록" description="전세대출, 월세와 전세 비교, DSR, 취득세, 중개수수료, 월세 환산, 청약 가점 계산기를 한 곳에서 확인하세요." path="/calculators" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "계산기", path: "/calculators" }]} />
      <CalculatorItemListJsonLd />
      <PageContainer className="py-10 md:py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold text-brand-emerald">Calculators</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">전체 계산기 목록</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">집을 사거나 전세·월세를 구할 때 필요한 비용을 계산할 수 있는 도구입니다.</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
      </div>
      </PageContainer>
    </>
  );
}
