import type { ReactNode } from "react";

export function ResultCard({ title, value, description, children }: { title: string; value?: string; description?: string; children?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft" aria-live="polite">
      <div className="text-sm font-semibold text-brand-emerald">계산 결과</div>
      <h3 className="mt-2 text-lg font-bold text-slate-950">{title}</h3>
      {value ? <div className="mt-4 break-keep text-3xl font-black text-brand-navy md:text-4xl">{value}</div> : null}
      {description ? <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-5 space-y-3">{children}</div> : null}
    </section>
  );
}
