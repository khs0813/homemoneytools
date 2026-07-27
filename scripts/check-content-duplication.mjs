#!/usr/bin/env node

import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, "docs");
const args = parseArgs(process.argv.slice(2));
const baseUrl = stripTrailingSlash(args.base ?? "http://localhost:3000");
const publicHost = "https://jipcalc.co.kr";

const bannedPhrases = [
  "입력값 기준 월 부담액과 총비용 구조",
  "금리 변동, 위험 구간, 해석 포인트",
  "계산 공식, 실제 사례, 자주 하는 실수",
  "관련 계산기 추천과 공식 참고 출처",
  "실제 금리, 세율, 중개보수, 청약 기준",
  ["단순 템플릿", "사이트처럼 보이지 않도록"].join(" ")
];

const pageSpecificRules = [
  {
    path: "/electricity-bill-calculator",
    label: "전기요금 계산기",
    pattern: /(금리|전세대출|취득세|청약|중개보수)/,
    message: "전기요금과 무관한 금리·주거 거래 문구가 남아 있습니다."
  },
  {
    path: "/dividend-income-calculator",
    label: "배당금 계산기",
    pattern: /(전세|월세|매매 과정|취득세|청약|중개보수)/,
    message: "배당금과 무관한 주거 관련 문구가 남아 있습니다."
  },
  {
    path: "/acquisition-tax-calculator",
    label: "취득세 계산기",
    pattern: /월 부담액/,
    message: "취득세 페이지에 월 부담액 안내가 남아 있습니다."
  },
  {
    path: "/housing-subscription-score-calculator",
    label: "청약가점 계산기",
    pattern: /금리 변동/,
    message: "청약가점 페이지에 금리 변동 안내가 남아 있습니다."
  }
];

fs.mkdirSync(docsDir, { recursive: true });

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const generatedAt = new Date().toISOString();
  const sitemap = await fetchText("/sitemap.xml");
  const urls = parseSitemapUrls(sitemap);
  const pages = [];

  for (const url of urls) {
    const parsed = new URL(url);
    const response = await fetchText(parsed.pathname);
    if (!response.includes("<html")) continue;
    const text = extractMainText(response);
    const h2Combos = collectH2Combos(response);
    pages.push({
      url,
      path: parsed.pathname,
      text,
      sentences: splitSentences(text),
      h2Combos
    });
  }

  const repeatedSentences = findRepeatedSentences(pages);
  const repeatedH2Combos = findRepeatedH2Combos(pages);
  const bannedPhraseFindings = findBannedPhrases(pages);
  const pageSpecificFindings = findPageSpecificIssues(pages);

  const failureCount = repeatedSentences.length + repeatedH2Combos.length + bannedPhraseFindings.length + pageSpecificFindings.length;
  const report = renderReport({
    generatedAt,
    baseUrl,
    pageCount: pages.length,
    repeatedSentences,
    repeatedH2Combos,
    bannedPhraseFindings,
    pageSpecificFindings,
    failureCount
  });

  fs.writeFileSync(path.join(docsDir, "content-duplication-report.md"), report);
  console.log("Wrote docs/content-duplication-report.md");

  if (failureCount > 0) {
    console.error(`Content duplication check failed: ${failureCount} issue(s)`);
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

async function fetchText(routePath) {
  const response = await fetch(`${baseUrl}${routePath}`, {
    redirect: "manual",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; jipcalc-content-duplication-check/1.0)"
    }
  });
  return response.text();
}

function parseSitemapUrls(xml) {
  const urls = [];
  const regex = /<loc>([\s\S]*?)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const value = decodeHtml(match[1].trim());
    if (value.startsWith(publicHost)) urls.push(value);
  }
  return urls;
}

function extractMainText(html) {
  const main = firstMatchRaw(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i) || html;
  return decodeHtml(main
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function collectH2Combos(html) {
  const main = firstMatchRaw(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i) || html;
  const cleaned = main
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const blocks = cleaned.split(/(?=<h2\b)/i).filter((block) => /^<h2\b/i.test(block));
  return blocks.map((block) => {
    const h2 = decodeHtml(stripTags(firstMatchRaw(block, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i)).replace(/\s+/g, " ").trim());
    const body = decodeHtml(stripTags(block.replace(/<h2\b[\s\S]*?<\/h2>/i, " ")).replace(/\s+/g, " ").trim()).slice(0, 240);
    return normalizeText(`${h2} ${body}`);
  }).filter((value) => value.length >= 100);
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?。]|다\.|요\.|니다\.)\s+/)
    .map(normalizeText)
    .filter((sentence) => sentence.length >= 100)
    .filter((sentence) => !isAllowedCommonSentence(sentence));
}

