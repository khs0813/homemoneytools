#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { createRequire } from "module";

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, "docs");
const publicHost = "https://jipcalc.co.kr";

const args = parseArgs(process.argv.slice(2));
const label = args.label ?? "before";
const baseUrl = stripTrailingSlash(args.base ?? "http://localhost:3000");

fs.mkdirSync(docsDir, { recursive: true });

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const generatedAt = new Date().toISOString();
  const sitemap = await fetchText("/sitemap.xml");
  const sitemapUrls = parseSitemapUrls(sitemap.body);
  const sitemapPathSet = new Set(sitemapUrls.map((url) => new URL(url).pathname));
  const appRoutes = collectAppPageRoutes();
  const routePaths = Array.from(new Set([...sitemapUrls.map((url) => new URL(url).pathname), ...appRoutes, "/robots.txt", "/sitemap.xml", "/rss.xml"]))
    .sort((a, b) => a.localeCompare(b));

  const routes = [];
  const metadata = [];

  for (const routePath of routePaths) {
    const publicUrl = routePath.startsWith("http") ? routePath : `${publicHost}${routePath}`;
    const response = await fetchText(routePath);
    const record = {
      url: publicUrl,
      path: routePath,
      status: response.status,
      contentType: response.contentType,
      location: response.location,
      sitemapIncluded: sitemapPathSet.has(routePath),
      routeFileDetected: appRoutes.includes(routePath)
    };
    routes.push(record);

    if (response.status === 200 && response.contentType.includes("text/html")) {
      metadata.push(parseHtmlMetadata({
        publicUrl,
        path: routePath,
        html: response.body,
        status: response.status,
        headers: response.headers,
        sitemapIncluded: sitemapPathSet.has(routePath)
      }));
    }
  }

  const calculationResults = collectCalculationResults(generatedAt);

  writeJson(`metadata-${label}.json`, {
    generatedAt,
    baseUrl,
    publicHost,
    count: metadata.length,
    pages: metadata
  });
  writeJson(`routes-${label}.json`, {
    generatedAt,
    baseUrl,
    publicHost,
    count: routes.length,
    sitemapUrlCount: sitemapUrls.length,
    routes
  });
  writeJson(`calculation-results-${label}.json`, {
    generatedAt,
    count: calculationResults.length,
    results: calculationResults
  });
  writeMarkdown(`seo-baseline-${label}.md`, renderBaselineMarkdown({
    label,
    generatedAt,
    baseUrl,
    routes,
    metadata,
    calculationResults
  }));

  console.log(`Wrote docs/seo-baseline-${label}.md`);
  console.log(`Wrote docs/metadata-${label}.json`);
  console.log(`Wrote docs/routes-${label}.json`);
  console.log(`Wrote docs/calculation-results-${label}.json`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item.startsWith("--")) {
      const key = item.slice(2);
      const next = argv[index + 1];
      if (next && !next.startsWith("--")) {
        parsed[key] = next;
        index += 1;
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}

function stripTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function fetchText(routePath) {
  const url = routePath.startsWith("http") ? routePath : `${baseUrl}${routePath}`;
  const response = await fetch(url, {
    redirect: "manual",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; jipcalc-seo-snapshot/1.0)"
    }
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
    urls.push(decodeHtml(match[1].trim()));
  }
  return urls;
}

function collectAppPageRoutes() {
  const appDir = path.join(projectRoot, "src", "app");
  const routes = [];
  walk(appDir, (filePath) => {
    if (!filePath.endsWith(`${path.sep}page.tsx`)) return;
    const relativeDir = path.dirname(path.relative(appDir, filePath));
    if (relativeDir.split(path.sep).some((part) => part.startsWith("[") || part.startsWith("("))) return;
    const route = relativeDir === "." ? "/" : `/${relativeDir.split(path.sep).join("/")}`;
    routes.push(route);
  });
  return Array.from(new Set(routes)).sort((a, b) => a.localeCompare(b));
}

function walk(dir, visit) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, visit);
    } else {
      visit(entryPath);
    }
  }
}

