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
            전세·월세·매매 과정에서 필요한 비용과 대출 조건을 계산하고,
            적용 공식과 기준일, 공식 출처를 함께 확인할 수 있습니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            문의: <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>
        <div>
          <div className="font-semibold text-slate-900">주요 계산기</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            {visibleCalculators.map((calculator) => (
              <Link key={calculator.slug} href={calculator.path} className="flex min-h-10 items-center hover:text-brand-navy">{calculator.shortTitle}</Link>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">안내</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex min-h-10 items-center hover:text-brand-navy">{link.label}</Link>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            계산 결과는 참고용이며 실제 대출 조건, 취득세, 청약 기준, 중개보수, 계약 조건과 다를 수 있습니다. 중요한 결정 전에는 금융기관과 관계 기관의 최신 기준을 확인하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
