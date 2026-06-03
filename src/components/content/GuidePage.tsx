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

          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <h2 className="text-lg font-bold">참고용 면책 안내</h2>
            <p className="mt-3">
              본 사이트의 계산 결과와 가이드 내용은 사용자가 입력한 값을 기준으로 산출한 참고용 정보이며, 실제 세금,
              대출, 금융상품, 급여, 요금과 다를 수 있습니다. 중요한 의사결정 전에는 금융기관, 세무사, 노무사 등 전문가 또는 공식 기관을 통해 확인하시기 바랍니다.
            </p>
          </section>

          <section className="mt-10 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">관련 계산기 바로가기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">가이드에서 본 내용을 바로 숫자로 확인해보세요.</p>
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
