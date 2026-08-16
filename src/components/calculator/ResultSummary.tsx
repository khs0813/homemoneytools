import type { ReactNode } from "react";

type ResultSummaryProps = {
  title: string;
  value?: string;
  description?: string;
  basisDate: string;
  assumptions: string[];
  children?: ReactNode;
};

export function ResultSummary({ title, value, description, basisDate, assumptions, children }: ResultSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6" aria-live="polite">
      <div className="text-sm font-semibold text-brand-emerald">계산 결과 요약</div>
      <h3 className="mt-2 text-lg font-bold text-slate-950">{title}</h3>
      {value ? <div className="mt-4 break-keep text-3xl font-black text-brand-navy md:text-4xl">{value}</div> : null}
      {description ? <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p> : null}
      <dl className="mt-5 grid gap-3 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
        <div className="grid gap-1 sm:grid-cols-[120px_minmax(0,1fr)]">
          <dt className="font-bold text-slate-950">기준일</dt>
          <dd>{basisDate}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[120px_minmax(0,1fr)]">
          <dt className="font-bold text-slate-950">계산 전제</dt>
          <dd>
            <ul className="grid gap-1">
              {assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      {children ? <div className="mt-5 space-y-3">{children}</div> : null}
    </section>
  );
}

