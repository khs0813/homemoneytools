import Link from "next/link";
import type { CalculatorInfo } from "@/config/calculators";

export function CalculatorCard({ calculator }: { calculator: CalculatorInfo }) {
  return (
    <Link href={calculator.path} className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="text-sm font-semibold text-brand-emerald">{calculator.category}</div>
      <h3 className="mt-2 text-xl font-bold text-slate-950 group-hover:text-brand-navy">{calculator.title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{calculator.description}</p>
      <div className="mt-5 text-sm font-semibold text-brand-navy">바로 계산하기 →</div>
    </Link>
  );
}