function parseHtmlMetadata({ publicUrl, path: routePath, html, status, headers, sitemapIncluded }) {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescriptions = findTags(html, "meta")
    .filter((tag) => normalizeAttr(getAttr(tag, "name")) === "description")
    .map((tag) => getAttr(tag, "content") ?? "")
    .filter(Boolean);
  const canonicalTags = findTags(html, "link").filter((tag) => normalizeAttr(getAttr(tag, "rel")).split(/\s+/).includes("canonical"));
  const canonical = canonicalTags.map((tag) => getAttr(tag, "href") ?? "").filter(Boolean);
  const robotsMeta = findTags(html, "meta")
    .map((tag) => ({ name: normalizeAttr(getAttr(tag, "name")), content: getAttr(tag, "content") ?? "" }))
    .filter((item) => item.name === "robots" || item.name === "googlebot" || item.name === "yeti");
  const h1Values = collectTagText(html, "h1");
  const h2Values = collectTagText(html, "h2");
  const bodyText = extractBodyText(html);
  const internalLinks = collectInternalLinks(html, publicUrl);
  const jsonLd = collectJsonLd(html);
  const structuredDataTypes = Array.from(new Set(jsonLd.flatMap((item) => collectJsonLdTypes(item)).filter(Boolean))).sort();
  const datePublished = firstJsonLdValue(jsonLd, "datePublished");
  const dateModified = firstJsonLdValue(jsonLd, "dateModified");

  return {
    url: publicUrl,
    path: routePath,
    status,
    title: decodeHtml(title).trim(),
    titleCount: title ? 1 : 0,
    metaDescription: metaDescriptions[0] ? decodeHtml(metaDescriptions[0]).trim() : "",
    metaDescriptionCount: metaDescriptions.length,
    h1: h1Values[0] ?? "",
    h1Count: h1Values.length,
    h2: h2Values,
    canonical: canonical[0] ?? "",
    canonicalCount: canonical.length,
    robotsMeta,
    xRobotsTag: headers["x-robots-tag"] ?? "",
    indexable: !robotsMeta.some((item) => item.content.toLowerCase().includes("noindex")) && !(headers["x-robots-tag"] ?? "").toLowerCase().includes("noindex"),
    sitemapIncluded,
    internalLinkCount: internalLinks.length,
    uniqueInternalLinkCount: Array.from(new Set(internalLinks)).length,
    internalLinks: Array.from(new Set(internalLinks)).sort(),
    bodyTextLength: bodyText.length,
    structuredDataTypes,
    datePublished: datePublished ?? null,
    dateModified: dateModified ?? null,
    calculationBasisDate: extractLabelValue(html, "계산 기준일") ?? null,
    sourceCheckedAt: extractLabelValue(html, "출처 확인일") ?? null
  };
}

function findTags(html, tagName) {
  const regex = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(regex) ?? [];
}

function getAttr(tag, name) {
  const regex = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(regex);
  return match ? decodeHtml(match[2] ?? match[3] ?? match[4] ?? "") : undefined;
}

function normalizeAttr(value) {
  return (value ?? "").trim().toLowerCase();
}

function firstMatch(value, regex) {
  const match = value.match(regex);
  return match ? stripTags(match[1]) : "";
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

function stripTags(value) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function extractBodyText(html) {
  const body = firstMatchRaw(html, /<body[^>]*>([\s\S]*?)<\/body>/i) || html;
  return decodeHtml(stripTags(body).replace(/\s+/g, " ").trim());
}

function firstMatchRaw(value, regex) {
  const match = value.match(regex);
  return match ? match[1] : "";
}

function collectInternalLinks(html, publicUrl) {
  const links = [];
  const regex = /<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawHref = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "").trim();
    if (!rawHref || rawHref.startsWith("#") || /^(mailto|tel|javascript):/i.test(rawHref)) continue;
    try {
      const url = new URL(rawHref, publicUrl);
      if (url.hostname === new URL(publicHost).hostname) {
        links.push(`${url.pathname}${url.search}`);
      }
    } catch {
      // Ignore malformed hrefs in snapshot collection.
    }
  }
  return links;
}

function collectJsonLd(html) {
  const values = [];
  const regex = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const raw = decodeHtml(match[1]).trim();
    try {
      values.push(JSON.parse(raw));
    } catch {
      values.push({ parseError: true, rawLength: raw.length });
    }
  }
  return values;
}

function collectJsonLdTypes(value) {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectJsonLdTypes);
  const current = value["@type"];
  const graph = value["@graph"] ? collectJsonLdTypes(value["@graph"]) : [];
  return [...(Array.isArray(current) ? current : current ? [current] : []), ...graph];
}

function firstJsonLdValue(jsonLd, key) {
  for (const item of jsonLd) {
    const found = findJsonValue(item, key);
    if (found !== undefined) return found;
  }
  return undefined;
}

function findJsonValue(value, key) {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJsonValue(item, key);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(value, key)) return value[key];
  for (const child of Object.values(value)) {
    const found = findJsonValue(child, key);
    if (found !== undefined) return found;
  }
  return undefined;
}

