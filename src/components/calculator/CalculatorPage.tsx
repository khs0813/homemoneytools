import type { ReactNode } from "react";
import Link from "next/link";
import { AdFitBanner } from "@/components/adfit/AdFitBanner";
import type { CalculatorInfo } from "@/config/calculators";
import { DisclaimerBox } from "@/components/calculator/DisclaimerBox";
import { FaqJsonLd, FaqSection } from "@/components/calculator/FaqSection";
import { FormulaAccordion } from "@/components/calculator/FormulaAccordion";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { getPrimaryGuideForCalculator } from "@/config/guides";
import { housingReferenceBySlug } from "@/config/housing-content";
import { getSeoContent } from "@/config/seo-content";
import { BreadcrumbJsonLd, CalculatorJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export function CalculatorPage({ info, children }: { info: CalculatorInfo; children: ReactNode }) {
  const seoContent = getSeoContent(info.slug);
  const reference = housingReferenceBySlug[info.slug];
  const relatedGuide = getPrimaryGuideForCalculator(info.slug);

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
          <div className="text-sm font-semibold text-emerald-200">{info.category}</div>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{info.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-blue-50">{info.description}</p>
        </div>
        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-[728px] justify-center lg:min-w-0">
            <AdFitBanner unit="DAN-vydppL950Rcp0u3T" width="728" height="90" />
          </div>
        </div>
        <div className="relative mt-8">
          <div>{children}</div>
          <aside className="mt-6 flex justify-center xl:absolute xl:left-full xl:top-0 xl:ml-6 xl:mt-0">
            <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
          </aside>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">이 계산기로 확인할 수 있는 것</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• 입력값 기준 월 부담액과 총비용 구조</li>
              <li>• 금리 변동, 위험 구간, 해석 포인트</li>
              <li>• 계산 공식, 실제 사례, 자주 하는 실수</li>
              <li>• 관련 계산기 추천과 공식 참고 출처</li>
            </ul>
          </div>
          <DisclaimerBox />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">기준일과 수정일</h2>
            <dl className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-900">계산 기준일</dt>
                <dd className="mt-1">{reference?.referenceDate ?? "별도 제도 기준 없음"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">페이지 최종 수정일</dt>
                <dd className="mt-1">2026-06-04</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              실제 금리, 세율, 중개보수, 청약 기준은 기관 공지와 계약 조건에 따라 달라질 수 있으므로 중요한 결정 전에는 공식 출처를 다시 확인해야 합니다.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">신뢰 및 문의</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <p>
                운영 기준과 한계는 <Link href="/disclaimer" className="font-semibold text-brand-navy hover:underline">면책고지</Link>에서,
                개인정보 처리 기준은 <Link href="/privacy-policy" className="font-semibold text-brand-navy hover:underline">개인정보처리방침</Link>에서 확인할 수 있습니다.
              </p>
              <p>
                계산 기준 수정 요청이나 오류 제보는 <Link href="/contact" className="font-semibold text-brand-navy hover:underline">문의 페이지</Link>를 이용해 주세요.
              </p>
            </div>
          </div>
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
      </section>

      {reference ? (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-950">의사결정 해석 카드</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reference.decisionCards.map((card) => (
              <article key={card.title} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
              <h3 className="text-lg font-bold text-slate-950">위험 구간 체크</h3>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
                {reference.riskChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h3 className="text-lg font-bold text-slate-950">실제 사례로 보는 해석</h3>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
                {reference.caseStudies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {reference ? (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-950">실제 시나리오 표</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            아래 표는 이 계산기를 많이 쓰는 상황을 기준으로 무엇을 같이 확인해야 하는지 정리한 요약표입니다.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th className="rounded-l-2xl bg-slate-100 px-4 py-3 font-bold text-slate-950">상황</th>
                  <th className="bg-slate-100 px-4 py-3 font-bold text-slate-950">함께 볼 항목</th>
                  <th className="rounded-r-2xl bg-slate-100 px-4 py-3 font-bold text-slate-950">해석 포인트</th>
                </tr>
              </thead>
              <tbody>
                {reference.scenarioTable.map((row) => (
                  <tr key={row.scenario}>
                    <td className="border-b border-slate-100 px-4 py-4 align-top font-semibold text-slate-900">{row.scenario}</td>
                    <td className="border-b border-slate-100 px-4 py-4 align-top text-slate-600">{row.focus}</td>
                    <td className="border-b border-slate-100 px-4 py-4 align-top text-slate-600">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-black text-slate-950">실제 계산 예시</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {seoContent.examples.map((example) => (
            <article key={example.title} className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-slate-950">{example.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{example.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-black text-slate-950">주의사항과 참고 범위</h2>
        <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
          {seoContent.cautions.map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <strong>면책 안내:</strong> {seoContent.disclaimer}
        </div>
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="text-base font-bold text-slate-950">함께 검색되는 주제</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{seoContent.relatedSearches.join(" · ")}</p>
        </div>
      </section>

      {reference ? (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-950">계산 기준 및 참고 출처</h2>
          <div className="mt-4 grid gap-2 text-sm leading-7 text-slate-600 sm:grid-cols-2">
            <p>기준일: {reference.referenceDate}</p>
            <p>최종 수정일: 2026-06-04</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-slate-950">제도 해석 메모</h3>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
                {reference.policyNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-slate-950">공식 출처</h3>
              <div className="mt-4 grid gap-4">
                {reference.officialSources.map((source) => (
                  <div key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-brand-navy hover:underline">
                      {source.title}
                    </a>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{source.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {relatedGuide ? (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-950">함께 읽으면 좋은 정보 가이드</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            계산 결과를 바로 결론으로 쓰기보다, 실제 계약과 대출 판단에 필요한 사례와 제도 설명까지 같이 확인하는 편이 안전합니다.
          </p>
          <Link href={relatedGuide.path} className="mt-6 block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-navy hover:bg-slate-50">
            <p className="text-sm font-semibold text-brand-emerald">{relatedGuide.category}</p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">{relatedGuide.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{relatedGuide.description}</p>
            <div className="mt-4 text-sm font-bold text-brand-navy">가이드 읽기 →</div>
          </Link>
        </section>
      ) : null}

      <section className="mt-10 grid gap-6">
        <FormulaAccordion formula={info.formula} example={info.example} caution={info.caution} />
        <RelatedCalculators slugs={info.relatedSlugs} />
        <FaqSection faqs={info.faqs} />
      </section>
    </>
  );
}
