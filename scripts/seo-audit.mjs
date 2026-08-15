#!/usr/bin/env node

import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
const productionOrigin = "https://jipcalc.co.kr";
const legacyRedirects = new Map([
  ["/severance-pay-calculator", "https://www.moneycalculator.co.kr/severance-pay-calculator"],
  ["/guides/acquisition-tax", "/guides/acquisition-tax-checklist"],
  ["/guides/brokerage-fee", "/guides/brokerage-fee-negotiation"],
  ["/guides/dsr", "/guides/what-dsr-40-means"],
  ["/guides/jeonse-loan-interest", "/guides/jeonse-loan-interest-mistakes"],
  ["/guides/monthly-rent-conversion", "/guides/monthly-rent-conversion-basics"],
  ["/guides/rent-vs-jeonse", "/guides/rent-vs-jeonse-decision-guide"],
  ["/guides/subscription-score", "/guides/subscription-score-interpretation"]
]);
const ignoredSourceFiles = new Set([
  path.join(projectRoot, "scripts", "seo-audit.mjs"),
  path.join(projectRoot, "scripts", "serve-static-out.mjs"),
  path.join(projectRoot, "scripts", "verify-static-export.mjs")
]);
const sourceLegacyAllowlist = new Set([
  path.join(projectRoot, "src", "app", "sitemap.ts")
]);

const args = parseArgs(process.argv.slice(2));
const sourceOnly = Boolean(args.source);
const baseUrl = stripTrailingSlash(args.base ?? "http://localhost:3000");
const issues = [];

fs.mkdirSync(reportsDir, { recursive: true });

main().catch((error) => {
  addIssue("fatal", "runtime", "audit", error instanceof Error ? error.message : String(error));
  writeReports({
    generatedAt: new Date().toISOString(),
    mode: sourceOnly ? "source" : "http",
    baseUrl: sourceOnly ? "source" : baseUrl,
    sitemapUrlCount: null,
    htmlPageCount: null
  });
  process.exit(1);
});

async function main() {
  const generatedAt = new Date().toISOString();

  const sourceSummary = auditSource();
  let httpSummary = {
    sitemapUrlCount: null,
    htmlPageCount: null
  };

  if (!sourceOnly) {
    httpSummary = await auditHttp();
  }

  writeReports({
    generatedAt,
    mode: sourceOnly ? "source" : "http",
    baseUrl: sourceOnly ? "source" : baseUrl,
    sitemapUrlCount: httpSummary.sitemapUrlCount,
    htmlPageCount: httpSummary.htmlPageCount,
    sourceSummary
  });

  const fatalCount = issues.filter((issue) => issue.severity === "fatal").length;
  const warningCount = issues.filter((issue) => issue.severity === "warn").length;
  console.log(`Wrote reports/seo-audit.json`);
  console.log(`Wrote reports/seo-audit.md`);
  console.log(`SEO audit completed: ${fatalCount} fatal, ${warningCount} warning`);
  if (fatalCount > 0) process.exit(1);
}

function auditSource() {
  const metadata = readJson(path.join(projectRoot, "src", "config", "content-metadata.json"));
  const calculatorSource = fs.readFileSync(path.join(projectRoot, "src", "config", "calculators.ts"), "utf8");
  const guideSource = fs.readFileSync(path.join(projectRoot, "src", "config", "guides.ts"), "utf8");
  const calculatorSlugs = collectStringValues(calculatorSource, "slug");
  const guideSlugs = collectStringValues(guideSource, "slug");

  validateMetadataRecord("calculator", metadata.calculators, calculatorSlugs);
  validateMetadataRecord("guide", metadata.guides, guideSlugs);
  auditActiveLegacyReferences();
  auditSourceKeywordBlocks();

  return {
    calculatorCount: calculatorSlugs.length,
    guideCount: guideSlugs.length
  };
}

