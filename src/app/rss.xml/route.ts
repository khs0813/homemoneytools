import { calculators } from "@/config/calculators";
import { guides } from "@/config/guides";
import { isHousingCalculator } from "@/config/housing-content";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.url.replace(/\/$/, "");
const lastBuildDate = new Date(siteConfig.lastUpdated).toUTCString();

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = [
    ...calculators
      .filter((calculator) => isHousingCalculator(calculator.slug))
      .map((calculator) => ({
        title: calculator.title,
        description: calculator.description,
        path: calculator.path
      })),
    ...guides.map((guide) => ({
      title: guide.title,
      description: guide.description,
      path: guide.path
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.shortName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${baseUrl}${item.path}</link>
      <guid>${baseUrl}${item.path}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${lastBuildDate}</pubDate>
    </item>`
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