function findRepeatedSentences(pages) {
  const usage = new Map();
  for (const page of pages) {
    for (const sentence of new Set(page.sentences)) {
      if (!usage.has(sentence)) usage.set(sentence, []);
      usage.get(sentence).push(page.url);
    }
  }
  return Array.from(usage.entries())
    .filter(([, urls]) => urls.length >= 3)
    .map(([sentence, urls]) => ({ sentence, urls }))
    .sort((a, b) => b.urls.length - a.urls.length);
}

function findRepeatedH2Combos(pages) {
  const usage = new Map();
  for (const page of pages) {
    for (const combo of new Set(page.h2Combos)) {
      if (!usage.has(combo)) usage.set(combo, []);
      usage.get(combo).push(page.url);
    }
  }
  return Array.from(usage.entries())
    .filter(([combo, urls]) => urls.length >= 3 && !isAllowedCommonSentence(combo))
    .map(([combo, urls]) => ({ combo, urls }))
    .sort((a, b) => b.urls.length - a.urls.length);
}

function findBannedPhrases(pages) {
  const findings = [];
  for (const page of pages) {
    for (const phrase of bannedPhrases) {
      if (page.text.includes(phrase)) {
        findings.push({ url: page.url, phrase });
      }
    }
  }
  return findings;
}

function findPageSpecificIssues(pages) {
  const findings = [];
  for (const rule of pageSpecificRules) {
    const page = pages.find((item) => item.path === rule.path);
    if (page && rule.pattern.test(page.text)) {
      findings.push({ url: page.url, label: rule.label, message: rule.message });
    }
  }
  return findings;
}

function isAllowedCommonSentence(sentence) {
  return [
    "개인정보처리방침",
    "이용약관",
    "문의 페이지",
    "면책고지",
    "계산 결과는 참고용",
    "면책 안내 본 글은 공개된 제도와 기준을 이해하기 쉽게 정리한 참고용 콘텐츠입니다",
    "관련 계산기"
  ].some((allowed) => sentence.includes(allowed));
}

function firstMatchRaw(value, regex) {
  const match = value.match(regex);
  return match ? match[1] : "";
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
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

function renderReport({
  generatedAt,
  baseUrl,
  pageCount,
  repeatedSentences,
  repeatedH2Combos,
  bannedPhraseFindings,
  pageSpecificFindings,
  failureCount
}) {
  const lines = [];
  lines.push("# Content Duplication Report");
  lines.push("");
  lines.push(`- Generated at: ${generatedAt}`);
  lines.push(`- Fetch base: ${baseUrl}`);
  lines.push(`- Checked HTML pages: ${pageCount}`);
  lines.push(`- Failure count: ${failureCount}`);
  lines.push("");
  lines.push("## Repeated Sentences");
  lines.push("");
  if (repeatedSentences.length === 0) {
    lines.push("No identical 100+ character sentences repeated across 3 or more pages.");
  } else {
    lines.push("| Pages | Sentence | URLs |");
    lines.push("| ---: | --- | --- |");
    for (const item of repeatedSentences) {
      lines.push(`| ${item.urls.length} | ${escapeTable(item.sentence)} | ${escapeTable(item.urls.join(", "))} |`);
    }
  }
  lines.push("");
  lines.push("## Repeated H2 And Body Combos");
  lines.push("");
  if (repeatedH2Combos.length === 0) {
    lines.push("No identical H2/body combinations repeated across 3 or more pages.");
  } else {
    lines.push("| Pages | H2/body combo | URLs |");
    lines.push("| ---: | --- | --- |");
    for (const item of repeatedH2Combos) {
      lines.push(`| ${item.urls.length} | ${escapeTable(item.combo)} | ${escapeTable(item.urls.join(", "))} |`);
    }
  }
  lines.push("");
  lines.push("## Banned Common Phrases");
  lines.push("");
  if (bannedPhraseFindings.length === 0) {
    lines.push("No task-specific banned common phrases were found.");
  } else {
    lines.push("| URL | Phrase |");
    lines.push("| --- | --- |");
    for (const item of bannedPhraseFindings) {
      lines.push(`| ${item.url} | ${escapeTable(item.phrase)} |`);
    }
  }
  lines.push("");
  lines.push("## Page-Specific Intent Issues");
  lines.push("");
  if (pageSpecificFindings.length === 0) {
    lines.push("No page-specific intent mismatch phrases were found.");
  } else {
    lines.push("| URL | Page | Issue |");
    lines.push("| --- | --- | --- |");
    for (const item of pageSpecificFindings) {
      lines.push(`| ${item.url} | ${item.label} | ${escapeTable(item.message)} |`);
    }
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}
