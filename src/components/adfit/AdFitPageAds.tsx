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

export function AdFitSideBanner() {
  return (
    <aside className="mt-6 flex justify-center xl:absolute xl:left-full xl:top-0 xl:ml-6 xl:mt-0">
      <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
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
