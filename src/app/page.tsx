import Link from "next/link";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { RecentCalculations } from "@/components/calculator/RecentCalculations";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { guides } from "@/config/guides";
import { isHousingCalculator } from "@/config/housing-content";
import { buildPageMetadata } from "@/lib/seo";
import { CalculatorItemListJsonLd, WebPageJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "전세·월세·매매 주거비 계산기",
  "전세대출 이자, 월세 vs 전세, DSR, 취득세, 중개수수료, 전월세 전환, 청약가점을 계산하고 해석까지 돕는 주거비 정보 서비스입니다.",
  "/"
);

export default function HomePage() {
  const visibleCalculators = calculators.filter((calculator) => isHousingCalculator(calculator.slug));
  const popular = visibleCalculators;

  return (
    <>
      <WebPageJsonLd title="전세·월세·매매 주거비 계산기" description="전세대출 이자, 월세 vs 전세, DSR, 취득세, 중개수수료, 전월세 전환, 청약가점을 계산하고 해석까지 돕는 주거비 정보 서비스입니다." path="/" />
      <CalculatorItemListJsonLd />
      <PageContainer className="py-10 md:py-16">
        <div className="relative">
          <section className="rounded-[2rem] bg-gradient-to-br from-brand-navy via-blue-900 to-slate-950 px-5 py-8 text-white shadow-soft sm:px-6 md:px-10 md:py-12">
            <div className="max-w-5xl">
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15">주거비 의사결정 계산 서비스</div>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">집계산</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50 md:text-lg md:leading-8">
                전세·월세 비교에서 대출 부담, DSR, 취득세, 중개수수료, 매수에 필요한 총 현금까지 이어서 계산합니다.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/jeonse-loan-interest-calculator" className="rounded-2xl bg-white px-4 py-4 font-bold text-brand-navy transition hover:bg-blue-50">
                  전세대출 월이자 계산
                </Link>
                <Link href="/rent-vs-jeonse-calculator" className="rounded-2xl bg-white/10 px-4 py-4 font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
                  월세와 전세 총비용 비교
                </Link>
                <Link href="/dsr-calculator" className="rounded-2xl bg-white/10 px-4 py-4 font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
                  DSR과 월 원리금 확인
                </Link>
                <Link href="/home-purchase-total-cost-calculator" className="rounded-2xl bg-white/10 px-4 py-4 font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
                  집 살 때 초기비용 확인
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="relative mt-12">
          <section className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-bold text-brand-emerald">전세·월세</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">월세가 비싸 보여도 전세가 더 부담일 수 있습니다</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                전세는 월세가 없다는 이유로 저렴해 보이지만, 보증금 기회비용과 전세대출 이자를 더하면 총주거비가 달라집니다. 월세 보증금이 큰 반전세도 단순 월세만 보면 오판하기 쉽습니다.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-bold text-brand-emerald">매매·대출</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">집값보다 먼저 봐야 하는 것은 자금 구조입니다</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                주택담보대출 DSR, 취득세, 중개수수료는 집을 살 수 있는지와 동시에 실제로 감당 가능한지를 결정합니다. 금리 0.5%p 변화와 주택 수 판단 차이만으로도 결과가 크게 달라질 수 있습니다.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-bold text-brand-emerald">청약</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">청약가점은 점수 확인이 아니라 전략 판단입니다</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                무주택기간, 부양가족수, 통장 가입기간을 단순 합산하는 것만으로는 부족합니다. 현재 점수로 기다릴 가치가 있는지, 전세나 매수와 병행해 볼지 자금계획과 함께 해석해야 합니다.
              </p>
            </article>
          </section>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-brand-emerald">신뢰 표시</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">계산기마다 기준일과 수정일을 표시합니다</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              전세대출, DSR, 취득세, 중개보수, 청약가점처럼 제도 변화가 중요한 계산기는 공식 출처와 기준일을 함께 보여 주고, 페이지 공통 수정일도 노출합니다.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-brand-emerald">콘텐츠 깊이</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">예시 계산과 위험 구간 해석을 함께 제공합니다</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              단순 계산 결과만 보여주지 않고, 실제 시나리오 표, 해석 카드, 자주 하는 실수, FAQ를 통해 왜 이 숫자가 중요한지 설명합니다.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-brand-emerald">운영 원칙</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">정책·문의 페이지를 항상 접근 가능하게 유지합니다</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              개인정보처리방침, 이용약관, 면책고지, 문의 페이지는 헤더와 푸터 구조 안에서 쉽게 접근할 수 있도록 유지하고, 광고보다 콘텐츠를 우선 배치합니다.
            </p>
          </article>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-emerald">Key calculators</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">핵심 주거비 계산기</h2>
            </div>
            <Link href="/calculators" className="hidden text-sm font-bold text-brand-navy md:block">전체 보기 →</Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popular.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
          </div>
        </section>

        <div className="mt-12">
          <RecentCalculations />
        </div>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <p className="text-sm font-bold text-brand-emerald">검색형 콘텐츠</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">계산기와 함께 읽으면 좋은 주거비 가이드</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <Link key={guide.slug} href={guide.path} className="rounded-2xl border border-slate-200 p-5 transition hover:border-brand-navy hover:bg-slate-50">
                <h3 className="text-lg font-bold text-slate-950">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-950">이 사이트를 어떻게 활용하면 좋을까</h2>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
            <p>1. 먼저 <Link href="/rent-vs-jeonse-calculator" className="font-semibold text-brand-navy hover:underline">월세 vs 전세 계산기</Link>와 <Link href="/jeonse-loan-interest-calculator" className="font-semibold text-brand-navy hover:underline">전세대출 이자 계산기</Link>로 현재 거주 대안을 비교합니다.</p>
            <p>2. 매수를 고민한다면 <Link href="/dsr-calculator" className="font-semibold text-brand-navy hover:underline">DSR 계산기</Link>, <Link href="/acquisition-tax-calculator" className="font-semibold text-brand-navy hover:underline">취득세 계산기</Link>, <Link href="/real-estate-brokerage-fee-calculator" className="font-semibold text-brand-navy hover:underline">중개수수료 계산기</Link>를 같이 봅니다.</p>
            <p>3. 청약을 고민한다면 <Link href="/housing-subscription-score-calculator" className="font-semibold text-brand-navy hover:underline">청약가점 계산기</Link>와 가이드를 함께 읽고 현재 점수와 자금계획을 같이 판단합니다.</p>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
