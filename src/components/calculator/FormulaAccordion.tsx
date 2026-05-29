export function FormulaAccordion({ formula, example, caution }: { formula: string; example: string; caution: string }) {
  return (
    <div className="space-y-3">
      <details className="rounded-2xl border border-slate-200 bg-white p-5" open>
        <summary className="cursor-pointer font-bold text-slate-950">계산 공식</summary>
        <p className="mt-3 text-sm leading-7 text-slate-600">{formula}</p>
      </details>
      <details className="rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer font-bold text-slate-950">계산 예시</summary>
        <p className="mt-3 text-sm leading-7 text-slate-600">{example}</p>
      </details>
      <details className="rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer font-bold text-slate-950">주의사항</summary>
        <p className="mt-3 text-sm leading-7 text-slate-600">{caution}</p>
      </details>
    </div>
  );
}
