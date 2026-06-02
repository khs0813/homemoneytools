import type { ReactNode } from "react";
import type { CalculatorInfo } from "@/config/calculators";
import { DisclaimerBox } from "@/components/calculator/DisclaimerBox";
import { FaqJsonLd, FaqSection } from "@/components/calculator/FaqSection";
import { FormulaAccordion } from "@/components/calculator/FormulaAccordion";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { getSeoContent } from "@/config/seo-content";
import { BreadcrumbJsonLd, CalculatorJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export function CalculatorPage({ info, children }: { info: CalculatorInfo; children: ReactNode }) {
  const seoContent = getSeoContent(info.slug);

  return (
    <>
      <WebPageJsonLd title={info.title} description={info.description} path={info.path} />
      <FaqJsonLd faqs={info.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: "계산기", path: "/calculators" },
          { name: info.title, path: info.path }
        ]}
      />
      <CalculatorJsonLd info={info} />
      <section>
        <div className="rounded-3xl bg-gradient-to-br from-brand-navy to-slate-900 p-8 text-white shadow-soft">
          <div className="text-sm font-semibold text-emerald-200">부동산·주거비 계산기</div>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{info.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-blue-50">{info.description}</p>
        </div>
        <div className="mt-8">{children}</div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">이 계산기로 확인할 수 있는 것</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• 입력값 기준 예상 비용</li>
              <li>• 계산 공식과 예시</li>
              <li>• 관련 계산기 바로가기</li>
              <li>• 공유 가능한 URL</li>
            </ul>
          </div>
          <DisclaimerBox />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold text-brand-emerald">계산 전 확인사항</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">{info.shortTitle} 계산 전 알아둘 내용</h2>
        <div className="mt-5 grid gap-4 text-base leading-8 text-slate-600">
          {seoContent.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-950">주요 입력값</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {seoContent.inputs.map((item) => (
                <li key={item.name}>
                  <strong className="text-slate-900">{item.name}</strong>: {item.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-950">결과 해석 방법</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">
              {seoContent.interpretation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-950">자주 하는 실수</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">
              {seoContent.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="text-base font-bold text-slate-950">함께 검색되는 주제</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{seoContent.relatedSearches.join(" · ")}</p>
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        <FormulaAccordion formula={info.formula} example={info.example} caution={info.caution} />
        <RelatedCalculators slugs={info.relatedSlugs} />
        <FaqSection faqs={info.faqs} />
      </section>
    </>
  );
}
