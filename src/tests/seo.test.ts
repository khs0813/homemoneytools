import { describe, expect, it } from "vitest";
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
      expect(calculator.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("builds calculator metadata with canonical, robots, OG and Twitter fields", () => {
    const metadata = buildCalculatorMetadata(calculators[0]);
    expect(metadata.description).toContain("계산 공식");
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
});
