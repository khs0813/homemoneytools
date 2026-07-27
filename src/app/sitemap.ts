import type { MetadataRoute } from "next";
import { calculators } from "@/config/calculators";
import { getCalculatorQualityContent } from "@/config/calculator-quality-content";
import { guides } from "@/config/guides";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const calculatorLastModifiedByPath = new Map(calculators.map((calculator) => [
    calculator.path,
    getCalculatorQualityContent(calculator).contentModifiedDate ?? calculator.contentLastModified
  ]));
  const staticPaths = ["/", "/about", "/calculators", "/guides", "/privacy-policy", "/terms", "/disclaimer", "/contact"];
  const paths = [
    ...staticPaths,
    ...calculators.map((calculator) => calculator.path),
    ...guides.map((guide) => guide.path)
  ];

  return Array.from(new Set(paths)).map((path) => ({
    url: `${base}${path}`,
    lastModified: calculatorLastModifiedByPath.get(path) ?? siteConfig.lastUpdated,
    changeFrequency: path === "/" ? "weekly" : path.startsWith("/guides/") ? "monthly" : "monthly",
    priority: path === "/" ? 1 : path.includes("calculator") ? 0.85 : path.startsWith("/guides/") ? 0.75 : 0.7
  }));
}
