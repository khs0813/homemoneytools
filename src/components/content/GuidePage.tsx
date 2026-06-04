import Link from "next/link";
import { FaqJsonLd, FaqSection } from "@/components/calculator/FaqSection";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Guide } from "@/config/guides";
import { BreadcrumbJsonLd, GenericArticleJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export function GuidePage({ guide }: { guide: Guide }) {
  return (
    <>
      <WebPageJsonLd title={guide.title} description={guide.description} path={guide.path} />
      <FaqJsonLd faqs={guide.faqs} />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: "가이드", path: "/guides" }, { name: guide.title, path: guide.path }]} />
      <GenericArticleJsonLd title={guide.title} description={guide.description} path={guide.path} />
      <PageContainer className="py-10 md:py-14">
        <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-10">
          <p className="text-sm font-bold text-brand-emerald">{guide.category}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{guide.h1}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{guide.description}</p>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">계산 기준일과 제도 메모</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">기준일: {guide.referenceDate}</p>
            <p className="mt-1 text-sm leading-7 text-slate-600">최종 수정일: 2026-06-04</p>
            <ul className="mt-3 grid gap-2 text-sm leading-7 text-slate-600">
              {guide.policySummary.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          {guide.body.map((section) => (
            <section key={section.heading} className="mt-10 border-t border-slate-100 pt-8 first:border-t-0 first:pt-0">
              <h2 className="text-2xl font-black text-slate-950">{section.heading}</h2>
              <div className="mt-4 grid gap-4 text-base leading-8 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.subheadings?.map((sub) => (
                <div key={sub.heading} className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-950">{sub.heading}</h3>
                  <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-600">
                    {sub.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-950">공식 출처</h2>
            <div className="mt-4 grid gap-4">
              {guide.officialSources.map((source) => (
                <div key={source.url} className="rounded-2xl bg-slate-50 p-4">
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-brand-navy hover:underline">
                    {source.title}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{source.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <h2 className="text-lg font-bold">면책 안내</h2>
            <p className="mt-3">
              본 글은 공개된 제도와 기준을 이해하기 쉽게 정리한 참고용 콘텐츠입니다. 실제 대출 조건, 취득세, 청약 기준, 중개보수, 전월세 계약 조건은 개인 상황과 최신 제도 변경에 따라 달라질 수 있습니다. 중요한 의사결정 전에는 공식 기관과 관계 기관 확인이 필요합니다.
            </p>
          </section>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">정책 및 문의 링크</h2>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
              <p>
                계산 한계와 책임 범위는 <Link href="/disclaimer" className="font-semibold text-brand-navy hover:underline">면책고지</Link>에서 확인할 수 있습니다.
              </p>
              <p>
                기준 오류나 링크 문제 제보는 <Link href="/contact" className="font-semibold text-brand-navy hover:underline">문의 페이지</Link>를 이용해 주세요.
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">관련 계산기 바로가기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">글에서 본 내용을 실제 숫자로 검토해보세요.</p>
            <div className="mt-6">
              <RelatedCalculators slugs={guide.relatedCalculatorSlugs} />
            </div>
            <div className="mt-4">
              <Link href="/guides" className="text-sm font-bold text-brand-navy hover:underline">전체 가이드 목록 보기</Link>
            </div>
          </section>
        </article>
        <div className="mx-auto mt-8 max-w-4xl">
          <FaqSection faqs={guide.faqs} />
        </div>
      </PageContainer>
    </>
  );
}