async function auditHttp() {
  const sitemapResponse = await fetchPath("/sitemap.xml");
  if (sitemapResponse.status !== 200) {
    addIssue("fatal", "sitemap", "/sitemap.xml", `sitemap status is ${sitemapResponse.status}`);
    return { sitemapUrlCount: 0, htmlPageCount: 0 };
  }

  const sitemapUrls = parseSitemapUrls(sitemapResponse.body);
  const sitemapPaths = sitemapUrls.map((url) => {
    try {
      return new URL(url).pathname;
    } catch {
      return "";
    }
  }).filter(Boolean);
  const sitemapPathSet = new Set(sitemapPaths);
  const htmlPages = [];
  const incomingLinks = new Map(sitemapPaths.map((item) => [item, 0]));
  const titleCounts = new Map();
  const descriptionCounts = new Map();

  for (const url of sitemapUrls) {
    validateSitemapUrl(url);
  }

  for (const routePath of sitemapPaths) {
    const response = await fetchPath(routePath);
    if (response.status !== 200) {
      addIssue("fatal", "sitemap-url-status", routePath, `sitemap URL returned ${response.status}`);
      continue;
    }
    if (!response.contentType.includes("text/html")) {
      addIssue("fatal", "sitemap-url-content-type", routePath, `sitemap URL content-type is ${response.contentType}`);
      continue;
    }

    const page = parseHtmlPage(routePath, response.body, response.headers);
    htmlPages.push(page);
    increment(titleCounts, page.title);
    increment(descriptionCounts, page.metaDescription);

    for (const link of page.internalLinks) {
      if (sitemapPathSet.has(link) && link !== routePath) {
        incomingLinks.set(link, (incomingLinks.get(link) ?? 0) + 1);
      }
    }
  }

  for (const page of htmlPages) {
    auditPage(page, titleCounts, descriptionCounts);
  }

  for (const [routePath, count] of incomingLinks) {
    if (routePath !== "/" && count === 0) {
      addIssue("warn", "orphan-page", routePath, "no incoming internal link from another sitemap page");
    }
  }

  auditGuideSimilarity(htmlPages);
  await auditLegacyRedirects();
  await auditRss();
  await auditRobots();
  await auditNotFound();

  return {
    sitemapUrlCount: sitemapPaths.length,
    htmlPageCount: htmlPages.length
  };
}

function validateMetadataRecord(type, record, slugs) {
  if (!record || typeof record !== "object") {
    addIssue("fatal", "metadata", type, "metadata record is missing");
    return;
  }

  for (const slug of slugs) {
    const metadata = record[slug];
    if (!metadata) {
      addIssue("fatal", "metadata", `${type}:${slug}`, "date metadata is missing");
      continue;
    }
    for (const field of ["datePublished", "basisDate", "dateModified", "sourceCheckedAt"]) {
      if (!isIsoDate(metadata[field])) {
        addIssue("fatal", "metadata", `${type}:${slug}`, `${field} is missing or not YYYY-MM-DD`);
      }
    }
    if (metadata.dateModified < metadata.datePublished) {
      addIssue("fatal", "metadata", `${type}:${slug}`, "dateModified is earlier than datePublished");
    }
    if (metadata.dateModified < metadata.basisDate) {
      addIssue("fatal", "metadata", `${type}:${slug}`, "dateModified is earlier than basisDate");
    }
  }

  for (const slug of Object.keys(record)) {
    if (!slugs.includes(slug)) {
      addIssue("warn", "metadata", `${type}:${slug}`, "date metadata exists for a missing source slug");
    }
  }
}

function auditActiveLegacyReferences() {
  for (const filePath of collectFiles(projectRoot, ["src", "scripts", "next.config.ts"])) {
    if (ignoredSourceFiles.has(filePath) || sourceLegacyAllowlist.has(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8");
    if (/severance-pay|severance-pay-calculator|퇴직금/.test(content)) {
      addIssue("fatal", "legacy-source", path.relative(projectRoot, filePath), "legacy severance content remains in active source");
    }
  }
}

function auditSourceKeywordBlocks() {
  for (const filePath of collectFiles(path.join(projectRoot, "src"), [])) {
    const content = fs.readFileSync(filePath, "utf8");
    if (content.includes("함께 검색되는 주제")) {
      addIssue("fatal", "keyword-block", path.relative(projectRoot, filePath), "keyword-only related search block remains");
    }
  }
}

function validateSitemapUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    addIssue("fatal", "sitemap-url", value, "invalid URL in sitemap");
    return;
  }
  if (url.origin !== productionOrigin) {
    addIssue("fatal", "sitemap-url-domain", value, `sitemap URL origin must be ${productionOrigin}`);
  }
  if (url.search || url.hash) {
    addIssue("fatal", "sitemap-url-clean", value, "sitemap URL contains query string or fragment");
  }
  if (legacyRedirects.has(url.pathname)) {
    addIssue("fatal", "sitemap-legacy", value, "legacy URL is included in sitemap");
  }
}

