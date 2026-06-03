import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { ElectricityBillCalculator } from "@/components/calculators/ElectricityBillCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("electricity-bill");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <ElectricityBillCalculator />
      </CalculatorPage>
    </main>
  );
}
