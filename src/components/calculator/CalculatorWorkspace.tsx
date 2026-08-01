"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AdFitSlot } from "@/components/adfit/AdFitSlot";
import { cn } from "@/lib/utils";

type CalculatorWorkspaceProps = {
  children: ReactNode;
  result?: ReactNode;
  pinForm?: boolean;
};

export function CalculatorWorkspace({ children, result }: CalculatorWorkspaceProps) {
  const hasResult = Boolean(result);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasResult || !resultRef.current) {
      return;
    }

    const resultElement = resultRef.current;
    const frame = window.requestAnimationFrame(() => {
      const isMobileLayout = window.matchMedia("(max-width: 1023px)").matches;

      if (!isMobileLayout) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      resultElement.focus({ preventScroll: true });
      resultElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hasResult, result]);

  return (
    <div className={cn("grid min-w-0 gap-6 lg:items-start", hasResult && "lg:grid-cols-[minmax(0,1fr)_380px]")}>
      <div className={cn("min-w-0", hasResult && "lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2")}>
        {children}
      </div>
      {hasResult ? (
        <div ref={resultRef} className="scroll-mt-24 focus:outline-none" tabIndex={-1}>
          {result}
          <AdFitSlot placement="result_primary" />
        </div>
      ) : null}
    </div>
  );
}
