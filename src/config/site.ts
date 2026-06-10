import { fallbackSiteUrl, sanitizeSiteUrl } from "@/lib/site-url";

const siteUrl = sanitizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL, fallbackSiteUrl);

export const siteConfig = {
  name: "집계산",
  shortName: "집계산",
  tagline: "부동산·주거비 계산기",
  domainName: "jipcalc.co.kr",
  description: "전세대출 이자, 월세 vs 전세, DSR, 취득세, 중개수수료, 청약가점, 전월세 전환을 계산하고 해석까지 돕는 주거비 정보 서비스입니다.",
  url: siteUrl,
  contactEmail: "moneyfinancecalculator@gmail.com",
  locale: "ko_KR",
  language: "ko-KR",
  defaultOgImage: "/og-image.png",
  lastUpdated: "2026-06-04",
  themeColor: "#1E3A8A",
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  naverSiteVerification: "373edda71c9ce3b8da86b8877a5f91efbfdb61c5"
} as const;
