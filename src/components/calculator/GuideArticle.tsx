import Link from "next/link";
import type { CalculatorInfo } from "@/config/calculators";
import { FaqJsonLd, FaqSection } from "@/components/calculator/FaqSection";
import { PageContainer } from "@/components/layout/PageContainer";
import { getSeoContent } from "@/config/seo-content";
import { ArticleJsonLd, BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export function GuideArticle({ info }: { info: CalculatorInfo }) {
  const content = getSeoContent(info.slug);

  return (
    <>
      <WebPageJsonLd title={`${info.title} 가이드`} description={info.description} path={info.guidePath} />
      <FaqJsonLd faqs={info.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: "가이드", path: "/guides" },
          { name: `${info.title} 가이드`, path: info.guidePath }
        ]}
      />
      <ArticleJsonLd info={info} />
      <PageContainer className="py-10 md:py-14">
        <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-10">
          <p className="text-sm font-bold text-brand-emerald">부동산 계산 가이드</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{info.title} 가이드</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{info.description}</p>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">이 계산기는 무엇인가요?</h2>
            <div className="mt-3 grid gap-3 leading-8 text-slate-600">
              {content.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">입력값 설명</h2>
            <dl className="mt-4 grid gap-4">
              {content.inputs.map((item) => (
                <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
                  <dt className="font-bold text-slate-950">{item.name}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">{item.description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">계산 공식</h2>
            <p className="mt-3 leading-8 text-slate-600">{info.formula}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">계산 예시</h2>
            <p className="mt-3 leading-8 text-slate-600">{info.example}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">결과 해석 방법</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-slate-600">
              {content.interpretation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">자주 하는 실수</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-slate-600">
              {content.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">결과를 해석할 때 주의할 점</h2>
            <p className="mt-3 leading-8 text-slate-600">{info.caution}</p>
            <p className="mt-3 leading-8 text-slate-600">
              특히 취득세, DSR, 청약 가점, 중개보수는 법령, 지역, 금융기관 기준, 모집공고에 따라 달라질 수 있습니다.
              실제 계약이나 대출 신청, 세금 신고 전에 반드시 최신 기준을 확인하세요.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">함께 보면 좋은 검색 주제</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{content.relatedSearches.join(" · ")}</p>
          </section>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">바로 계산하기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">아래 버튼을 눌러 입력값을 넣고 직접 계산해보세요.</p>
            <Link href={info.path} className="mt-4 inline-flex rounded-2xl bg-brand-navy px-5 py-3 font-bold text-white hover:bg-blue-950">
              {info.title} 열기
            </Link>
          </div>
        </article>
        <div className="mx-auto mt-8 max-w-3xl">
          <FaqSection faqs={info.faqs} />
        </div>
      </PageContainer>
    </>
  );
}
