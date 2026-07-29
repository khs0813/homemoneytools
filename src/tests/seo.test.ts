import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { GET as getRss } from "@/app/rss.xml/route";
import { calculators } from "@/config/calculators";
import { getAllContentDateMetadata, getCalculatorDateMetadata, getGuideDateMetadata } from "@/config/content-metadata";
import { guides } from "@/config/guides";
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

  it("uses content metadata dateModified values for sitemap lastmod", () => {
    const urls = sitemap();
    const byUrl = new Map(urls.map((item) => [item.url, item.lastModified]));

    for (const calculator of calculators) {
      expect(byUrl.get(`${siteConfig.url}${calculator.path}`)).toBe(getCalculatorDateMetadata(calculator.slug).dateModified);
    }
    for (const guide of guides) {
      expect(byUrl.get(`${siteConfig.url}${guide.path}`)).toBe(getGuideDateMetadata(guide.slug).dateModified);
    }
    const legacyPath = "/severance" + "-pay-calculator";
    expect(byUrl.has(`${siteConfig.url}${legacyPath}`)).toBe(false);
  });

  it("uses canonical guide links and publication dates in RSS", async () => {
    const response = getRss();
    const xml = await response.text();

    function pubDateForPath(path: string) {
      const link = `<link>${siteConfig.url}${path}</link>`;
      const linkIndex = xml.indexOf(link);
      expect(linkIndex).toBeGreaterThan(-1);
      const itemStart = xml.lastIndexOf("<item>", linkIndex);
      const itemEnd = xml.indexOf("</item>", linkIndex);
      return xml.slice(itemStart, itemEnd).match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
    }

    expect(xml).not.toContain("<link>https://jipcalc.co.kr/dsr-calculator</link>");
    expect(xml).not.toContain("moneycalculator.co.kr");
    expect(xml).not.toContain("severance" + "-pay-calculator");
    expect(pubDateForPath("/guides/200-million-jeonse-loan-monthly-interest")).toBe(new Date(getGuideDateMetadata("200-million-jeonse-loan-monthly-interest").datePublished).toUTCString());
    expect(pubDateForPath("/guides/monthly-rent-conversion-basics")).toBe(new Date(getGuideDateMetadata("monthly-rent-conversion-basics").datePublished).toUTCString());
  });

  it("has complete non-reversed date metadata for every public calculator and guide", () => {
    const metadata = getAllContentDateMetadata();
    const requiredFields = ["datePublished", "basisDate", "dateModified", "sourceCheckedAt"] as const;

    for (const calculator of calculators) {
      const record = metadata.calculators[calculator.slug];
      expect(record).toBeTruthy();
      for (const field of requiredFields) expect(record[field]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.dateModified >= record.datePublished).toBe(true);
      expect(record.dateModified >= record.basisDate).toBe(true);
    }
    for (const guide of guides) {
      const record = metadata.guides[guide.slug];
      expect(record).toBeTruthy();
      for (const field of requiredFields) expect(record[field]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.dateModified >= record.datePublished).toBe(true);
      expect(record.dateModified >= record.basisDate).toBe(true);
    }

    expect(getGuideDateMetadata("100-million-jeonse-loan-interest").dateModified).toBe("2026-07-29");
    expect(getGuideDateMetadata("200-million-jeonse-loan-monthly-interest").dateModified).toBe("2026-07-29");
    expect(getGuideDateMetadata("monthly-rent-500k-to-jeonse").dateModified).toBe("2026-07-29");
    expect(metadata.calculators["severance" + "-pay"]).toBeUndefined();
  });
});
