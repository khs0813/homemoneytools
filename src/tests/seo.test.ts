import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { GET as getRss } from "@/app/rss.xml/route";
import { calculators } from "@/config/calculators";
import { siteConfig } from "@/config/site";
import { absoluteUrl, buildCalculatorMetadata, buildPageMetadata } from "@/lib/seo";

describe("SEO configuration", () => {
  it("uses a valid absolute canonical site URL", () => {
    expect(siteConfig.url).toMatch(/^https:\/\//);
    expect(siteConfig.url.endsWith("/")).toBe(false);
    expect(absoluteUrl("/dsr-calculator")).toBe(`${siteConfig.url}/dsr-calculator`);
  });

  it("has unique calculator titles and keyword coverage", () => {
    const titles = calculators.map((calculator) => calculator.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const calculator of calculators) {
      expect(calculator.description.length).toBeGreaterThan(30);
      expect(calculator.keywords.length).toBeGreaterThanOrEqual(3);
      expect(calculator.faqs.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("builds calculator metadata with canonical, robots, OG and Twitter fields", () => {
    const metadata = buildCalculatorMetadata(calculators[0]);
    expect(metadata.description).toBe(calculators[0].description);
    expect(metadata.alternates).toEqual(
      expect.objectContaining({
        canonical: calculators[0].path
      })
    );
    expect(metadata.openGraph).toEqual(expect.objectContaining({ siteName: siteConfig.name }));
    expect(metadata.twitter).toEqual(expect.objectContaining({ card: "summary_large_image" }));
    expect(metadata.robots).toBeTruthy();
  });

  it("builds page metadata with language alternates", () => {
    const metadata = buildPageMetadata("테스트 페이지", "테스트 설명입니다.", "/test");
    expect(metadata.alternates).toEqual(
      expect.objectContaining({
        canonical: "/test",
        languages: expect.objectContaining({ "ko-KR": "/test", "x-default": "/test" })
      })
    );
  });

  it("exposes required policy and contact configuration", () => {
    expect(siteConfig.contactEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(siteConfig.lastUpdated).toBe("2026-06-04");
    expect(siteConfig.name).toBe("집계산");
  });

  it("uses per-page lastmod only for recently updated calculator content", () => {
    const urls = sitemap();
    const byUrl = new Map(urls.map((item) => [item.url, item.lastModified]));

    for (const calculator of calculators) {
      expect(byUrl.get(`${siteConfig.url}${calculator.path}`)).toBe("2026-07-27");
    }
    expect(byUrl.get(`${siteConfig.url}/guides/what-dsr-40-means`)).toBe(siteConfig.lastUpdated);
  });

  it("uses matching item pubDate values in RSS without updating every item", async () => {
    const response = getRss();
    const xml = await response.text();
    const updatedPubDate = new Date("2026-07-27").toUTCString();
    const defaultPubDate = new Date(siteConfig.lastUpdated).toUTCString();

    function pubDateForPath(path: string) {
      const link = `<link>${siteConfig.url}${path}</link>`;
      const linkIndex = xml.indexOf(link);
      expect(linkIndex).toBeGreaterThan(-1);
      const itemStart = xml.lastIndexOf("<item>", linkIndex);
      const itemEnd = xml.indexOf("</item>", linkIndex);
      return xml.slice(itemStart, itemEnd).match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
    }

    expect(pubDateForPath("/dsr-calculator")).toBe(updatedPubDate);
    expect(pubDateForPath("/jeonse-loan-interest-calculator")).toBe(updatedPubDate);
    expect(pubDateForPath("/monthly-rent-conversion-calculator")).toBe(updatedPubDate);
    expect(pubDateForPath("/acquisition-tax-calculator")).toBe(updatedPubDate);
    expect(pubDateForPath("/rent-vs-jeonse-calculator")).toBe(updatedPubDate);
    expect(pubDateForPath("/guides/what-dsr-40-means")).toBe(defaultPubDate);
  });
});
