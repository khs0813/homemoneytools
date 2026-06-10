import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata = {
  title: {
    absolute: "페이지를 찾을 수 없습니다 | 집계산"
  },
  description: "요청한 계산기 또는 가이드를 찾을 수 없습니다. 메인 페이지와 전체 계산기 목록에서 다시 찾아보세요.",
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <PageContainer className="py-16">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-bold text-brand-emerald">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          요청한 계산기나 가이드가 이동되었거나 존재하지 않습니다. 아래 링크에서 주요 페이지로 다시 이동할 수 있습니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-2xl bg-brand-navy px-5 py-3 font-bold text-white hover:bg-blue-950">메인으로 이동</Link>
          <Link href="/calculators" className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-900 hover:bg-slate-50">계산기 목록 보기</Link>
        </div>
      </section>
    </PageContainer>
  );
}
