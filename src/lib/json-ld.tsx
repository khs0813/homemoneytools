import type { CalculatorInfo } from "@/config/calculators";
import { calculators } from "@/config/calculators";
import { guides } from "@/config/guides";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export function safeJsonStringify(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }} />;
}

const publisher = {
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/icon.svg"),
    width: 512,
    height: 512
  }
};

const website = {
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  inLanguage: siteConfig.language,
  description: siteConfig.description,
  publisher
};

export function OrganizationJsonLd() {
  return <JsonLd data={{ "@context": "https://schema.org", ...publisher }} />;
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.path)
        }))
      }}
    />
  );
}

export function WebPageJsonLd({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name: title,
        description,
        inLanguage: siteConfig.language,
        isPartOf: website,
        datePublished: siteConfig.lastUpdated,
        dateModified: siteConfig.lastUpdated,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.defaultOgImage),
          width: 1200,
          height: 630
        },
        publisher
      }}
    />
  );
}

export function CalculatorJsonLd({ info }: { info: CalculatorInfo }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${absoluteUrl(info.path)}#calculator`,
        name: info.title,
        url: absoluteUrl(info.path),
        description: info.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript. No database account required.",
        inLanguage: siteConfig.language,
        isAccessibleForFree: true,
        featureList: ["금융·세금·생활비 계산", "계산 공식 설명", "FAQ", "공유 가능한 URL"],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "KRW"
        },
        publisher
      }}
    />
  );
}

export function CalculatorItemListJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "금융·세금·생활비 계산기 목록",
        itemListElement: calculators.map((calculator, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(calculator.path),
          name: calculator.title,
          description: calculator.description
        }))
      }}
    />
  );
}

export function GuideItemListJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "생활금융 가이드 목록",
        itemListElement: guides.map((guide, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(guide.path),
          name: guide.title,
          description: guide.description
        }))
      }}
    />
  );
}

export function ArticleJsonLd({ info }: { info: CalculatorInfo }) {
  return <GenericArticleJsonLd title={`${info.title} 가이드`} description={`${info.title}의 입력값, 공식, 계산 예시, 결과 해석 방법을 설명합니다.`} path={info.guidePath} />;
}

export function GenericArticleJsonLd({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${absoluteUrl(path)}#article`,
        headline: title,
        description,
        inLanguage: siteConfig.language,
        mainEntityOfPage: `${absoluteUrl(path)}#webpage`,
        datePublished: siteConfig.lastUpdated,
        dateModified: siteConfig.lastUpdated,
        image: absoluteUrl(siteConfig.defaultOgImage),
        author: publisher,
        publisher
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return <JsonLd data={{ "@context": "https://schema.org", ...website }} />;
}
