import Link from "next/link";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

const policyLinks = [
  { href: "/about", label: "사이트 소개" },
  { href: "/privacy-policy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
  { href: "/disclaimer", label: "면책고지" },
  { href: "/contact", label: "문의" }
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="text-lg font-bold text-brand-navy">{siteConfig.name}</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            급여, 세금, 대출, 투자, 공과금, 생활비, 부동산 비용을 빠르게 점검할 수 있는 참고용 생활 금융 계산기입니다.
            입력값은 회원 DB에 저장하지 않으며, 각 페이지에 계산 공식과 해석 가이드를 함께 제공합니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            문의: <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>
        <div>
          <div className="font-semibold text-slate-900">인기 계산기</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            {calculators.slice(0, 8).map((calculator) => (
              <Link key={calculator.slug} href={calculator.path} className="hover:text-brand-navy">{calculator.shortTitle}</Link>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">안내</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-navy">{link.label}</Link>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            계산 결과는 참고용입니다. 실제 세금, 대출, 금융상품, 급여, 요금과 다를 수 있으므로 중요한 결정 전에는 전문가와 공식 기관 기준을 확인하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
