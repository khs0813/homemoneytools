#!/usr/bin/env node

import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, "docs");

main();

function main() {
  const beforeMetadata = readJson("metadata-before.json");
  const afterMetadata = readJson("metadata-after.json");
  const beforeRoutes = readJson("routes-before.json");
  const afterRoutes = readJson("routes-after.json");
  const beforeCalculations = readJson("calculation-results-before.json");
  const afterCalculations = readJson("calculation-results-after.json");

  const findings = [
    ...compareRoutes(beforeRoutes, afterRoutes),
    ...compareMetadata(beforeMetadata, afterMetadata),
    ...compareCalculations(beforeCalculations, afterCalculations)
  ];

  const report = renderReport(findings, {
    beforeMetadata,
    afterMetadata,
    beforeRoutes,
    afterRoutes,
    beforeCalculations,
    afterCalculations
  });

  fs.writeFileSync(path.join(docsDir, "seo-stability-comparison.md"), report);

  const failures = findings.filter((item) => item.level === "fail");
  console.log(`Wrote docs/seo-stability-comparison.md`);
  if (failures.length > 0) {
    console.error(`SEO stability comparison failed: ${failures.length} issue(s)`);
    process.exit(1);
  }
}

function readJson(fileName) {
  const filePath = path.join(docsDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function compareRoutes(before, after) {
  const findings = [];
  const beforeByUrl = mapBy(before.routes, "url");
  const afterByUrl = mapBy(after.routes, "url");
  compareSets("route URL", beforeByUrl, afterByUrl, findings);

  if (before.sitemapUrlCount !== after.sitemapUrlCount) {
    findings.push({ level: "fail", area: "sitemap", message: `Sitemap URL count changed from ${before.sitemapUrlCount} to ${after.sitemapUrlCount}` });
  }

  for (const [url, beforeRoute] of beforeByUrl) {
    const afterRoute = afterByUrl.get(url);
    if (!afterRoute) continue;
    if (beforeRoute.status !== afterRoute.status) {
      findings.push({ level: "fail", area: "http", url, message: `HTTP status changed from ${beforeRoute.status} to ${afterRoute.status}` });
    }
    if (beforeRoute.sitemapIncluded !== afterRoute.sitemapIncluded) {
      findings.push({ level: "fail", area: "sitemap", url, message: `Sitemap inclusion changed from ${beforeRoute.sitemapIncluded} to ${afterRoute.sitemapIncluded}` });
    }
    if ((beforeRoute.location ?? "") !== (afterRoute.location ?? "")) {
      findings.push({ level: "fail", area: "redirect", url, message: `Redirect location changed from ${beforeRoute.location ?? ""} to ${afterRoute.location ?? ""}` });
    }
  }

  return findings;
}

function compareMetadata(before, after) {
  const findings = [];
  const beforeByUrl = mapBy(before.pages, "url");
  const afterByUrl = mapBy(after.pages, "url");
  compareSets("HTML page URL", beforeByUrl, afterByUrl, findings);

  const titleCounts = new Map();
  const descriptionCounts = new Map();
  for (const page of after.pages) {
    titleCounts.set(page.title, (titleCounts.get(page.title) ?? 0) + 1);
    descriptionCounts.set(page.metaDescription, (descriptionCounts.get(page.metaDescription) ?? 0) + 1);
    if (!page.title) findings.push({ level: "fail", area: "metadata", url: page.url, message: "Missing title" });
    if (!page.metaDescription) findings.push({ level: "fail", area: "metadata", url: page.url, message: "Missing description" });
    if (page.h1Count !== 1) findings.push({ level: "fail", area: "html", url: page.url, message: `Expected one H1, found ${page.h1Count}` });
    if (page.canonicalCount !== 1) findings.push({ level: "fail", area: "canonical", url: page.url, message: `Expected one canonical, found ${page.canonicalCount}` });
    if (!page.indexable) findings.push({ level: "fail", area: "indexability", url: page.url, message: "Page is noindex after changes" });
  }

  for (const [title, count] of titleCounts) {
    if (title && count > 1) findings.push({ level: "fail", area: "metadata", message: `Duplicate title after changes: ${title}` });
  }
  for (const [description, count] of descriptionCounts) {
    if (description && count > 1) findings.push({ level: "fail", area: "metadata", message: `Duplicate description after changes: ${description}` });
  }

  for (const [url, beforePage] of beforeByUrl) {
    const afterPage = afterByUrl.get(url);
    if (!afterPage) continue;
    if (beforePage.status !== afterPage.status) {
      findings.push({ level: "fail", area: "http", url, message: `HTML status changed from ${beforePage.status} to ${afterPage.status}` });
    }
    if (beforePage.canonical !== afterPage.canonical) {
      findings.push({ level: "fail", area: "canonical", url, message: `Canonical changed from ${beforePage.canonical} to ${afterPage.canonical}` });
    }
    if (beforePage.indexable && !afterPage.indexable) {
      findings.push({ level: "fail", area: "indexability", url, message: "Indexable page became non-indexable" });
    }
    if (beforePage.sitemapIncluded !== afterPage.sitemapIncluded) {
      findings.push({ level: "fail", area: "sitemap", url, message: "HTML sitemap inclusion changed" });
    }
    if (beforePage.title !== afterPage.title) {
      findings.push({ level: "warn", area: "metadata", url, message: `Title changed from "${beforePage.title}" to "${afterPage.title}"` });
    }
    if (beforePage.metaDescription !== afterPage.metaDescription) {
      findings.push({ level: "warn", area: "metadata", url, message: "Meta description changed" });
    }
    const beforeLinks = new Set(beforePage.internalLinks ?? []);
    const afterLinks = new Set(afterPage.internalLinks ?? []);
    if (!sameSet(beforeLinks, afterLinks)) {
      findings.push({ level: "warn", area: "internal-links", url, message: "Internal link target set changed" });
    }
  }

  return findings;
}

function compareCalculations(before, after) {
  const findings = [];
  const beforeBySlug = mapBy(before.results, "slug");
  const afterBySlug = mapBy(after.results, "slug");
  compareSets("calculation result", beforeBySlug, afterBySlug, findings);

  for (const [slug, beforeResult] of beforeBySlug) {
    const afterResult = afterBySlug.get(slug);
    if (!afterResult) continue;
    if (beforeResult.resultJson !== afterResult.resultJson) {
      findings.push({ level: "fail", area: "calculation", url: beforeResult.path, message: `Calculation output changed for ${slug}` });
    }
  }

  return findings;
}

function compareSets(label, beforeMap, afterMap, findings) {
  for (const key of beforeMap.keys()) {
    if (!afterMap.has(key)) findings.push({ level: "fail", area: label, url: key, message: `${label} removed after changes` });
  }
  for (const key of afterMap.keys()) {
    if (!beforeMap.has(key)) findings.push({ level: "fail", area: label, url: key, message: `${label} added after changes` });
  }
}

function mapBy(items, key) {
  return new Map(items.map((item) => [item[key], item]));
}

function sameSet(left, right) {
  if (left.size !== right.size) return false;
  for (const item of left) {
    if (!right.has(item)) return false;
  }
  return true;
}

function renderReport(findings, snapshots) {
  const failCount = findings.filter((item) => item.level === "fail").length;
  const warnCount = findings.filter((item) => item.level === "warn").length;
  const lines = [];
  lines.push("# SEO Stability Comparison");
  lines.push("");
  lines.push(`- Before metadata pages: ${snapshots.beforeMetadata.count}`);
  lines.push(`- After metadata pages: ${snapshots.afterMetadata.count}`);
  lines.push(`- Before route count: ${snapshots.beforeRoutes.count}`);
  lines.push(`- After route count: ${snapshots.afterRoutes.count}`);
  lines.push(`- Before sitemap URL count: ${snapshots.beforeRoutes.sitemapUrlCount}`);
  lines.push(`- After sitemap URL count: ${snapshots.afterRoutes.sitemapUrlCount}`);
  lines.push(`- Calculation fixtures: ${snapshots.beforeCalculations.count} before / ${snapshots.afterCalculations.count} after`);
  lines.push(`- Failures: ${failCount}`);
  lines.push(`- Warnings: ${warnCount}`);
  lines.push("");
  lines.push("## Findings");
  lines.push("");
  if (findings.length === 0) {
    lines.push("No URL, indexability, canonical, sitemap, internal link, metadata, or calculation differences were detected.");
  } else {
    lines.push("| Level | Area | URL | Message |");
    lines.push("| --- | --- | --- | --- |");
    for (const finding of findings) {
      lines.push(`| ${finding.level} | ${finding.area} | ${finding.url ?? ""} | ${escapeTable(finding.message)} |`);
    }
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}
