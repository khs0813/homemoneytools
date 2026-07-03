import Link from "next/link";
import { AdFitSideBanner, AdFitTopBanner } from "@/components/adfit/AdFitPageAds";
import { PageContainer } from "@/components/layout/PageContainer";
import { guides } from "@/config/guides";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, GuideItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "주거비 정보 가이드",
  "전세대출, 월세 vs 전세, DSR 40%, 취득세, 중개수수료, 청약가점처럼 실제 검색 유입이 가능한 주거비 정보 가이드 모음입니다.",
  "/guides"
);

export default function GuidesPage() {
  return (
    <>
      <WebPageJsonLd title="주거비 정보 가이드" description="전세대출, 월세 vs 전세, DSR 40%, 취득세, 중개수수료, 청약가점처럼 실제 검색 유입이 가능한 주거비 정보 가이드 모음입니다." path="/guides" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "가이드", path: "/guides" }]} />
      <GuideItemListJsonLd />
      <PageContainer className="py-10 md:py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-bold text-brand-emerald">주거비 가이드</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">주거비 정보 가이드</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            계산기 결과만으로 판단하기 어려운 사용자를 위해 전세대출 이자 계산 실수, 월세 vs 전세 판단법, DSR 40% 의미, 취득세 체크포인트, 중개수수료 협의 방법, 청약가점 해석처럼 실제 검색 의도에 맞는 독립형 글을 모았습니다.
            각 글에는 실제 사례, 주의사항, FAQ, 계산 기준일, 공식 출처, 관련 계산기 링크를 포함했습니다.
          </p>
        </div>
        <AdFitTopBanner />
        <div className="relative mt-8">
          <div className="grid gap-5 md:grid-cols-2">
            {guides.map((guide) => (
              <Link key={guide.slug} href={guide.path} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <p className="text-sm font-semibold text-brand-emerald">{guide.category}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">{guide.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p>
                <div className="mt-5 text-sm font-bold text-brand-navy">읽어보기 →</div>
              </Link>
            ))}
          </div>
          <AdFitSideBanner />
        </div>
      </PageContainer>
    </>
  );
}
