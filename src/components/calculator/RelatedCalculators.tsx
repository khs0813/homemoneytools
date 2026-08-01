"use client";

import Link from "next/link";
import { getRelatedCalculators } from "@/config/calculators";
import { trackGrowthEvent } from "@/lib/analytics";

export function RelatedCalculators({ slugs }: { slugs: string[] }) {
  const related = getRelatedCalculators(slugs);
  function trackClick(targetPath: string) {
    trackGrowthEvent("related_calculator_click", { source_section: "related_calculators", target_path: targetPath });
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/guides/")) {
      trackGrowthEvent("guide_to_calculator_click", { source_section: "guide_related_calculators", target_path: targetPath });
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-slate-950">관련 계산기</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {related.map((calculator) => (
          <Link
            key={calculator.slug}
            href={calculator.path}
            className="rounded-2xl border border-slate-200 p-4 transition hover:border-brand-navy hover:bg-slate-50"
            onClick={() => trackClick(calculator.path)}
          >
            <div className="font-bold text-slate-900">{calculator.shortTitle}</div>
            <p className="mt-2 text-sm leading-5 text-slate-600">{calculator.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
