import type { NextConfig } from "next";

const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https:",
  "connect-src 'self' https:",
  "frame-src https:"
].join("; ");

const contentSecurityPolicy = "upgrade-insecure-requests";

const publicAdFitEnv = {
  PUBLIC_ADFIT_HOME_MOBILE: process.env.PUBLIC_ADFIT_HOME_MOBILE ?? process.env.NEXT_PUBLIC_ADFIT_HOME_MOBILE ?? "",
  PUBLIC_ADFIT_HOME_DESKTOP: process.env.PUBLIC_ADFIT_HOME_DESKTOP ?? process.env.NEXT_PUBLIC_ADFIT_HOME_DESKTOP ?? "",
  PUBLIC_ADFIT_GUIDE_MOBILE: process.env.PUBLIC_ADFIT_GUIDE_MOBILE ?? process.env.NEXT_PUBLIC_ADFIT_GUIDE_MOBILE ?? "",
  PUBLIC_ADFIT_GUIDE_DESKTOP: process.env.PUBLIC_ADFIT_GUIDE_DESKTOP ?? process.env.NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP ?? "",
  PUBLIC_ADFIT_CALC_ARTICLE_MOBILE: process.env.PUBLIC_ADFIT_CALC_ARTICLE_MOBILE ?? process.env.NEXT_PUBLIC_ADFIT_CALC_ARTICLE_MOBILE ?? "",
  PUBLIC_ADFIT_CALC_ARTICLE_DESKTOP: process.env.PUBLIC_ADFIT_CALC_ARTICLE_DESKTOP ?? process.env.NEXT_PUBLIC_ADFIT_CALC_ARTICLE_DESKTOP ?? "",
  PUBLIC_ADFIT_CALC_POST_TOOL_MOBILE: process.env.PUBLIC_ADFIT_CALC_POST_TOOL_MOBILE ?? process.env.NEXT_PUBLIC_ADFIT_CALC_POST_TOOL_MOBILE ?? "",
  PUBLIC_ADFIT_CALC_POST_TOOL_DESKTOP: process.env.PUBLIC_ADFIT_CALC_POST_TOOL_DESKTOP ?? process.env.NEXT_PUBLIC_ADFIT_CALC_POST_TOOL_DESKTOP ?? ""
};

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicyReportOnly }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  env: publicAdFitEnv,
  experimental: {
    cpus: 2
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/severance-pay-calculator",
        destination: "https://www.moneycalculator.co.kr/severance-pay-calculator",
        statusCode: 301
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.jipcalc.co.kr" }],
        destination: "https://jipcalc.co.kr/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
