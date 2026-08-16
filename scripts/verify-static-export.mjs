#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createStaticOutServer, staticRedirects } from "./serve-static-out.mjs";

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
const productionOrigin = "https://jipcalc.co.kr";
const intentional404Path = "/__jipcalc-static-export-intentional-404";

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(String(args.dir ?? "out"));
const externalBaseUrl = args.base ? stripTrailingSlash(String(args.base)) : null;
const issues = [];

fs.mkdirSync(reportsDir, { recursive: true });

main().catch((error) => {
  addIssue("fatal", "runtime", "verify", error instanceof Error ? error.message : String(error));
  writeReports({
    generatedAt: new Date().toISOString(),
    baseUrl: externalBaseUrl ?? "local-static-server",
    outDir,
    expectedIndexableCount: null,
    sitemapUrlCount: null,
    htmlRouteFileCount: null,
    redirectsChecked: staticRedirects.size
  });
  process.exit(1);
});

async function main() {
  const expectedPaths = collectExpectedIndexablePaths();
  const server = externalBaseUrl ? null : createStaticOutServer({ dir: outDir });
  const baseUrl = externalBaseUrl ?? await listen(server);

  try {
    assertRequiredOutFiles();
    assertRenderYamlRoutes();

    const sitemapUrls = await auditSitemap(baseUrl, expectedPaths);
    const htmlRouteFileCount = countHtmlRouteFiles(expectedPaths);

    await auditRobots(baseUrl);
    await auditRss(baseUrl);
    await auditRedirects(baseUrl);
    await auditNotFound(baseUrl);

    writeReports({
      generatedAt: new Date().toISOString(),
      baseUrl,
      outDir,
      expectedIndexableCount: expectedPaths.length,
      sitemapUrlCount: sitemapUrls.length,
      htmlRouteFileCount,
      redirectsChecked: staticRedirects.size
    });

    const fatalCount = issues.filter((issue) => issue.severity === "fatal").length;
    const warningCount = issues.filter((issue) => issue.severity === "warn").length;
    console.log(`Wrote reports/static-export-audit.json`);
    console.log(`Wrote reports/static-export-audit.md`);
    console.log(`Static export verification completed: ${fatalCount} fatal, ${warningCount} warning`);
    if (fatalCount > 0) process.exit(1);
  } finally {
    if (server) await closeServer(server);
  }
}

function assertRequiredOutFiles() {
  const requiredFiles = [
    "index.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "rss.xml",
    "ads.txt",
    "favicon.svg",
    "icon.svg",
    "apple-touch-icon.svg",
    "site.webmanifest",
    "og-image.png",
    "humans.txt",
    "llms.txt",
    ".well-known/security.txt"
  ];

  for (const fileName of requiredFiles) {
    const filePath = path.join(outDir, fileName);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      addIssue("fatal", "out-file", fileName, "required export file is missing");
    }
  }
}

function assertRenderYamlRoutes() {
  const renderYamlPath = path.join(projectRoot, "render.yaml");
  const content = fs.existsSync(renderYamlPath) ? fs.readFileSync(renderYamlPath, "utf8") : "";

  if (!content.includes("runtime: static")) addIssue("fatal", "render-yaml", "runtime", "runtime is not static");
  if (!content.includes("staticPublishPath: out")) addIssue("fatal", "render-yaml", "staticPublishPath", "publish path is not out");
  if (/source:\s*\/\*/.test(content) && /destination:\s*\/index\.html/.test(content)) {
    addIssue("fatal", "render-yaml", "routes", "SPA catch-all rewrite must not be used for Next static export");
  }

  for (const [source, destination] of staticRedirects) {
    if (!content.includes(`source: ${source}`) || !content.includes(`destination: ${destination}`)) {
      addIssue("fatal", "render-yaml", source, "redirect route is missing from render.yaml");
    }
  }
}

