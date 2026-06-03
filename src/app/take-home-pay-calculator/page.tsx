import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { TakeHomePayCalculator } from "@/components/calculators/TakeHomePayCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("take-home-pay");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <TakeHomePayCalculator />
      </CalculatorPage>
    </main>
  );
}
