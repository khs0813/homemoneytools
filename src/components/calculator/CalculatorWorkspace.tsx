import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalculatorWorkspaceProps = {
  children: ReactNode;
  result?: ReactNode;
  pinForm?: boolean;
};

export function CalculatorWorkspace({ children, result }: CalculatorWorkspaceProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className={cn("lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2")}>
        {children}
      </div>
      {result ?? null}
    </div>
  );
}
