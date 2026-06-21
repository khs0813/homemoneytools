import Script from "next/script";

const KAKAO_AD_SCRIPT_ID = "kakao-adfit-script";
const KAKAO_AD_SCRIPT_SRC = "https://t1.kakaocdn.net/kas/static/ba.min.js";

export function KakaoAdBanner() {
  return (
    <aside className="mx-auto mt-12 flex w-full max-w-6xl justify-center overflow-x-auto px-4" aria-label="광고">
      <div className="hidden md:block">
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit="DAN-3qIwFibVBOJIP7P3"
          data-ad-width="728"
          data-ad-height="90"
        />
      </div>
      <div className="md:hidden">
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit="DAN-5OUQxl2bPbnB5mxW"
          data-ad-width="320"
          data-ad-height="100"
        />
      </div>
      <Script id={KAKAO_AD_SCRIPT_ID} src={KAKAO_AD_SCRIPT_SRC} strategy="afterInteractive" />
    </aside>
  );
}
