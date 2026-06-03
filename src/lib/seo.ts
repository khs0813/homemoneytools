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
  alt: `${siteConfig.name} 부동산·주거비 계산기`
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
  return {
    metadataBase: new URL(siteConfig.url),
    title,
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
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [defaultOgImage]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [defaultOgImage.url]
    }
  };
}

export function buildCalculatorMetadata(info: CalculatorInfo): Metadata {
  const title = info.title;
  const description = `${info.description} 계산 공식, 예시, 주의사항까지 함께 확인하세요.`;

  return {
    ...commonMetadata(title, description, info.path),
    robots: isHousingCalculator(info.slug)
      ? defaultRobots
      : {
          index: false,
          follow: true,
          nocache: false,
          googleBot: {
            index: false,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        },
    keywords: info.keywords
  };
}

export function buildPageMetadata(title: string, description: string, path: string): Metadata {
  return commonMetadata(title, description, path);
}