function auditPage(page, titleCounts, descriptionCounts) {
  if (!page.title) addIssue("fatal", "title", page.path, "title is missing");
  if (page.title && titleCounts.get(page.title) > 1) {
    addIssue("fatal", "title-duplicate", page.path, `duplicate title: ${page.title}`);
  }
  if (!page.metaDescription) addIssue("fatal", "description", page.path, "meta description is missing");
  if (page.metaDescription && descriptionCounts.get(page.metaDescription) > 1) {
    addIssue("fatal", "description-duplicate", page.path, "duplicate meta description");
  }
  if (page.canonical.length !== 1) {
    addIssue("fatal", "canonical", page.path, `expected 1 canonical, found ${page.canonical.length}`);
  } else if (page.canonical[0] !== canonicalUrlForPath(page.path)) {
    addIssue("fatal", "canonical", page.path, `canonical mismatch: ${page.canonical[0]}`);
  }
  if (page.noindex) addIssue("fatal", "robots-noindex", page.path, "page contains noindex");
  if (page.h1Count !== 1) addIssue("fatal", "h1", page.path, `expected 1 H1, found ${page.h1Count}`);
  if (!page.lang.toLowerCase().startsWith("ko")) addIssue("fatal", "html-lang", page.path, `html lang is ${page.lang || "missing"}`);
  for (const error of page.jsonLdErrors) {
    addIssue("fatal", "json-ld", page.path, error);
  }
  for (const error of page.dateErrors) {
    addIssue("fatal", "json-ld-date", page.path, error);
  }
  for (const href of page.badLinks) {
    addIssue("fatal", "link", page.path, `bad internal link: ${href}`);
  }
}

async function auditLegacyRedirects() {
  for (const [routePath, destination] of legacyRedirects) {
    const response = await fetchPath(routePath);
    if (response.status !== 301) {
      addIssue("fatal", "legacy-redirect", routePath, `expected 301, got ${response.status}`);
      continue;
    }
    const acceptableLocations = new Set([destination]);
    if (destination.startsWith("/")) acceptableLocations.add(`${baseUrl}${destination}`);
    if (!acceptableLocations.has(response.location ?? "")) {
      addIssue("fatal", "legacy-redirect", routePath, `expected ${destination}, got ${response.location ?? "missing Location"}`);
    }
  }
}

async function auditRss() {
  const response = await fetchPath("/rss.xml");
  if (response.status !== 200) {
    addIssue("fatal", "rss", "/rss.xml", `RSS status is ${response.status}`);
    return;
  }
  if (/moneycalculator\.co\.kr|severance-pay-calculator/.test(response.body)) {
    addIssue("fatal", "rss", "/rss.xml", "RSS contains another domain or legacy URL");
  }
  const itemBlocks = response.body.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  for (const item of itemBlocks) {
    const link = decodeXml(firstMatch(item, /<link>([\s\S]*?)<\/link>/i));
    const guid = decodeXml(firstMatch(item, /<guid(?:\s+[^>]*)?>([\s\S]*?)<\/guid>/i));
    const pubDate = firstMatch(item, /<pubDate>([\s\S]*?)<\/pubDate>/i);
    const description = decodeXml(firstMatch(item, /<description>([\s\S]*?)<\/description>/i));
    if (!link.startsWith(`${productionOrigin}/guides/`)) addIssue("fatal", "rss-link", link || "/rss.xml", "RSS item link is not a guide canonical URL");
    if (guid !== link) addIssue("fatal", "rss-guid", link || "/rss.xml", "RSS guid does not match link");
    if (Number.isNaN(Date.parse(pubDate))) addIssue("fatal", "rss-pubdate", link || "/rss.xml", "RSS pubDate is invalid");
    if (description.length < 40) addIssue("fatal", "rss-description", link || "/rss.xml", "RSS description is too short");
  }
}

async function auditRobots() {
  const response = await fetchPath("/robots.txt");
  if (response.status !== 200) {
    addIssue("fatal", "robots", "/robots.txt", `robots status is ${response.status}`);
    return;
  }
  const disallowLines = response.body.split(/\r?\n/).filter((line) => line.trim().toLowerCase().startsWith("disallow:"));
  for (const line of disallowLines) {
    const value = line.split(":").slice(1).join(":").trim();
    if (value === "/" || value.startsWith("/guides") || value.includes("calculator")) {
      addIssue("fatal", "robots", "/robots.txt", `core path disallowed: ${line}`);
    }
  }
}

async function auditNotFound() {
  const routePath = "/__jipcalc-seo-audit-intentional-404";
  const response = await fetchPath(routePath);
  if (response.status !== 404) {
    addIssue("fatal", "not-found", routePath, `expected 404, got ${response.status}`);
  }
  if (response.body.includes("<h1>전세·월세·매매 주거비 계산기</h1>")) {
    addIssue("fatal", "not-found", routePath, "missing path returned the home page HTML");
  }
}

