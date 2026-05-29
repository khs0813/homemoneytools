import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { BrokerageFeeCalculator } from "@/components/calculators/BrokerageFeeCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("brokerage-fee");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <BrokerageFeeCalculator />
      </CalculatorPage>
    </main>
  );
}
