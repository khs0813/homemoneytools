import Link from "next/link";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="text-lg font-bold text-brand-navy">{siteConfig.name}</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            집을 구하기 전 필요한 비용을 쉽고 빠르게 계산할 수 있는 참고용 부동산 계산기입니다.
            모든 계산은 DB 저장 없이 브라우저와 서버 계산 함수로 처리됩니다.
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
          <p className="mt-3 text-sm leading-6 text-slate-600">
            본 서비스의 계산 결과는 참고용입니다. 실제 세금, 대출 가능 금액, 중개보수, 청약가점은 관련 기관과 전문가에게 확인하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
