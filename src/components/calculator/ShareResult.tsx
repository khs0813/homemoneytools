"use client";

import { useState } from "react";
import { buildFragmentUrl } from "@/lib/fragment-state";
import { trackGrowthEvent } from "@/lib/analytics";

type ShareResultProps = {
  title: string;
  text: string;
  path: string;
  fragmentState?: Record<string, string | number | boolean | undefined | null>;
};

export function ShareResult({ title, text, path, fragmentState = {} }: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof window === "undefined") return;

    trackGrowthEvent("share_result_click", { source_section: "result_summary" });
    const url = buildFragmentUrl(path, fragmentState);
    const shareText = `${text}\n\n입력 조건이 공유될 수 있으니 링크 전달 전 내용을 확인하세요.`;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text: shareText, url });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={share} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:text-brand-navy">
      {copied ? "공유 내용 복사 완료" : "계산 결과 공유"}
    </button>
  );
}

