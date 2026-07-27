# Naver Safe SEO Report

- Generated at: 2026-07-27
- Verification base: `http://localhost:3000`
- Public host represented in metadata: `https://jipcalc.co.kr`

## URL And Index Stability

| Check | Result |
| --- | --- |
| Route count | before 53 / after 53 |
| HTML page count | before 43 / after 43 |
| Sitemap URL count | before 43 / after 43 |
| HTTP status changes | 0 failures |
| Canonical changes | 0 failures |
| New noindex | 0 |
| New X-Robots-Tag noindex | 0 |
| Sitemap URL removals | 0 |
| Calculation output changes | 0 |

Source: `docs/seo-stability-comparison.md`

## User-Agent Rendering

Checked paths:

- `/`
- `/dsr-calculator`
- `/acquisition-tax-calculator`
- `/real-estate-brokerage-fee-calculator`
- `/rent-vs-jeonse-calculator`
- `/monthly-rent-conversion-calculator`
- `/housing-subscription-score-calculator`
- `/jeonse-loan-interest-calculator`

Result: Browser, Yeti, and Googlebot all received HTTP 200 with matching title, description, H1, and body hash.

Source: `docs/user-agent-render-check.md`

Production domain read-only check:

| Path | Result |
| --- | --- |
| `/` | Browser/Yeti/Googlebot all 200; body length 53264 |
| `/dsr-calculator` | Browser/Yeti/Googlebot all 200; body length 67399 |
| `/acquisition-tax-calculator` | Browser/Yeti/Googlebot all 200; body length 62996 |
| `/real-estate-brokerage-fee-calculator` | Browser/Yeti/Googlebot all 200; body length 59727 |
| `/rent-vs-jeonse-calculator` | Browser/Yeti/Googlebot all 200; body length 60096 |
| `/monthly-rent-conversion-calculator` | Browser/Yeti/Googlebot all 200; body length 63240 |
| `/housing-subscription-score-calculator` | Browser/Yeti/Googlebot all 200; body length 60121 |
| `/jeonse-loan-interest-calculator` | Browser/Yeti/Googlebot all 200; body length 70878 |

The production check reflects the currently deployed site at the time of verification. After this release is deployed, rerun the same check against `https://jipcalc.co.kr`.

## Robots

`src/app/robots.ts` was not rewritten. It still exposes:

- `User-agent: *`
- `Allow: /`
- `Sitemap: https://jipcalc.co.kr/sitemap.xml`

No `Disallow: /` was added. No CSS, JavaScript, image, calculator, sitemap, or RSS blocking rule was added.

## Noindex

All 43 HTML pages in `docs/metadata-after.json` are indexable:

- Missing title: 0
- Missing description: 0
- Pages with H1 count not equal to 1: 0
- Pages with canonical count not equal to 1: 0
- `meta robots noindex`: 0
- `X-Robots-Tag noindex`: 0

## Canonical

Before/after canonical comparison produced 0 failures. Existing canonical targets were preserved.

## Sitemap

`src/app/sitemap.ts` still emits the same URL set and same sitemap path. The URL count stayed at 43. Calculator `lastmod` values were updated only because calculator page body and metadata content changed on 2026-07-27.

## RSS

`/rss.xml` remains available with `application/rss+xml; charset=utf-8`. The route and XML format were preserved. Calculator item `pubDate` now follows the same actual calculator content modification date used for sitemap `lastmod`; guide items remain on the existing site date.

## Deployment Follow-Up

After production deployment, request recrawl only for changed calculator pages in Naver Search Advisor. Do not submit URL removals, noindex requests, or sitemap pruning for this release.
