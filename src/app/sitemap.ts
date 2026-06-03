import type { MetadataRoute } from "next";
import { calculators } from "@/config/calculators";
import { guides } from "@/config/guides";
import { isHousingCalculator } from "@/config/housing-content";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const lastModified = siteConfig.lastUpdated;
  const staticPaths = ["/", "/about", "/calculators", "/guides", "/privacy-policy", "/terms", "/disclaimer", "/contact"];
  const paths = [
    ...staticPaths,
    ...calculators.filter((calculator) => isHousingCalculator(calculator.slug)).map((calculator) => calculator.path),
    ...guides.map((guide) => guide.path)
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : path.startsWith("/guides/") ? "monthly" : "monthly",
    priority: path === "/" ? 1 : path.includes("calculator") ? 0.85 : path.startsWith("/guides/") ? 0.75 : 0.7
  }));
}
