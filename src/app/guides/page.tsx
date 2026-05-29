import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, GuideItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "부동산 계산 가이드",
  "전세대출 이자, 월세와 전세 비교, DSR, 취득세, 중개수수료, 청약 가점 계산 방법과 결과 해석법을 쉽게 설명합니다.",
  "/guides"
);

export default function GuidesPage() {
  return (
    <>
      <WebPageJsonLd title="부동산 계산 가이드" description="전세대출 이자, 월세와 전세 비교, DSR, 취득세, 중개수수료, 청약 가점 계산 방법과 결과 해석법을 쉽게 설명합니다." path="/guides" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "가이드", path: "/guides" }]} />
      <GuideItemListJsonLd />
      <PageContainer className="py-10 md:py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold text-brand-emerald">Guides</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">부동산 계산 가이드</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">각 계산기의 의미, 입력값, 공식, 결과 해석 방법을 정리했습니다.</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {calculators.map((calculator) => (
          <Link key={calculator.slug} href={calculator.guidePath} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <h2 className="text-xl font-bold text-slate-950">{calculator.title} 가이드</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{calculator.description}</p>
            <div className="mt-5 text-sm font-bold text-brand-navy">읽어보기 →</div>
          </Link>
        ))}
      </div>
      </PageContainer>
    </>
  );
}
