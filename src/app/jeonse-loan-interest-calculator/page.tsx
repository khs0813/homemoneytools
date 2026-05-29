import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { JeonseLoanCalculator } from "@/components/calculators/JeonseLoanCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("jeonse-loan-interest");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <JeonseLoanCalculator />
      </CalculatorPage>
    </main>
  );
}
