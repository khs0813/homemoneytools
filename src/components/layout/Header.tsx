"use client";

import Link from "next/link";
import { useRef } from "react";
import { calculators } from "@/config/calculators";
import { isHousingCalculator } from "@/config/housing-content";
import { siteConfig } from "@/config/site";

export function Header() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const featuredCalculators = calculators.filter((calculator) => isHousingCalculator(calculator.slug));
  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex min-h-11 min-w-11 items-center font-bold text-brand-navy">
          <span className="hidden sm:inline">{siteConfig.name}</span>
          <span className="sm:hidden">{siteConfig.shortName}</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
          <Link href="/calculators" className="hover:text-brand-navy">주거비 계산기</Link>
          <Link href="/guides" className="hover:text-brand-navy">주거비 가이드</Link>
          <Link href="/about" className="hover:text-brand-navy">사이트 소개</Link>
          <Link href="/contact" className="hover:text-brand-navy">문의</Link>
        </nav>
        <details ref={mobileMenuRef} className="relative md:hidden">
          <summary className="flex min-h-11 cursor-pointer items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">메뉴</summary>
          <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
            <Link href="/calculators" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-slate-50" onClick={closeMobileMenu}>주거비 계산기</Link>
            <Link href="/guides" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-slate-50" onClick={closeMobileMenu}>주거비 가이드</Link>
            <Link href="/about" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-slate-50" onClick={closeMobileMenu}>사이트 소개</Link>
            <Link href="/contact" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-slate-50" onClick={closeMobileMenu}>문의</Link>
            <div className="mt-2 border-t border-slate-100 pt-2">
              {featuredCalculators.map((calculator) => (
                <Link key={calculator.slug} href={calculator.path} className="flex min-h-11 items-center rounded-xl px-3 text-sm text-slate-600 hover:bg-slate-50" onClick={closeMobileMenu}>
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
