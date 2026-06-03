import Link from "next/link";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

const featured = ["take-home-pay", "loan-interest", "monthly-living-expense", "electricity-bill"];

export function Header() {
  const featuredCalculators = calculators.filter((calculator) => featured.includes(calculator.slug));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-navy">
          <span className="flex h-9 w-20 items-center justify-center whitespace-nowrap rounded-2xl bg-brand-navy px-2 text-xs text-white">생활 금융</span>
          <span>{siteConfig.shortName}</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
          <Link href="/calculators" className="hover:text-brand-navy">계산기 목록</Link>
          <Link href="/guides" className="hover:text-brand-navy">가이드</Link>
          <Link href="/about" className="hover:text-brand-navy">소개</Link>
          <Link href="/contact" className="hover:text-brand-navy">문의</Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">메뉴</summary>
          <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
            <Link href="/calculators" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">계산기 목록</Link>
            <Link href="/guides" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">가이드</Link>
            <Link href="/about" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">소개</Link>
            <Link href="/contact" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">문의</Link>
            <div className="mt-2 border-t border-slate-100 pt-2">
              {featuredCalculators.map((calculator) => (
                <Link key={calculator.slug} href={calculator.path} className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  {calculator.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