function parseHtmlPage(routePath, html, headers) {
  const jsonLdErrors = [];
  const jsonLdObjects = [];
  for (const block of collectJsonLdBlocks(html)) {
    try {
      jsonLdObjects.push(JSON.parse(block));
    } catch (error) {
      jsonLdErrors.push(error instanceof Error ? error.message : String(error));
    }
  }
  const anchors = collectAnchorHrefs(html);
  const internalLinks = [];
  const badLinks = [];
  for (const href of anchors) {
    if (isIgnoredHref(href)) continue;
    const normalized = normalizeInternalHref(href);
    if (normalized.kind === "internal") internalLinks.push(normalized.path);
    if (normalized.kind === "bad") badLinks.push(href);
  }

  return {
    path: routePath,
    title: decodeHtml(stripTags(firstMatchRaw(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).trim()),
    metaDescription: decodeHtml(collectTags(html, "meta")
      .filter((tag) => normalizeAttr(getAttr(tag, "name")) === "description")
      .map((tag) => getAttr(tag, "content") ?? "")[0] ?? "").trim(),
    canonical: collectTags(html, "link")
      .filter((tag) => normalizeAttr(getAttr(tag, "rel")).split(/\s+/).includes("canonical"))
      .map((tag) => getAttr(tag, "href") ?? "")
      .filter(Boolean),
    noindex: hasNoindex(html, headers),
    h1Count: collectTagText(html, "h1").length,
    lang: getAttr(firstMatchRaw(html, /<html\b[^>]*>/i), "lang") ?? "",
    jsonLdErrors,
    dateErrors: collectJsonLdDateErrors(jsonLdObjects),
    internalLinks: Array.from(new Set(internalLinks)),
    badLinks,
    bodyText: extractComparableBodyText(html)
  };
}

function collectJsonLdDateErrors(values) {
  const errors = [];
  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    if (typeof value.datePublished === "string" && typeof value.dateModified === "string" && value.dateModified < value.datePublished) {
      errors.push(`dateModified ${value.dateModified} is earlier than datePublished ${value.datePublished}`);
    }
    Object.values(value).forEach(visit);
  };
  values.forEach(visit);
  return errors;
}

function auditGuideSimilarity(pages) {
  const guidePages = pages.filter((page) => page.path.startsWith("/guides/"));
  for (let leftIndex = 0; leftIndex < guidePages.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < guidePages.length; rightIndex += 1) {
      const left = guidePages[leftIndex];
      const right = guidePages[rightIndex];
      const similarity = jaccard(shingles(left.bodyText), shingles(right.bodyText));
      if (similarity >= 0.75) {
        addIssue("warn", "body-similarity", `${left.path} <-> ${right.path}`, `${Math.round(similarity * 100)}% similar`);
      }
    }
  }
}

function shingles(text) {
  const tokens = text.split(/\s+/).filter((token) => token.length >= 2);
  const result = new Set();
  for (let index = 0; index <= tokens.length - 5; index += 1) {
    result.add(tokens.slice(index, index + 5).join(" "));
  }
  return result;
}

function jaccard(left, right) {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const item of left) {
    if (right.has(item)) intersection += 1;
  }
  return intersection / (left.size + right.size - intersection);
}

function extractComparableBodyText(html) {
  const article = firstMatchRaw(html, /<article\b[^>]*>([\s\S]*?)<\/article>/i) || html;
  return decodeHtml(stripTags(article)
    .replace(/면책 안내:[\s\S]*?(관련 문서와 계산기|계산 기준 및 참고 출처|관련 계산기|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function normalizeInternalHref(href) {
  if (/^https?:\/\//i.test(href)) {
    const url = new URL(href);
    if (url.origin === productionOrigin) {
      if (url.search || url.hash) return { kind: "bad" };
      return { kind: "internal", path: url.pathname };
    }
    if (/^https?:\/\/(www\.)?jipcalc\.co\.kr/i.test(href)) return { kind: "bad" };
    return { kind: "external" };
  }
  if (href.startsWith("/")) {
    if (href.includes("?") || href.includes("#")) return { kind: "bad" };
    return { kind: "internal", path: href };
  }
  return { kind: "bad" };
}

function canonicalUrlForPath(routePath) {
  return routePath === "/" ? productionOrigin : `${productionOrigin}${routePath}`;
}

function isIgnoredHref(href) {
  return !href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:");
}

async function fetchPath(routePath) {
  const url = routePath.startsWith("http") ? routePath : `${baseUrl}${routePath}`;
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; jipcalc-seo-audit/1.0)" }
  });
  const body = await response.text().catch(() => "");
  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    location: response.headers.get("location"),
    headers: Object.fromEntries(response.headers.entries()),
    body
  };
}

