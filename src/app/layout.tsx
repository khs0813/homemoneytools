import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { KakaoAdBanner } from "@/components/ads/KakaoAdBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/config/site";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/json-ld";

const ogImage = {
  url: siteConfig.defaultOgImage,
  width: 1200,
  height: 630,
  alt: `${siteConfig.shortName} 주거비 계산기`
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
  colorScheme: "light"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.shortName} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.shortName}`
  },
  description: siteConfig.description,
  generator: "Next.js",
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "finance",
  classification: "Personal finance calculators",
  manifest: "/site.webmanifest",
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`
    }
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" }
    ],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }]
  },
  verification: {
    ...(siteConfig.googleSiteVerification ? { google: siteConfig.googleSiteVerification } : {}),
    other: {
      "naver-site-verification": siteConfig.naverSiteVerification
    }
  },
  other: {
    "google-adsense-account": "ca-pub-7766989656523085"
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: `${siteConfig.shortName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.shortName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <Header />
        {children}
        <KakaoAdBanner />
        <Footer />
      </body>
    </html>
  );
}
