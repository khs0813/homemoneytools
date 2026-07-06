import Link from "next/link";
import type { CalculatorInfo } from "@/config/calculators";
import { FaqJsonLd, FaqSection } from "@/components/calculator/FaqSection";
import { PageContainer } from "@/components/layout/PageContainer";
import { housingReferenceBySlug } from "@/config/housing-content";
import { getSeoContent } from "@/config/seo-content";
import { ArticleJsonLd, BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export function GuideArticle({ info }: { info: CalculatorInfo }) {
  const content = getSeoContent(info.slug);
  const reference = housingReferenceBySlug[info.slug];

  return (
    <>
      <WebPageJsonLd title={`${info.title} 계산 기준 해설`} description={info.description} path={info.guidePath} />
      <FaqJsonLd faqs={info.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: "가이드", path: "/guides" },
          { name: `${info.title} 계산 기준 해설`, path: info.guidePath }
        ]}
      />
      <ArticleJsonLd info={info} />
      <PageContainer className="py-10 md:py-14">
        <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6 md:p-10">
          <p className="text-sm font-bold text-brand-emerald">주거비 계산 해설</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{info.title} 계산 기준 해설</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">이 페이지는 계산기 사용법 자체보다, 어떤 상황에서 이 계산이 필요하고 무엇을 주의해야 하는지 설명하는 해설 페이지입니다.</p>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">계산 기준일</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{reference?.referenceDate ?? "2026-06-03"}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">이 계산이 필요한 상황</h2>
            <div className="mt-4 grid gap-4 leading-8 text-slate-600">
              {content.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          {reference ? (
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-slate-950">실제 사례로 이해하기</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-slate-600">
                {reference.caseStudies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">계산 결과를 해석할 때 보는 항목</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-slate-600">
              {content.interpretation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {reference ? (
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-slate-950">관련 제도 설명</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-slate-600">
                {reference.policyNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">자주 하는 실수와 주의사항</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-slate-600">
              {content.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {reference?.riskChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {reference ? (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold text-slate-950">공식 출처</h2>
              <div className="mt-4 grid gap-4">
                {reference.officialSources.map((source) => (
                  <div key={source.url} className="rounded-2xl bg-slate-50 p-4">
                    <a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-brand-navy hover:underline">{source.title}</a>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{source.note}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">바로 계산하기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">해설을 읽었다면 입력값을 넣고 직접 시나리오를 비교해보세요.</p>
            <Link href={info.path} className="mt-4 inline-flex rounded-2xl bg-brand-navy px-5 py-3 font-bold text-white hover:bg-blue-950">
              {info.title} 열기
            </Link>
          </div>
        </article>
        <div className="mx-auto mt-8 max-w-4xl">
          <FaqSection faqs={info.faqs} />
        </div>
      </PageContainer>
    </>
  );
}
