import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { CalculatorInfo } from "@/config/calculators";
import { isHousingCalculator } from "@/config/housing-content";

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

const defaultOgImage = {
  url: absoluteUrl(siteConfig.defaultOgImage),
  width: 1200,
  height: 630,
  alt: siteConfig.name
};

const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1
  }
};

function commonMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | ${siteConfig.shortName}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      absolute: fullTitle
    },
    description,
    applicationName: siteConfig.name,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "finance",
    alternates: {
      canonical: path,
      languages: {
        "ko-KR": path,
        "x-default": path
      }
    },
    robots: defaultRobots,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: absoluteUrl(path),
      siteName: siteConfig.shortName,
      title: fullTitle,
      description,
      images: [defaultOgImage]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url]
    }
  };
}

export function buildCalculatorMetadata(info: CalculatorInfo): Metadata {
  const title = info.seoTitle ?? info.title;
  const description = info.metaDescription ?? `${info.description} 계산 공식, 예시, 주의사항까지 함께 확인하세요.`;

  return {
    ...commonMetadata(title, description, info.path),
    robots: defaultRobots,
    keywords: info.keywords
  };
}

export function buildPageMetadata(title: string, description: string, path: string): Metadata {
  return commonMetadata(title, description, path);
}