function parseSitemapUrls(xml) {
  const urls = [];
  const regex = /<loc>([\s\S]*?)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(decodeXml(match[1].trim()));
  }
  return urls;
}

function collectJsonLdBlocks(html) {
  const blocks = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(decodeHtml(match[1].trim()));
  }
  return blocks;
}

function collectAnchorHrefs(html) {
  return collectTags(html, "a").map((tag) => getAttr(tag, "href") ?? "").filter(Boolean);
}

function collectTags(html, tagName) {
  const regex = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(regex) ?? [];
}

function collectTagText(html, tagName) {
  const values = [];
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  let match;
  while ((match = regex.exec(html)) !== null) {
    const value = decodeHtml(stripTags(match[1]).replace(/\s+/g, " ").trim());
    if (value) values.push(value);
  }
  return values;
}

function hasNoindex(html, headers) {
  const header = String(headers["x-robots-tag"] ?? "").toLowerCase();
  if (header.includes("noindex")) return true;
  return collectTags(html, "meta")
    .filter((tag) => ["robots", "googlebot", "yeti"].includes(normalizeAttr(getAttr(tag, "name"))))
    .some((tag) => normalizeAttr(getAttr(tag, "content")).includes("noindex"));
}

function getAttr(tag, name) {
  const regex = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(regex);
  return match ? decodeHtml(match[2] ?? match[3] ?? match[4] ?? "") : undefined;
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function firstMatch(value, regex) {
  const match = value.match(regex);
  return match ? match[1].trim() : "";
}

function firstMatchRaw(value, regex) {
  const match = value.match(regex);
  return match ? (match[1] ?? match[0]) : "";
}

function decodeHtml(value) {
  return decodeXml(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function escapeMarkdown(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function normalizeAttr(value) {
  return (value ?? "").trim().toLowerCase();
}

function increment(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function collectStringValues(source, fieldName) {
  const values = [];
  const regex = new RegExp(`${fieldName}:\\s*"([^"]+)"`, "g");
  let match;
  while ((match = regex.exec(source)) !== null) {
    values.push(match[1]);
  }
  return Array.from(new Set(values));
}

function collectFiles(root, entries) {
  const roots = entries.length > 0 ? entries.map((entry) => path.join(root, entry)) : [root];
  const files = [];
  for (const entryPath of roots) {
    if (!fs.existsSync(entryPath)) continue;
    const stat = fs.statSync(entryPath);
    if (stat.isFile()) {
      files.push(entryPath);
    } else {
      walk(entryPath, files);
    }
  }
  return files.filter((filePath) => /\.(ts|tsx|js|mjs|json|md)$/.test(filePath));
}

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, files);
    } else {
      files.push(entryPath);
    }
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

function stripTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function addIssue(severity, check, target, message) {
  issues.push({ severity, check, target, message });
}

function writeReports(summary) {
  const fatalCount = issues.filter((issue) => issue.severity === "fatal").length;
  const warningCount = issues.filter((issue) => issue.severity === "warn").length;
  const json = {
    ...summary,
    fatalCount,
    warningCount,
    issues
  };
  fs.writeFileSync(path.join(reportsDir, "seo-audit.json"), `${JSON.stringify(json, null, 2)}\n`);

  const rows = issues.length > 0
    ? issues.map((issue) => `| ${issue.severity} | ${escapeMarkdown(issue.check)} | ${escapeMarkdown(issue.target)} | ${escapeMarkdown(issue.message)} |`).join("\n")
    : "No SEO audit findings.";
  const markdown = `# SEO Audit

- Generated at: ${summary.generatedAt}
- Mode: ${summary.mode}
- Base URL: ${summary.baseUrl}
- Sitemap URLs: ${summary.sitemapUrlCount ?? "n/a"}
- HTML pages: ${summary.htmlPageCount ?? "n/a"}
- Fatal issues: ${fatalCount}
- Warnings: ${warningCount}

## Findings

${issues.length > 0 ? `| Severity | Check | Target | Message |
| --- | --- | --- | --- |
${rows}` : rows}
`;

  fs.writeFileSync(path.join(reportsDir, "seo-audit.md"), markdown);
}
