import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { DividendIncomeCalculator } from "@/components/calculators/DividendIncomeCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("dividend-income");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <DividendIncomeCalculator />
      </CalculatorPage>
    </main>
  );
}
