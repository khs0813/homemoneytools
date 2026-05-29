"use client";

import { useMemo, useState } from "react";
import { clamp, formatNumber, MAX_SAFE_MONEY_AMOUNT, parseDigits } from "@/lib/format";

export type MoneyInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helper?: string;
  required?: boolean;
};

export function MoneyInput({ label, value, onChange, helper, required }: MoneyInputProps) {
  const [unit, setUnit] = useState<"won" | "manwon">("manwon");
  const factor = unit === "manwon" ? 10_000 : 1;
  const displayValue = useMemo(() => formatNumber(value / factor), [value, factor]);

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}{required ? <span className="text-brand-orange"> *</span> : null}</span>
      <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white focus-within:border-brand-navy focus-within:ring-4 focus-within:ring-blue-50">
        <input
          inputMode="numeric"
          value={displayValue}
          onChange={(event) => onChange(clamp(parseDigits(event.target.value, Math.floor(MAX_SAFE_MONEY_AMOUNT / factor)) * factor, 0, MAX_SAFE_MONEY_AMOUNT))}
          className="min-w-0 flex-1 rounded-l-2xl border-0 bg-transparent px-4 py-3 text-base outline-none"
          aria-label={label}
        />
        <select
          value={unit}
          onChange={(event) => setUnit(event.target.value as "won" | "manwon")}
          className="w-20 shrink-0 rounded-r-2xl border-l border-slate-200 bg-slate-50 px-3 text-center text-sm font-semibold text-slate-700 outline-none"
          aria-label={`${label} 단위`}
        >
          <option value="manwon">만원</option>
          <option value="won">원</option>
        </select>
      </div>
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}