function extractLabelValue(html, label) {
  const ddRegex = new RegExp(`<dt[^>]*>\\s*${escapeRegExp(label)}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, "i");
  const ddValue = firstMatch(html, ddRegex);
  if (ddValue) return decodeHtml(ddValue).trim();

  const text = extractBodyText(html);
  const inlineRegex = new RegExp(`${escapeRegExp(label)}\\s*[:：]?\\s*(\\d{4}-\\d{2}-\\d{2})`);
  const match = text.match(inlineRegex);
  return match ? match[1] : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function collectCalculationResults(generatedAt) {
  registerTypeScriptRequire();

  const { calculateJeonseLoan, calculateLoan } = requireFromRoot("src/lib/calculators/loan.ts");
  const { calculateDsr } = requireFromRoot("src/lib/calculators/dsr.ts");
  const { calculateAcquisitionTax } = requireFromRoot("src/lib/calculators/acquisition-tax.ts");
  const { calculateBrokerageFee } = requireFromRoot("src/lib/calculators/brokerage-fee.ts");
  const { calculateRentVsJeonse } = requireFromRoot("src/lib/calculators/rent-vs-jeonse.ts");
  const { calculateRentConversion } = requireFromRoot("src/lib/calculators/rent-conversion.ts");
  const { calculateSubscriptionScore } = requireFromRoot("src/lib/calculators/subscription-score.ts");
  const finance = requireFromRoot("src/lib/calculators/finance.ts");

  const cases = [
    {
      slug: "take-home-pay",
      path: "/take-home-pay-calculator",
      input: { annualSalary: 50_000_000, annualBonus: 0, monthlyNonTaxable: 200_000, dependents: 1, childrenUnder20: 0 },
      output: finance.calculateTakeHomePay({ annualSalary: 50_000_000, annualBonus: 0, monthlyNonTaxable: 200_000, dependents: 1, childrenUnder20: 0 })
    },
    {
      slug: "loan-interest",
      path: "/loan-interest-calculator",
      input: { principal: 100_000_000, annualRate: 5, years: 10, repaymentType: "interest-only" },
      output: calculateLoan({ principal: 100_000_000, annualRate: 5, years: 10, repaymentType: "interest-only" })
    },
    {
      slug: "severance-pay",
      path: "/severance-pay-calculator",
      input: { averageMonthlyWage: 3_500_000, years: 5, extraMonths: 0, taxRate: 0 },
      output: finance.calculateSeverancePay({ averageMonthlyWage: 3_500_000, years: 5, extraMonths: 0, taxRate: 0 })
    },
    {
      slug: "dividend-income",
      path: "/dividend-income-calculator",
      input: { investmentAmount: 100_000_000, dividendYield: 4, taxRate: 15.4, frequency: 4, targetMonthlyDividend: 1_000_000 },
      output: finance.calculateDividendIncome({ investmentAmount: 100_000_000, dividendYield: 4, taxRate: 15.4, frequency: 4, targetMonthlyDividend: 1_000_000 })
    },
    {
      slug: "exchange-rate",
      path: "/exchange-rate-calculator",
      input: { krwAmount: 1_300_000, exchangeRate: 1350, feeRate: 1, backExchangeRate: 1350 },
      output: finance.calculateExchangeRate({ krwAmount: 1_300_000, exchangeRate: 1350, feeRate: 1, backExchangeRate: 1350 })
    },
    {
      slug: "overseas-stock-tax",
      path: "/overseas-stock-capital-gains-tax-calculator",
      input: { buyPrice: 100, sellPrice: 120, shares: 100, buyRate: 1300, sellRate: 1350, fees: 50_000 },
      output: finance.calculateOverseasStockTax({ buyPrice: 100, sellPrice: 120, shares: 100, buyRate: 1300, sellRate: 1350, fees: 50_000 })
    },
    {
      slug: "electricity-bill",
      path: "/electricity-bill-calculator",
      input: { monthlyUsageKwh: 350, season: "normal" },
      output: finance.calculateElectricityBill({ monthlyUsageKwh: 350, season: "normal" })
    },
    {
      slug: "air-conditioner-electricity-cost",
      path: "/air-conditioner-electricity-cost-calculator",
      input: { powerWatts: 1200, hoursPerDay: 8, daysPerMonth: 30, pricePerKwh: 180 },
      output: finance.calculateAirConditionerCost({ powerWatts: 1200, hoursPerDay: 8, daysPerMonth: 30, pricePerKwh: 180 })
    },
    {
      slug: "car-maintenance-cost",
      path: "/car-maintenance-cost-calculator",
      input: { monthlyDistanceKm: 1200, fuelEfficiencyKmPerL: 12, fuelPricePerL: 1700, annualInsurance: 1_200_000, annualTax: 300_000, monthlyParking: 100_000, monthlyToll: 50_000, monthlyMaintenanceReserve: 100_000, monthlyInstallment: 0 },
      output: finance.calculateCarMaintenanceCost({ monthlyDistanceKm: 1200, fuelEfficiencyKmPerL: 12, fuelPricePerL: 1700, annualInsurance: 1_200_000, annualTax: 300_000, monthlyParking: 100_000, monthlyToll: 50_000, monthlyMaintenanceReserve: 100_000, monthlyInstallment: 0 })
    },
    {
      slug: "monthly-living-expense",
      path: "/monthly-living-expense-calculator",
      input: { monthlyNetIncome: 3_200_000, housing: 900_000, food: 600_000, transportation: 200_000, telecom: 100_000, insurance: 200_000, education: 100_000, leisure: 300_000, debt: 200_000, miscellaneous: 150_000 },
      output: finance.calculateMonthlyLivingExpense({ monthlyNetIncome: 3_200_000, housing: 900_000, food: 600_000, transportation: 200_000, telecom: 100_000, insurance: 200_000, education: 100_000, leisure: 300_000, debt: 200_000, miscellaneous: 150_000 })
    },
    {
      slug: "jeonse-loan-interest",
      path: "/jeonse-loan-interest-calculator",
      input: { jeonseDeposit: 400_000_000, principal: 200_000_000, annualRate: 4.2, years: 2, repaymentType: "interest-only", guaranteeFeeRate: 0.115 },
      output: calculateJeonseLoan({ jeonseDeposit: 400_000_000, principal: 200_000_000, annualRate: 4.2, years: 2, repaymentType: "interest-only", guaranteeFeeRate: 0.115 })
    },
    {
      slug: "rent-vs-jeonse",
      path: "/rent-vs-jeonse-calculator",
      input: { jeonseDeposit: 500_000_000, rentDeposit: 100_000_000, monthlyRent: 1_200_000, years: 2, savingRate: 3, jeonseLoanRate: 4, jeonseLoanAmount: 300_000_000 },
      output: calculateRentVsJeonse({ jeonseDeposit: 500_000_000, rentDeposit: 100_000_000, monthlyRent: 1_200_000, years: 2, savingRate: 3, jeonseLoanRate: 4, jeonseLoanAmount: 300_000_000 })
    },
    {
      slug: "dsr",
      path: "/dsr-calculator",
      input: { annualIncome: 70_000_000, mortgageAmount: 300_000_000, mortgageRate: 4.5, mortgageYears: 30, existingCreditLoanAmount: 30_000_000, existingCreditLoanRate: 6, otherAnnualRepayment: 0, dsrLimit: 40, stressRate: 1.5, creditLoanMode: "amortized" },
      output: calculateDsr({ annualIncome: 70_000_000, mortgageAmount: 300_000_000, mortgageRate: 4.5, mortgageYears: 30, existingCreditLoanAmount: 30_000_000, existingCreditLoanRate: 6, otherAnnualRepayment: 0, dsrLimit: 40, stressRate: 1.5, creditLoanMode: "amortized" })
    },
    {
      slug: "acquisition-tax",
      path: "/acquisition-tax-calculator",
      input: { price: 600_000_000, houseCount: "one", isRegulatedArea: false, floorAreaOver85: true, firstHomeDiscountType: "none" },
      output: calculateAcquisitionTax({ price: 600_000_000, houseCount: "one", isRegulatedArea: false, floorAreaOver85: true, firstHomeDiscountType: "none" })
    },
    {
      slug: "brokerage-fee",
      path: "/real-estate-brokerage-fee-calculator",
      input: { transactionType: "sale", transactionAmount: 600_000_000, customRate: 0.4, includeVat: true },
      output: calculateBrokerageFee({ transactionType: "sale", transactionAmount: 600_000_000, customRate: 0.4, includeVat: true })
    },
    {
      slug: "monthly-rent-conversion",
      path: "/monthly-rent-conversion-calculator",
      input: { type: "jeonse-to-rent", jeonseAmount: 300_000_000, deposit: 100_000_000, conversionRate: 5.5, years: 2 },
      output: calculateRentConversion({ type: "jeonse-to-rent", jeonseAmount: 300_000_000, deposit: 100_000_000, conversionRate: 5.5, years: 2 })
    },
    {
      slug: "housing-subscription-score",
      path: "/housing-subscription-score-calculator",
      input: { birthDate: "1988-01-01", maritalStatus: "married", marriageDate: "2018-01-01", homelessStartDate: "2018-01-01", dependents: 3, accountStartDate: "2016-01-01", spouseAccountStartDate: "2017-01-01", announcementDate: "2026-07-01" },
      output: calculateSubscriptionScore({ birthDate: "1988-01-01", maritalStatus: "married", marriageDate: "2018-01-01", homelessStartDate: "2018-01-01", dependents: 3, accountStartDate: "2016-01-01", spouseAccountStartDate: "2017-01-01", announcementDate: "2026-07-01" })
    }
  ];

  return cases.map((item) => ({
    ...item,
    generatedAt,
    resultJson: stableStringify(item.output)
  }));
}

function registerTypeScriptRequire() {
  const require = createRequire(import.meta.url);
  const Module = require("module");
  const typescript = require("typescript");

  if (!require.extensions[".ts"]) {
    require.extensions[".ts"] = (module, filename) => {
      const source = fs.readFileSync(filename, "utf8");
      const output = typescript.transpileModule(source, {
        compilerOptions: {
          module: typescript.ModuleKind.CommonJS,
          target: typescript.ScriptTarget.ES2022,
          esModuleInterop: true,
          jsx: typescript.JsxEmit.ReactJSX
        },
        fileName: filename
      }).outputText;
      module._compile(output, filename);
    };
  }

  if (!Module.__jipcalcAliasRegistered) {
    const originalResolve = Module._resolveFilename;
    Module._resolveFilename = function resolveWithAlias(request, parent, isMain, options) {
      if (request.startsWith("@/")) {
        return originalResolve.call(this, path.join(projectRoot, "src", request.slice(2)), parent, isMain, options);
      }
      return originalResolve.call(this, request, parent, isMain, options);
    };
    Module.__jipcalcAliasRegistered = true;
  }
}

function requireFromRoot(relativePath) {
  const require = createRequire(import.meta.url);
  return require(path.join(projectRoot, relativePath));
}

function stableStringify(value) {
  return JSON.stringify(sortObject(value));
}

function sortObject(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}

function writeJson(fileName, value) {
  fs.writeFileSync(path.join(docsDir, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

function writeMarkdown(fileName, content) {
  fs.writeFileSync(path.join(docsDir, fileName), content);
}

function renderBaselineMarkdown({ label, generatedAt, baseUrl, routes, metadata, calculationResults }) {
  const lines = [];
  lines.push(`# SEO Baseline ${label}`);
  lines.push("");
  lines.push(`- Generated at: ${generatedAt}`);
  lines.push(`- Fetch base: ${baseUrl}`);
  lines.push(`- Route count: ${routes.length}`);
  lines.push(`- HTML page count: ${metadata.length}`);
  lines.push(`- Calculation example count: ${calculationResults.length}`);
  lines.push("");
  lines.push("## Route Status");
  lines.push("");
  lines.push("| URL | HTTP | Sitemap | Content-Type | Redirect Location |");
  lines.push("| --- | ---: | --- | --- | --- |");
  for (const route of routes) {
    lines.push(`| ${route.url} | ${route.status} | ${route.sitemapIncluded ? "yes" : "no"} | ${escapeTable(route.contentType)} | ${escapeTable(route.location ?? "")} |`);
  }
  lines.push("");
  lines.push("## HTML Metadata");
  lines.push("");
  lines.push("| URL | HTTP | Title | Description | H1 | Canonical | Robots | X-Robots | Sitemap | Links | Body chars | Structured data | datePublished | dateModified | calculationBasisDate |");
  lines.push("| --- | ---: | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |");
  for (const page of metadata) {
    lines.push([
      page.url,
      String(page.status),
      escapeTable(page.title),
      escapeTable(page.metaDescription),
      escapeTable(page.h1),
      escapeTable(page.canonical),
      escapeTable(page.robotsMeta.map((item) => `${item.name}:${item.content}`).join("; ")),
      escapeTable(page.xRobotsTag),
      page.sitemapIncluded ? "yes" : "no",
      String(page.internalLinkCount),
      String(page.bodyTextLength),
      escapeTable(page.structuredDataTypes.join(", ")),
      page.datePublished ?? "",
      page.dateModified ?? "",
      page.calculationBasisDate ?? ""
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"));
  }
  lines.push("");
  lines.push("## Calculation Examples");
  lines.push("");
  lines.push("| Calculator | Path | Input | Output |");
  lines.push("| --- | --- | --- | --- |");
  for (const item of calculationResults) {
    lines.push(`| ${item.slug} | ${item.path} | \`${escapeTable(JSON.stringify(item.input))}\` | \`${escapeTable(item.resultJson)}\` |`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}
