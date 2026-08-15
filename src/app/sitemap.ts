import type { MetadataRoute } from "next";
import { calculators } from "@/config/calculators";
import { getCalculatorDateMetadata, getGuideDateMetadata } from "@/config/content-metadata";
import { guides } from "@/config/guides";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const legacyPaths = new Set(["/severance-pay-calculator"]);

function isCleanIndexablePath(path: string): boolean {
  return path.startsWith("/") && !path.includes("?") && !path.includes("#") && !legacyPaths.has(path);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const lastModifiedByPath = new Map<string, string>([
    ...calculators.map((calculator) => [calculator.path, getCalculatorDateMetadata(calculator.slug).dateModified] as const),
    ...guides.map((guide) => [guide.path, getGuideDateMetadata(guide.slug).dateModified] as const)
  ]);
  const staticPaths = ["/", "/about", "/calculators", "/guides", "/privacy-policy", "/terms", "/disclaimer", "/contact"];
  const paths = [
    ...staticPaths,
    ...calculators.map((calculator) => calculator.path),
    ...guides.map((guide) => guide.path)
  ];

  return Array.from(new Set(paths)).filter(isCleanIndexablePath).map((path) => ({
    url: `${base}${path}`,
    lastModified: lastModifiedByPath.get(path) ?? siteConfig.lastUpdated,
    changeFrequency: path === "/" ? "weekly" : path.startsWith("/guides/") ? "monthly" : "monthly",
    priority: path === "/" ? 1 : path.includes("calculator") ? 0.85 : path.startsWith("/guides/") ? 0.75 : 0.7
  }));
}
