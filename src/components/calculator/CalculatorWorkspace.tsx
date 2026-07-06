import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalculatorWorkspaceProps = {
  children: ReactNode;
  result?: ReactNode;
  pinForm?: boolean;
};

export function CalculatorWorkspace({ children, result }: CalculatorWorkspaceProps) {
  const hasResult = Boolean(result);

  return (
    <div className={cn("grid min-w-0 gap-6 lg:items-start", hasResult && "lg:grid-cols-[minmax(0,1fr)_380px]")}>
      <div className={cn("min-w-0", hasResult && "lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2")}>
        {children}
      </div>
      {result}
    </div>
  );
}