async function auditSitemap(baseUrl, expectedPaths) {
  const response = await fetchText(`${baseUrl}/sitemap.xml`);
  if (response.status !== 200) {
    addIssue("fatal", "sitemap", "/sitemap.xml", `expected 200, got ${response.status}`);
    return [];
  }

  const sitemapUrls = parseSitemapUrls(response.body);
  const sitemapPaths = sitemapUrls.map((value) => {
    try {
      return new URL(value).pathname;
    } catch {
      return "";
    }
  }).filter(Boolean);
  const sitemapPathSet = new Set(sitemapPaths);

  if (sitemapUrls.length !== new Set(sitemapUrls).size) {
    addIssue("fatal", "sitemap", "/sitemap.xml", "duplicate loc entries found");
  }
  if (sitemapUrls.length !== expectedPaths.length) {
    addIssue("fatal", "sitemap", "/sitemap.xml", `expected ${expectedPaths.length} URLs, got ${sitemapUrls.length}`);
  }

  for (const expectedPath of expectedPaths) {
    if (!sitemapPathSet.has(expectedPath)) {
      addIssue("fatal", "sitemap", expectedPath, "expected path is missing from sitemap");
    }
  }

  for (const url of sitemapUrls) {
    validateSitemapUrl(url);
  }

  for (const routePath of sitemapPaths) {
    assertHtmlRouteFile(routePath);
    const pageResponse = await fetchText(`${baseUrl}${routePath}`);
    if (pageResponse.status !== 200) {
      addIssue("fatal", "sitemap-url-status", routePath, `expected 200, got ${pageResponse.status}`);
      continue;
    }
    if (!pageResponse.contentType.includes("text/html")) {
      addIssue("fatal", "sitemap-url-content-type", routePath, `content-type is ${pageResponse.contentType}`);
      continue;
    }
    auditHtmlPage(routePath, pageResponse.body);
  }

  return sitemapUrls;
}

function validateSitemapUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    addIssue("fatal", "sitemap-url", value, "invalid URL");
    return;
  }

  if (url.origin !== productionOrigin) {
    addIssue("fatal", "sitemap-url-origin", value, `origin must be ${productionOrigin}`);
  }
  if (url.search || url.hash) {
    addIssue("fatal", "sitemap-url-clean", value, "query string or fragment is not allowed");
  }
  if (staticRedirects.has(url.pathname)) {
    addIssue("fatal", "sitemap-url-redirect", value, "redirect source must not be indexable");
  }
}

function auditHtmlPage(routePath, html) {
  const canonical = collectTags(html, "link")
    .filter((tag) => normalizeAttr(getAttr(tag, "rel")).split(/\s+/).includes("canonical"))
    .map((tag) => getAttr(tag, "href") ?? "")
    .filter(Boolean);
  const expectedCanonical = routePath === "/" ? productionOrigin : `${productionOrigin}${routePath}`;
  const title = decodeHtml(stripTags(firstMatchRaw(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).trim());
  const description = collectTags(html, "meta")
    .filter((tag) => normalizeAttr(getAttr(tag, "name")) === "description")
    .map((tag) => getAttr(tag, "content") ?? "")[0] ?? "";
  const ogUrl = collectTags(html, "meta")
    .filter((tag) => normalizeAttr(getAttr(tag, "property")) === "og:url")
    .map((tag) => getAttr(tag, "content") ?? "")[0] ?? "";

  if (canonical.length !== 1) {
    addIssue("fatal", "canonical", routePath, `expected 1 canonical, got ${canonical.length}`);
  } else if (canonical[0] !== expectedCanonical) {
    addIssue("fatal", "canonical", routePath, `expected ${expectedCanonical}, got ${canonical[0]}`);
  }
  if (!title) addIssue("fatal", "title", routePath, "title is missing");
  if (!description) addIssue("fatal", "description", routePath, "description is missing");
  if (ogUrl && ogUrl !== expectedCanonical) addIssue("fatal", "og-url", routePath, `expected ${expectedCanonical}, got ${ogUrl}`);
  if (hasNoindex(html)) addIssue("fatal", "robots-noindex", routePath, "page contains noindex");
  if (/onrender\.com|localhost|127\.0\.0\.1|cloudflarepages\.com/i.test(html)) {
    addIssue("fatal", "host-leak", routePath, "HTML contains a non-production host");
  }
}

async function auditRobots(baseUrl) {
  const response = await fetchText(`${baseUrl}/robots.txt`);
  if (response.status !== 200) {
    addIssue("fatal", "robots", "/robots.txt", `expected 200, got ${response.status}`);
    return;
  }
  if (!response.body.includes(`Sitemap: ${productionOrigin}/sitemap.xml`)) {
    addIssue("fatal", "robots", "/robots.txt", "production sitemap URL is missing");
  }
  if (/Disallow:\s*\/\s*$/im.test(response.body)) {
    addIssue("fatal", "robots", "/robots.txt", "site-wide disallow found");
  }
}

async function auditRss(baseUrl) {
  const response = await fetchText(`${baseUrl}/rss.xml`);
  if (response.status !== 200) {
    addIssue("fatal", "rss", "/rss.xml", `expected 200, got ${response.status}`);
    return;
  }
  if (!response.body.includes(`<link>${productionOrigin}</link>`)) {
    addIssue("fatal", "rss", "/rss.xml", "channel link is not the production origin");
  }
  if (/moneycalculator\.co\.kr|severance-pay-calculator|onrender\.com|localhost|127\.0\.0\.1/i.test(response.body)) {
    addIssue("fatal", "rss", "/rss.xml", "RSS contains a legacy or non-production host");
  }
}

async function auditRedirects(baseUrl) {
  for (const [source, destination] of staticRedirects) {
    const response = await fetchText(`${baseUrl}${source}`, { redirect: "manual" });
    if (response.status !== 301) {
      addIssue("fatal", "redirect", source, `expected 301, got ${response.status}`);
      continue;
    }

    const acceptableLocations = new Set([destination]);
    if (destination.startsWith("/")) acceptableLocations.add(`${baseUrl}${destination}`);
    if (!acceptableLocations.has(response.location ?? "")) {
      addIssue("fatal", "redirect", source, `expected ${destination}, got ${response.location ?? "missing Location"}`);
    }
  }
}

async function auditNotFound(baseUrl) {
  const response = await fetchText(`${baseUrl}${intentional404Path}`);
  if (response.status !== 404) {
    addIssue("fatal", "404", intentional404Path, `expected 404, got ${response.status}`);
  }
  if (response.body.includes("<h1>전세·월세·매매 주거비 계산기</h1>")) {
    addIssue("fatal", "404", intentional404Path, "missing path returned the home page HTML");
  }
}

function collectExpectedIndexablePaths() {
  const staticPaths = ["/", "/about", "/calculators", "/guides", "/privacy-policy", "/terms", "/disclaimer", "/contact"];
  const calculatorPaths = collectPathValues(path.join(projectRoot, "src", "config", "calculators.ts"));
  const guidePaths = collectPathValues(path.join(projectRoot, "src", "config", "guides.ts"));
  return Array.from(new Set([...staticPaths, ...calculatorPaths, ...guidePaths]));
}

function collectPathValues(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const values = [];
  const regex = /path:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    values.push(match[1]);
  }
  return values;
}

