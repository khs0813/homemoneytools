import type { MetadataRoute } from "next";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const lastModified = siteConfig.lastUpdated;
  const staticPaths = ["/", "/calculators", "/guides"];
  const paths = [
    ...staticPaths,
    ...calculators.map((calculator) => calculator.path),
    ...calculators.map((calculator) => calculator.guidePath)
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.includes("calculator") ? 0.85 : 0.7
  }));
}
