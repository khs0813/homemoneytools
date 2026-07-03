import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'report-sample' https://t1.kakaocdn.net",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' 'report-sample'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://analytics.ad.daum.net https://aem-kakao-collector.onkakao.net https://kaat.daum.net https://kuid-provider.ds.kakao.com https://serv.ds.kakao.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src https://display.ad.daum.net https://serv.ds.kakao.com https://t1.daumcdn.net https://t1.kakaocdn.net",
  "frame-ancestors 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests"
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), browsing-topics=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
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
  }
};

export default nextConfig;
