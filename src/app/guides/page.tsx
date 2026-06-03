import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { guides } from "@/config/guides";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, GuideItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "생활 금융 가이드",
  "실수령액, 대출이자, 퇴직금, 해외주식 세금, 전기요금, 자동차 유지비, 생활비 예산을 설명하는 정보성 가이드 모음입니다.",
  "/guides"
);

export default function GuidesPage() {
  return (
    <>
      <WebPageJsonLd title="생활 금융 가이드" description="실수령액, 대출이자, 퇴직금, 해외주식 세금, 전기요금, 자동차 유지비, 생활비 예산을 설명하는 정보성 가이드 모음입니다." path="/guides" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "가이드", path: "/guides" }]} />
      <GuideItemListJsonLd />
      <PageContainer className="py-10 md:py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-bold text-brand-emerald">Guides</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">생활 금융 가이드</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            계산기만으로는 판단이 어려운 사용자를 위해 실수령액, 대출이자, 상환방식, 퇴직금, 해외주식 세금, 전기요금 누진제, 에어컨 냉방비, 자동차 유지비, 생활비 예산처럼 자주 묻는 주제를 설명형 콘텐츠로 정리했습니다.
            모든 글은 H1/H2/H3 구조, FAQ, 관련 계산기 링크를 포함합니다.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <Link key={guide.slug} href={guide.path} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <p className="text-sm font-semibold text-brand-emerald">{guide.category}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">{guide.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p>
              <div className="mt-5 text-sm font-bold text-brand-navy">읽어보기 →</div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
