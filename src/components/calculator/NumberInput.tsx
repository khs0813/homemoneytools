"use client";

import { clamp } from "@/lib/format";

export function NumberInput({ label, value, onChange, suffix, helper, required, min = 0, max = 1_000_000_000, step = 1 }: { label: string; value: number; onChange: (value: number) => void; suffix?: string; helper?: string; required?: boolean; min?: number; max?: number; step?: number }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}{required ? <span className="text-brand-orange"> *</span> : null}</span>
      <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white focus-within:border-brand-navy focus-within:ring-4 focus-within:ring-blue-50">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : min}
          onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
          className="min-w-0 flex-1 rounded-l-2xl border-0 bg-transparent px-4 py-3 text-base outline-none"
          aria-label={label}
        />
        {suffix ? <span className="flex items-center rounded-r-2xl border-l border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700">{suffix}</span> : null}
      </div>
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}
