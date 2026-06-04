import Link from "next/link";
import { calculators } from "@/config/calculators";
import { isHousingCalculator } from "@/config/housing-content";
import { siteConfig } from "@/config/site";

const policyLinks = [
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의" },
  { href: "/privacy-policy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
  { href: "/disclaimer", label: "면책고지" }
];

export function Footer() {
  const visibleCalculators = calculators.filter((calculator) => isHousingCalculator(calculator.slug));

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="text-lg font-bold text-brand-navy">{siteConfig.name}</div>
          <p className="mt-1 text-sm text-slate-500">{siteConfig.domainName}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            전세, 월세, 매매, 대출, 청약, 취득세처럼 주거비 의사결정에 필요한 계산과 해석을 함께 제공하는 정보 서비스입니다.
            각 페이지에는 계산 공식, 결과 해석, 위험 구간, FAQ, 공식 참고 출처를 함께 정리해 단순 템플릿 사이트처럼 보이지 않도록 구성했습니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            문의: <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>
        <div>
          <div className="font-semibold text-slate-900">주요 계산기</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            {visibleCalculators.map((calculator) => (
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
            계산 결과는 참고용이며 실제 세금, 대출, 청약, 중개보수, 급여, 요금과 다를 수 있습니다. 중요한 결정 전에는 공식 기관과 전문가 기준을 확인하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
