"use client";

import { useEffect } from "react";

const ADFIT_SDK_SRC = "https://t1.kakaocdn.net/kas/static/ba.min.js";

type AdFitGlobal = {
  adfit?: { init?: () => void } | (() => void);
  __kakaoAdFitSdkLoading?: boolean;
  __kakaoAdFitInitTimer?: number;
};

type AdFitBannerProps = {
  unit: string;
  width: string;
  height: string;
};

function runAdFitInit() {
  const adfit = (window as Window & AdFitGlobal).adfit;
  const init = typeof adfit === "function" ? adfit : adfit?.init;

  if (typeof init === "function") {
    const win = window as Window & AdFitGlobal;

    if (win.__kakaoAdFitInitTimer) {
      window.clearTimeout(win.__kakaoAdFitInitTimer);
    }

    win.__kakaoAdFitInitTimer = window.setTimeout(() => {
      win.__kakaoAdFitInitTimer = undefined;
      init();
    }, 0);
  }
}

function loadAdFitSdk() {
  const win = window as Window & AdFitGlobal;

  if (win.adfit) {
    runAdFitInit();
    return;
  }

  if (win.__kakaoAdFitSdkLoading) {
    return;
  }

  win.__kakaoAdFitSdkLoading = true;

  const script = document.createElement("script");
  script.async = true;
  script.type = "text/javascript";
  script.src = ADFIT_SDK_SRC;
  script.dataset.kakaoAdfitSdk = "true";
  script.onload = () => {
    win.__kakaoAdFitSdkLoading = false;
  };
  script.onerror = () => {
    win.__kakaoAdFitSdkLoading = false;
  };

  document.body.appendChild(script);
}

export function AdFitBanner({ unit, width, height }: AdFitBannerProps) {
  useEffect(() => {
    loadAdFitSdk();
  }, []);

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit={unit}
      data-ad-width={width}
      data-ad-height={height}
    />
  );
}
