import { AdFitBanner } from "@/components/adfit/AdFitBanner";

export function AdFitTopBanner() {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[728px] justify-center lg:min-w-0">
        <AdFitBanner unit="DAN-vydppL950Rcp0u3T" width="728" height="90" />
      </div>
    </div>
  );
}

export function AdFitVerticalBanner() {
  return <AdFitBanner unit="DAN-3zihtfJ5ImCC9NOc" width="160" height="600" />;
}

export function AdFitSideBanner({ showVertical = true }: { showVertical?: boolean }) {
  return (
    <aside className="mt-6 flex flex-col items-center gap-4 xl:absolute xl:-top-64 xl:left-full xl:ml-6 xl:mt-0">
      <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
      {showVertical ? <AdFitVerticalBanner /> : null}
    </aside>
  );
}

export function AdFitInlineBanner() {
  return (
    <aside className="mt-8 flex justify-center">
      <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
    </aside>
  );
}
