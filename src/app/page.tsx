import Link from "next/link";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators } from "@/config/calculators";
import { buildPageMetadata } from "@/lib/seo";
import { CalculatorItemListJsonLd, WebPageJsonLd, WebsiteJsonLd } from "@/lib/json-ld";

export const metadata = buildPageMetadata(
  "부동산·주거비 계산기",
  "집을 구하기 전 전세대출 이자, 월세와 전세 비교, DSR, 취득세, 중개수수료, 월세 환산, 청약 가점을 계산해보세요.",
  "/"
);

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <WebPageJsonLd title="부동산·주거비 계산기" description="집을 구하기 전 전세대출 이자, 월세와 전세 비교, DSR, 취득세, 중개수수료, 월세 환산, 청약 가점을 계산해보세요." path="/" />
      <CalculatorItemListJsonLd />
      <PageContainer className="py-10 md:py-16">
      <section className="rounded-[2rem] bg-gradient-to-br from-brand-navy via-blue-900 to-slate-950 px-6 py-12 text-white shadow-soft md:px-10 md:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15">빠르게 계산하는 주거비 도구</div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">집을 구하기 전, 필요한 돈을 먼저 계산하세요.</h1>
          <p className="mt-6 text-lg leading-8 text-blue-50">
            전세대출 이자부터 월세와 전세 비교, DSR, 취득세, 중개수수료, 월세 환산, 청약 가점까지 한 번에 확인할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/calculators" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-brand-navy transition hover:bg-blue-50">계산기 전체 보기</Link>
            <Link href="/jeonse-loan-interest-calculator" className="rounded-2xl border border-white/30 px-6 py-4 text-center font-bold text-white transition hover:bg-white/10">전세대출 이자 계산</Link>
          </div>
        </div>
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
          {calculators.map((calculator) => <CalculatorCard key={calculator.slug} calculator={calculator} />)}
        </div>
      </section>

      </PageContainer>
    </>
  );
}
