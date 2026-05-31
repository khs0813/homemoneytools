import Link from "next/link";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

export function Footer() {
  const policyLinks = [
    { href: "/privacy-policy", label: "개인정보처리방침" },
    { href: "/terms", label: "이용약관" },
    { href: "/disclaimer", label: "면책고지" },
    { href: "/contact", label: "문의" }
  ];

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="text-lg font-bold text-brand-navy">{siteConfig.name}</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            집을 구하기 전 필요한 비용을 쉽고 빠르게 계산할 수 있는 참고용 부동산 계산기입니다.
            모든 계산은 DB 저장 없이 브라우저와 서버 계산 함수로 처리됩니다.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            문의: <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>
        <div>
          <div className="font-semibold text-slate-900">계산기</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            {calculators.map((calculator) => (
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
            계산 결과는 참고용입니다. 실제 세금, 대출, 중개보수, 청약가점은 관련 기관과 전문가에게 확인하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
