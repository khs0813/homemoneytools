"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearRecentCalculations, loadRecentCalculations, type RecentCalculation } from "@/lib/recent-calculations";
import { trackGrowthEvent } from "@/lib/analytics";

export function RecentCalculations() {
  const [items, setItems] = useState<RecentCalculation[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setItems(loadRecentCalculations()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-brand-emerald">최근 계산</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">이어서 볼 계산</h2>
        </div>
        <button
          type="button"
          className="min-h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-600 hover:border-brand-navy hover:text-brand-navy"
          onClick={() => {
            clearRecentCalculations();
            setItems([]);
          }}
        >
          전체 삭제
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={`${item.calculator_type}-${item.saved_at}`}
            href={item.page_path}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-navy hover:bg-white"
            onClick={() => trackGrowthEvent("recent_calculation_open", {
              calculator_type: item.calculator_type,
              content_cluster: "housing",
              source_section: "recent_calculations",
              target_path: item.page_path
            })}
          >
            <div className="font-bold text-slate-950">{item.summary}</div>
            <time className="mt-2 block text-xs text-slate-500" dateTime={item.saved_at}>
              {new Date(item.saved_at).toLocaleDateString("ko-KR")}
            </time>
          </Link>
        ))}
      </div>
    </section>
  );
}
