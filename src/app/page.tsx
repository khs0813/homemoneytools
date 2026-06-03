import Link from "next/link";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { guides } from "@/config/guides";
import { buildPageMetadata } from "@/lib/seo";
import { CalculatorItemListJsonLd, WebPageJsonLd, WebsiteJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "생활 금융 계산기",
  "실수령액, 대출이자, 퇴직금, 배당금, 환율, 전기요금, 자동차 유지비, 월 생활비와 부동산 비용까지 계산하는 생활 금융 계산기입니다.",
  "/"
);

export default function HomePage() {
  const popular = calculators.filter((calculator) => ["take-home-pay", "loan-interest", "monthly-living-expense", "electricity-bill", "dividend-income", "overseas-stock-tax"].includes(calculator.slug));
  const updated = calculators.slice(0, 6);

  return (
    <>
      <WebsiteJsonLd />
      <WebPageJsonLd title="생활 금융 계산기" description="실수령액, 대출이자, 퇴직금, 배당금, 환율, 전기요금, 자동차 유지비, 월 생활비와 부동산 비용까지 계산하는 생활 금융 계산기입니다." path="/" />
      <CalculatorItemListJsonLd />
      <PageContainer className="py-10 md:py-16">
        <section className="rounded-[2rem] bg-gradient-to-br from-brand-navy via-blue-900 to-slate-950 px-6 py-12 text-white shadow-soft md:px-10 md:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15">콘텐츠 중심 생활 금융 계산기</div>
            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">계산 결과만 보여주는 얇은 페이지가 아니라, 해석까지 돕는 계산기 사이트</h1>
            <p className="mt-6 text-lg leading-8 text-blue-50">
              Home Money Calculator는 실수령액, 대출이자, 퇴직금, 배당금, 환율, 전기요금, 자동차 유지비, 월 생활비와 부동산 비용을 한 곳에서 계산하는 생활 금융 계산기 사이트입니다.
              각 계산기 페이지에는 계산 공식, 실제 예시, 결과 해석 방법, 자주 하는 실수, FAQ, 관련 계산기 링크, 면책 안내를 함께 넣어 단순 입력폼처럼 보이지 않도록 구성했습니다.
            </p>
            <p className="mt-4 text-base leading-8 text-blue-100">
              본 사이트의 계산 결과는 사용자가 입력한 값을 기준으로 산출한 참고용 정보이며, 실제 세금, 대출, 금융상품, 급여, 요금과 다를 수 있습니다.
              중요한 의사결정 전에는 금융기관, 세무사, 노무사 등 전문가 또는 공식 기관을 통해 확인하시기 바랍니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/calculators" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-brand-navy transition hover:bg-blue-50">계산기 전체 보기</Link>
              <Link href="/guides" className="rounded-2xl border border-white/30 px-6 py-4 text-center font-bold text-white transition hover:bg-white/10">정보성 가이드 보기</Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
            <p className="text-sm font-bold text-brand-emerald">왜 필요한가</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">생활비와 금융 계산이 필요한 이유</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              세전 연봉은 높아 보여도 실수령액 기준으로는 생활비가 빠듯할 수 있고, 대출이자는 금리 0.5%p 차이만으로도 총 비용이 크게 달라질 수 있습니다.
              전기요금, 자동차 유지비, 월 생활비도 합산해서 봐야 실제 현금흐름이 보입니다. 그래서 각 계산기를 따로 쓰기보다 내부 링크로 이어진 시나리오를 함께 보는 편이 더 실용적입니다.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-bold text-brand-emerald">카테고리</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">제공하는 계산기 범위</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm leading-7 text-slate-600">
              <p><strong className="text-slate-900">급여·세금:</strong> 실수령액, 퇴직금처럼 월급과 세후 현금흐름을 이해하는 계산기</p>
              <p><strong className="text-slate-900">대출·상환:</strong> 대출이자, DSR, 전세대출처럼 금리와 상환 구조를 비교하는 계산기</p>
              <p><strong className="text-slate-900">투자·환율:</strong> 배당금, 환율, 해외주식 양도세처럼 세후 수익과 원화 기준 손익을 보는 계산기</p>
              <p><strong className="text-slate-900">생활비·요금:</strong> 전기요금, 에어컨 전기세, 자동차 유지비, 월 생활비처럼 가계 지출을 점검하는 계산기</p>
            </div>
          </article>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-emerald">Popular calculators</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">인기 계산기</h2>
            </div>
            <Link href="/calculators" className="hidden text-sm font-bold text-brand-navy md:block">전체 보기 →</Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popular.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-emerald">Recently updated</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">최근 업데이트 계산기</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {updated.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold text-brand-emerald">추천 읽을거리</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">계산기와 함께 읽으면 좋은 가이드</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {guides.slice(0, 6).map((guide) => (
              <Link key={guide.slug} href={guide.path} className="rounded-2xl border border-slate-200 p-5 transition hover:border-brand-navy hover:bg-slate-50">
                <h3 className="text-lg font-bold text-slate-950">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-950">주요 계산기 바로가기</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            <Link href="/take-home-pay-calculator" className="font-semibold text-brand-navy hover:underline">실수령액 계산기</Link>, <Link href="/loan-interest-calculator" className="font-semibold text-brand-navy hover:underline">대출이자 계산기</Link>, <Link href="/severance-pay-calculator" className="font-semibold text-brand-navy hover:underline">퇴직금 계산기</Link>, <Link href="/dividend-income-calculator" className="font-semibold text-brand-navy hover:underline">배당금 계산기</Link>, <Link href="/exchange-rate-calculator" className="font-semibold text-brand-navy hover:underline">환율 계산기</Link>, <Link href="/overseas-stock-capital-gains-tax-calculator" className="font-semibold text-brand-navy hover:underline">해외주식 양도세 계산기</Link>, <Link href="/electricity-bill-calculator" className="font-semibold text-brand-navy hover:underline">전기요금 계산기</Link>, <Link href="/air-conditioner-electricity-cost-calculator" className="font-semibold text-brand-navy hover:underline">에어컨 전기세 계산기</Link>, <Link href="/car-maintenance-cost-calculator" className="font-semibold text-brand-navy hover:underline">자동차 유지비 계산기</Link>, <Link href="/monthly-living-expense-calculator" className="font-semibold text-brand-navy hover:underline">월 생활비 계산기</Link>를 바로 사용할 수 있습니다.
          </p>
        </section>
      </PageContainer>
    </>
  );
}
