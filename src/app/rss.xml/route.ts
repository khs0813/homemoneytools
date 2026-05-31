import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.url.replace(/\/$/, "");
const lastBuildDate = new Date(siteConfig.lastUpdated).toUTCString();

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = calculators.flatMap((calculator) => [
    {
      title: calculator.title,
      description: calculator.description,
      path: calculator.path
    },
    {
      title: `${calculator.shortTitle} 가이드`,
      description: `${calculator.title} 사용 전 알아두면 좋은 계산 기준과 주의사항입니다.`,
      path: calculator.guidePath
    }
  ]);

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
