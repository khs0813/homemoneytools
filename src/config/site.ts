import { fallbackSiteUrl, sanitizeSiteUrl } from "@/lib/site-url";

const siteUrl = sanitizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL, fallbackSiteUrl);

export const siteConfig = {
  name: "Home Money Calculator",
  shortName: "빠르게 계산하는 주거비 도구",
  description: "전세대출 이자, 월세와 전세 비교, DSR, 취득세, 중개수수료, 월세 환산, 청약 가점을 계산하는 부동산·주거비 계산기입니다.",
  url: siteUrl,
  contactEmail: "moneyfinancecalculator@gmail.com",
  locale: "ko_KR",
  language: "ko-KR",
  defaultOgImage: "/og-image.png",
  lastUpdated: "2026-05-31",
  themeColor: "#1E3A8A",
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  naverSiteVerification: "373edda71c9ce3b8da86b8877a5f91efbfdb61c5"
} as const;
