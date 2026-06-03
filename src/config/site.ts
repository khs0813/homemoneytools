import { fallbackSiteUrl, sanitizeSiteUrl } from "@/lib/site-url";

const siteUrl = sanitizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL, fallbackSiteUrl);

export const siteConfig = {
  name: "Home Money Calculator",
  shortName: "머니 계산기",
  description: "실수령액, 대출이자, 퇴직금, 배당금, 환율, 전기요금, 생활비, 부동산 비용까지 한 번에 계산하는 생활 금융 계산기입니다.",
  url: siteUrl,
  contactEmail: "moneyfinancecalculator@gmail.com",
  locale: "ko_KR",
  language: "ko-KR",
  defaultOgImage: "/og-image.png",
  lastUpdated: "2026-06-03",
  themeColor: "#1E3A8A",
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  naverSiteVerification: "373edda71c9ce3b8da86b8877a5f91efbfdb61c5"
} as const;
