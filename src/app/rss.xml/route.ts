import { getGuideDateMetadata } from "@/config/content-metadata";
import { guides } from "@/config/guides";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.url.replace(/\/$/, "");

function toRssDate(date: string): string {
  return new Date(date).toUTCString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = guides
    .map((guide) => {
      const dateMetadata = getGuideDateMetadata(guide.slug);
      const content = [
        guide.description,
        ...guide.policySummary,
        ...guide.body.flatMap((section) => section.paragraphs)
      ].join("\n\n");
      return {
      title: guide.title,
      description: guide.description,
      path: guide.path,
        datePublished: dateMetadata.datePublished,
        dateModified: dateMetadata.dateModified,
        content
      };
    })
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified));
  const latestItemDate = items.reduce<string>((latest, item) => (item.dateModified > latest ? item.dateModified : latest), siteConfig.lastUpdated);
  const lastBuildDate = toRssDate(latestItemDate);

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${baseUrl}${item.path}</link>
      <guid isPermaLink="true">${baseUrl}${item.path}</guid>
      <description>${escapeXml(item.description)}</description>
      <content:encoded><![CDATA[${escapeXml(item.content).replace(/]]>/g, "]]&gt;")}]]></content:encoded>
      <pubDate>${toRssDate(item.datePublished)}</pubDate>
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
