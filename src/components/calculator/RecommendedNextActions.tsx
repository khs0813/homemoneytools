"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackGrowthEvent } from "@/lib/analytics";

export type RecommendedNextAction = {
  href: string;
  title: string;
  description: string;
};

type RecommendedNextActionsProps = {
  calculatorType: string;
  actions: RecommendedNextAction[];
};

export function RecommendedNextActions({ calculatorType, actions }: RecommendedNextActionsProps) {
  const visibleActions = actions.slice(0, 3);

  useEffect(() => {
    if (visibleActions.length === 0) return;
    trackGrowthEvent("next_action_view", {
      calculator_type: calculatorType,
      content_cluster: "housing",
      source_section: "recommended_next_actions"
    });
  }, [calculatorType, visibleActions.length]);

  if (visibleActions.length === 0) return null;

  return (
    <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-base font-black text-slate-950">다음에 확인할 계산</h3>
      <div className="mt-4 grid gap-3">
        {visibleActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-navy hover:bg-white"
            onClick={() => trackGrowthEvent("next_action_click", {
              calculator_type: calculatorType,
              content_cluster: "housing",
              source_section: "recommended_next_actions",
              target_path: action.href.split("#")[0]
            })}
          >
            <span className="font-bold text-slate-950">{action.title}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">{action.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

