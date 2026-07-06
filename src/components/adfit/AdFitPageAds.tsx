import { AdFitBanner } from "@/components/adfit/AdFitBanner";

export function AdFitTopBanner() {
  return (
    <>
      <div className="-mx-4 mt-6 flex justify-center overflow-hidden md:hidden">
        <AdFitBanner unit="DAN-MxttnTNbygaLu9ii" width="320" height="50" />
      </div>
      <div className="mt-8 hidden overflow-x-auto md:block">
        <div className="flex min-w-[728px] justify-center lg:min-w-0">
          <AdFitBanner unit="DAN-vydppL950Rcp0u3T" width="728" height="90" />
        </div>
      </div>
    </>
  );
}

export function AdFitVerticalBanner() {
  return <AdFitBanner unit="DAN-3zihtfJ5ImCC9NOc" width="160" height="600" />;
}

export function AdFitMobileRectangleBanner() {
  return (
    <div className="-mx-4 flex justify-center overflow-hidden md:hidden">
      <AdFitBanner unit="DAN-tzq6el4IGCSFEnSl" width="320" height="480" />
    </div>
  );
}

export function AdFitSideBanner({ showVertical = true }: { showVertical?: boolean }) {
  return (
    <aside className="mt-6 flex flex-col items-center gap-4 xl:absolute xl:-top-64 xl:left-full xl:ml-6 xl:mt-0">
      <AdFitMobileRectangleBanner />
      <div className="hidden justify-center md:flex">
        <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
      </div>
      {showVertical ? (
        <div className="hidden xl:block">
          <AdFitVerticalBanner />
        </div>
      ) : null}
    </aside>
  );
}

export function AdFitInlineBanner() {
  return (
    <aside className="mt-8">
      <AdFitMobileRectangleBanner />
      <div className="hidden justify-center md:flex">
        <AdFitBanner unit="DAN-4cOowgAme3T2tNK2" width="300" height="250" />
      </div>
    </aside>
  );
}