function assertHtmlRouteFile(routePath) {
  const candidates = routePath === "/"
    ? [path.join(outDir, "index.html")]
    : [path.join(outDir, `${routePath}.html`), path.join(outDir, routePath, "index.html")];

  if (!candidates.some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())) {
    addIssue("fatal", "html-file", routePath, "corresponding HTML file is missing from out/");
  }
}

function countHtmlRouteFiles(routePaths) {
  let count = 0;
  for (const routePath of routePaths) {
    const before = issues.length;
    assertHtmlRouteFile(routePath);
    if (issues.length === before) count += 1;
  }
  return count;
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect ?? "follow",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; jipcalc-static-export-audit/1.0)" }
  });
  const body = await response.text().catch(() => "");
  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    location: response.headers.get("location"),
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

function collectTags(html, tagName) {
  const regex = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(regex) ?? [];
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

function firstMatchRaw(value, regex) {
  const match = value.match(regex);
  return match ? (match[1] ?? match[0]) : "";
}

function hasNoindex(html) {
  return collectTags(html, "meta")
    .filter((tag) => ["robots", "googlebot", "yeti"].includes(normalizeAttr(getAttr(tag, "name"))))
    .some((tag) => normalizeAttr(getAttr(tag, "content")).includes("noindex"));
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

function normalizeAttr(value) {
  return (value ?? "").trim().toLowerCase();
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

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Unable to determine static server address"));
        return;
      }
      resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function addIssue(severity, check, target, message) {
  issues.push({ severity, check, target, message });
}

function escapeMarkdown(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
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
  fs.writeFileSync(path.join(reportsDir, "static-export-audit.json"), `${JSON.stringify(json, null, 2)}\n`);

  const rows = issues.length > 0
    ? issues.map((issue) => `| ${issue.severity} | ${escapeMarkdown(issue.check)} | ${escapeMarkdown(issue.target)} | ${escapeMarkdown(issue.message)} |`).join("\n")
    : "No static export audit findings.";
  const markdown = `# Static Export Audit

- Generated at: ${summary.generatedAt}
- Base URL: ${summary.baseUrl}
- Out dir: ${summary.outDir}
- Expected indexable URLs: ${summary.expectedIndexableCount ?? "n/a"}
- Sitemap URLs: ${summary.sitemapUrlCount ?? "n/a"}
- HTML route files: ${summary.htmlRouteFileCount ?? "n/a"}
- Redirects checked: ${summary.redirectsChecked}
- Fatal issues: ${fatalCount}
- Warnings: ${warningCount}

## Findings

${issues.length > 0 ? `| Severity | Check | Target | Message |
| --- | --- | --- | --- |
${rows}` : rows}
`;

  fs.writeFileSync(path.join(reportsDir, "static-export-audit.md"), markdown);
}
