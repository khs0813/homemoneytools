#!/usr/bin/env node

import fs from "fs";
import path from "path";

const docsDir = path.join(process.cwd(), "docs");

const before = readJson("calculation-results-before.json");
const after = readJson("calculation-results-after.json");
const findings = [];

const beforeBySlug = new Map(before.results.map((item) => [item.slug, item]));
const afterBySlug = new Map(after.results.map((item) => [item.slug, item]));

for (const slug of beforeBySlug.keys()) {
  if (!afterBySlug.has(slug)) {
    findings.push(`- ${slug}: after 결과가 없습니다.`);
  }
}

for (const slug of afterBySlug.keys()) {
  if (!beforeBySlug.has(slug)) {
    findings.push(`- ${slug}: before에 없던 결과가 추가됐습니다.`);
  }
}

for (const [slug, beforeResult] of beforeBySlug) {
  const afterResult = afterBySlug.get(slug);
  if (!afterResult) continue;
  if (beforeResult.resultJson !== afterResult.resultJson) {
    findings.push(`- ${slug}: 계산 결과가 변경됐습니다.\n  - before: \`${beforeResult.resultJson}\`\n  - after: \`${afterResult.resultJson}\``);
  }
}

const report = [
  "# Calculation Regression Check",
  "",
  `- Before cases: ${before.count}`,
  `- After cases: ${after.count}`,
  `- Differences: ${findings.length}`,
  "",
  "## Results",
  "",
  findings.length ? findings.join("\n") : "All fixed calculation fixtures match before and after outputs.",
  ""
].join("\n");

fs.writeFileSync(path.join(docsDir, "calculation-regression-check.md"), report);
console.log("Wrote docs/calculation-regression-check.md");

if (findings.length > 0) {
  process.exit(1);
}

function readJson(fileName) {
  const filePath = path.join(docsDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
