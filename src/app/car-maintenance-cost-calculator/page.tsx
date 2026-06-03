import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { CarMaintenanceCostCalculator } from "@/components/calculators/CarMaintenanceCostCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("car-maintenance-cost");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <CarMaintenanceCostCalculator />
      </CalculatorPage>
    </main>
  );
}
