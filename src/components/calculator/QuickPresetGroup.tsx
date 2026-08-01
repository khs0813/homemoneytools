"use client";

import { trackGrowthEvent } from "@/lib/analytics";

export type QuickPresetOption = {
  label: string;
  name: string;
  selected?: boolean;
  onSelect: () => void;
};

type QuickPresetGroupProps = {
  label: string;
  calculatorType: string;
  options: QuickPresetOption[];
};

export function QuickPresetGroup({ label, calculatorType, options }: QuickPresetGroupProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-sm font-bold text-slate-800">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.name}
            type="button"
            aria-pressed={option.selected ? "true" : "false"}
            onClick={() => {
              option.onSelect();
              trackGrowthEvent("preset_selected", {
                calculator_type: calculatorType,
                content_cluster: "housing",
                preset_name: option.name,
                source_section: "quick_preset"
              });
            }}
            className={[
              "min-h-11 rounded-xl border px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue-100",
              option.selected
                ? "border-brand-navy bg-brand-navy text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-navy hover:text-brand-navy"
            ].join(" ")}
          >
            {option.selected ? `${option.label} 선택됨` : option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

