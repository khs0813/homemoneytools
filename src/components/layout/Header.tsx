import Link from "next/link";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-navy text-white">H</span>
          <span>HomeCalc</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/calculators" className="hover:text-brand-navy">계산기 목록</Link>
          <Link href="/guides" className="hover:text-brand-navy">부동산 가이드</Link>
          <Link href="/contact" className="hover:text-brand-navy">문의</Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">메뉴</summary>
          <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
            <Link href="/calculators" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">계산기 목록</Link>
            <Link href="/guides" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">부동산 가이드</Link>
            <Link href="/contact" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">문의</Link>
            <div className="mt-2 border-t border-slate-100 pt-2">
              {calculators.map((calculator) => (
                <Link key={calculator.slug} href={calculator.path} className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  {calculator.shortTitle}
                </Link>
              ))}
            </div>
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-2 block rounded-xl border-t border-slate-100 px-3 py-2 pt-4 text-sm text-slate-600 hover:bg-slate-50">
              {siteConfig.contactEmail}
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
