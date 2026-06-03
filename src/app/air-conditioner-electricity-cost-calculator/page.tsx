import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { AirConditionerElectricityCostCalculator } from "@/components/calculators/AirConditionerElectricityCostCalculator";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("air-conditioner-electricity-cost");

export const metadata = buildCalculatorMetadata(info);

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <CalculatorPage info={info}>
        <AirConditionerElectricityCostCalculator />
      </CalculatorPage>
    </main>
  );
}
