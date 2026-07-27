#!/usr/bin/env node

import crypto from "crypto";
import fs from "fs";
import path from "path";

const docsDir = path.join(process.cwd(), "docs");
const args = parseArgs(process.argv.slice(2));
const baseUrl = stripTrailingSlash(args.base ?? "http://localhost:3000");

const targets = [
  "/",
  "/dsr-calculator",
  "/acquisition-tax-calculator",
  "/real-estate-brokerage-fee-calculator",
  "/rent-vs-jeonse-calculator",
  "/monthly-rent-conversion-calculator",
  "/housing-subscription-score-calculator",
  "/jeonse-loan-interest-calculator"
];

const userAgents = [
  { label: "Browser", value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
  { label: "Yeti", value: "Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)" },
  { label: "Googlebot", value: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }
];

fs.mkdirSync(docsDir, { recursive: true });

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const generatedAt = new Date().toISOString();
  const rows = [];
  const failures = [];

  for (const target of targets) {
    const snapshots = [];
    for (const userAgent of userAgents) {
      const html = await fetchHtml(target, userAgent.value);
      const parsed = parseHtml(html.body);
      snapshots.push({
        userAgent: userAgent.label,
        status: html.status,
        title: parsed.title,
        description: parsed.description,
        h1: parsed.h1,
        bodyHash: hash(parsed.bodyText),
        bodyTextLength: parsed.bodyText.length
      });
    }

    const baseline = snapshots[0];
    for (const snapshot of snapshots) {
      if (snapshot.status !== 200) failures.push(`${target} ${snapshot.userAgent}: HTTP ${snapshot.status}`);
      if (snapshot.title !== baseline.title) failures.push(`${target} ${snapshot.userAgent}: title mismatch`);
      if (snapshot.description !== baseline.description) failures.push(`${target} ${snapshot.userAgent}: description mismatch`);
      if (snapshot.h1 !== baseline.h1) failures.push(`${target} ${snapshot.userAgent}: H1 mismatch`);
      if (snapshot.bodyHash !== baseline.bodyHash) failures.push(`${target} ${snapshot.userAgent}: body mismatch`);
    }
    rows.push({ path: target, snapshots });
  }

  const report = renderReport({ generatedAt, baseUrl, rows, failures });
  fs.writeFileSync(path.join(docsDir, "user-agent-render-check.md"), report);
  console.log("Wrote docs/user-agent-render-check.md");

  if (failures.length > 0) {
    console.error(`User-agent check failed: ${failures.length} issue(s)`);
    process.exit(1);
  }
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

async function fetchHtml(routePath, userAgent) {
  const response = await fetch(`${baseUrl}${routePath}`, {
    redirect: "manual",
    headers: { "User-Agent": userAgent }
  });
  return {
    status: response.status,
    body: await response.text()
  };
}

function parseHtml(html) {
  return {
    title: text(firstMatchRaw(html, /<title[^>]*>([\s\S]*?)<\/title>/i)),
    description: metaDescription(html),
    h1: text(firstMatchRaw(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)),
    bodyText: extractBodyText(html)
  };
}

function metaDescription(html) {
  const meta = (html.match(/<meta\b[^>]*>/gi) ?? []).find((tag) => /name\s*=\s*["']description["']/i.test(tag));
  if (!meta) return "";
  const match = meta.match(/content\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return decodeHtml(match?.[2] ?? match?.[3] ?? match?.[4] ?? "");
}

function extractBodyText(html) {
  const body = firstMatchRaw(html, /<body[^>]*>([\s\S]*?)<\/body>/i) || html;
  return text(body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " "));
}

function firstMatchRaw(value, regex) {
  const match = value.match(regex);
  return match ? match[1] : "";
}

function text(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
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

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function renderReport({ generatedAt, baseUrl, rows, failures }) {
  const lines = [];
  lines.push("# User-Agent Render Check");
  lines.push("");
  lines.push(`- Generated at: ${generatedAt}`);
  lines.push(`- Fetch base: ${baseUrl}`);
  lines.push(`- Checked paths: ${rows.length}`);
  lines.push(`- Failures: ${failures.length}`);
  lines.push("");
  lines.push("## Results");
  lines.push("");
  lines.push("| Path | UA | HTTP | Title | Description | H1 | Body chars | Body hash |");
  lines.push("| --- | --- | ---: | --- | --- | --- | ---: | --- |");
  for (const row of rows) {
    for (const snapshot of row.snapshots) {
      lines.push(`| ${row.path} | ${snapshot.userAgent} | ${snapshot.status} | ${escapeTable(snapshot.title)} | ${escapeTable(snapshot.description)} | ${escapeTable(snapshot.h1)} | ${snapshot.bodyTextLength} | ${snapshot.bodyHash.slice(0, 12)} |`);
    }
  }
  lines.push("");
  lines.push("## Failures");
  lines.push("");
  lines.push(failures.length ? failures.map((item) => `- ${item}`).join("\n") : "No user-agent-specific differences were detected.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}
