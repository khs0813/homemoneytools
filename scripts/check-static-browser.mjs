#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, "docs");
const args = parseArgs(process.argv.slice(2));
const baseUrl = stripTrailingSlash(String(args.base ?? "http://localhost:3000"));
const chromePath = String(args.chrome ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");

const viewports = [
  { name: "desktop", width: 1366, height: 900, isMobile: false },
  { name: "mobile", width: 390, height: 900, isMobile: true }
];

const smokePaths = [
  "/",
  "/calculators",
  "/guides",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/jeonse-loan-interest-calculator",
  "/rent-vs-jeonse-calculator",
  "/dsr-calculator",
  "/acquisition-tax-calculator",
  "/real-estate-brokerage-fee-calculator",
  "/monthly-rent-conversion-calculator",
  "/housing-subscription-score-calculator"
];

const validationCases = [
  {
    path: "/jeonse-loan-interest-calculator",
    field: "대출금액",
    value: "60,000",
    expected: "대출금액은 전세보증금을 초과할 수 없습니다."
  },
  {
    path: "/rent-vs-jeonse-calculator",
    field: "전세대출금액",
    value: "60,000",
    expected: "전세대출금액은 전세보증금을 초과할 수 없습니다."
  }
];

fs.mkdirSync(docsDir, { recursive: true });

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const calculatorPaths = collectPathValues(path.join(projectRoot, "src", "config", "calculators.ts"));
  const failures = [];
  const rows = [];
  const launchOptions = {
    headless: true
  };
  if (fs.existsSync(chromePath)) {
    launchOptions.executablePath = chromePath;
  }

  const browser = await chromium.launch(launchOptions);
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        deviceScaleFactor: viewport.isMobile ? 2 : 1,
        hasTouch: viewport.isMobile
      });

      try {
        for (const routePath of smokePaths) {
          const result = await inspectRoute(context, routePath, viewport);
          rows.push(result);
          failures.push(...result.failures);
        }

        for (const routePath of calculatorPaths) {
          const result = await inspectCalculator(context, routePath, viewport);
          rows.push(result);
          failures.push(...result.failures);
        }
      } finally {
        await context.close();
      }
    }

    const validationContext = await browser.newContext({
      viewport: { width: 390, height: 900 },
      isMobile: true,
      deviceScaleFactor: 2,
      hasTouch: true
    });
    try {
      for (const validationCase of validationCases) {
        const result = await inspectValidationCase(validationContext, validationCase);
        rows.push(result);
        failures.push(...result.failures);
      }
    } finally {
      await validationContext.close();
    }
  } finally {
    await browser.close();
  }

  const report = renderReport({ generatedAt: new Date().toISOString(), baseUrl, rows, failures });
  fs.writeFileSync(path.join(docsDir, "static-browser-check.md"), report);
  console.log("Wrote docs/static-browser-check.md");

  if (failures.length > 0) {
    console.error(`Static browser check failed: ${failures.length} issue(s)`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

async function inspectRoute(context, routePath, viewport) {
  return withPage(context, `route:${routePath}:${viewport.name}`, async (page, failures) => {
    const response = await page.goto(`${baseUrl}${routePath}`, { waitUntil: "domcontentloaded" });
    if (!response || response.status() !== 200) {
      failures.push(`${routePath} ${viewport.name}: expected 200, got ${response?.status() ?? "no response"}`);
    }
    await waitForSettledPage(page);
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 5000 }).catch((error) => {
      failures.push(`${routePath} ${viewport.name}: h1 not visible (${error.message})`);
    });

    const reloadResponse = await page.reload({ waitUntil: "domcontentloaded" });
    if (!reloadResponse || reloadResponse.status() !== 200) {
      failures.push(`${routePath} ${viewport.name}: reload expected 200, got ${reloadResponse?.status() ?? "no response"}`);
    }

    return {
      kind: "route",
      path: routePath,
      viewport: viewport.name,
      failures
    };
  });
}

async function inspectCalculator(context, routePath, viewport) {
  return withPage(context, `calculator:${routePath}:${viewport.name}`, async (page, failures) => {
    const response = await page.goto(`${baseUrl}${routePath}`, { waitUntil: "domcontentloaded" });
    if (!response || response.status() !== 200) {
      failures.push(`${routePath} ${viewport.name}: expected 200, got ${response?.status() ?? "no response"}`);
    }
    await waitForSettledPage(page);

    const form = page.locator("form").first();
    await form.waitFor({ state: "visible", timeout: 5000 }).catch((error) => {
      failures.push(`${routePath} ${viewport.name}: form not visible (${error.message})`);
    });

    await refillVisibleInputs(form);
    await clickSubmit(form);
    await page.getByText("계산 결과").first().waitFor({ state: "visible", timeout: 5000 }).catch((error) => {
      failures.push(`${routePath} ${viewport.name}: result not visible after submit (${error.message})`);
    });

    const resultText = await page.locator('section[aria-live="polite"]').first().innerText().catch(() => "");
    if (!resultText.includes("계산 결과")) {
      failures.push(`${routePath} ${viewport.name}: result card text missing`);
    }

    await changeFirstVisibleInput(form);
    await clickSubmit(form);
    await page.getByText("계산 결과").first().waitFor({ state: "visible", timeout: 5000 }).catch((error) => {
      failures.push(`${routePath} ${viewport.name}: result not visible after recalculation (${error.message})`);
    });

    return {
      kind: "calculator",
      path: routePath,
      viewport: viewport.name,
      failures
    };
  });
}

async function inspectValidationCase(context, validationCase) {
  return withPage(context, `validation:${validationCase.path}`, async (page, failures) => {
    await page.goto(`${baseUrl}${validationCase.path}`, { waitUntil: "domcontentloaded" });
    await waitForSettledPage(page);
    const form = page.locator("form").first();
    await form.waitFor({ state: "visible", timeout: 5000 });
    await page.getByRole("textbox", { name: validationCase.field, exact: true }).fill(validationCase.value);
    await clickSubmit(form);
    await page.getByText(validationCase.expected).first().waitFor({ state: "visible", timeout: 5000 }).catch((error) => {
      failures.push(`${validationCase.path}: expected validation message not visible (${error.message})`);
    });

    return {
      kind: "validation",
      path: validationCase.path,
      viewport: "mobile",
      failures
    };
  });
}

async function withPage(context, label, callback) {
  const page = await context.newPage();
  const failures = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (isIgnoredConsoleError(text)) return;
    failures.push(`${label}: console error: ${text}`);
  });
  page.on("pageerror", (error) => {
    failures.push(`${label}: page error: ${error.message}`);
  });

  try {
    return await callback(page, failures);
  } finally {
    await page.close();
  }
}

async function refillVisibleInputs(form) {
  const inputs = form.locator("input");
  const count = await inputs.count();
  for (let index = 0; index < count; index += 1) {
    const input = inputs.nth(index);
    if (!await isEditableVisible(input)) continue;
    const current = await input.inputValue();
    const type = await input.getAttribute("type") ?? "text";
    const label = await input.getAttribute("aria-label") ?? "";
    const value = current || fallbackInputValue(label, type);
    await input.fill(value);
  }
}

async function changeFirstVisibleInput(form) {
  const inputs = form.locator("input");
  const count = await inputs.count();
  for (let index = 0; index < count; index += 1) {
    const input = inputs.nth(index);
    if (!await isEditableVisible(input)) continue;
    const current = await input.inputValue();
    const type = await input.getAttribute("type") ?? "text";
    await input.fill(nextInputValue(current, type));
    return;
  }
}

async function clickSubmit(form) {
  const submit = form.locator('button[type="submit"]').first();
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
}

async function isEditableVisible(locator) {
  return locator.isVisible().catch(() => false)
    .then(async (visible) => visible && await locator.isEnabled().catch(() => false));
}

function fallbackInputValue(label, type) {
  if (type === "date") {
    if (label.includes("생년")) return "1990-01-01";
    if (label.includes("공고")) return "2026-07-01";
    return "2020-01-01";
  }
  if (label.includes("금리") || label.includes("요율") || label.includes("율")) return "4";
  if (label.includes("기간") || label.includes("년")) return "2";
  if (label.includes("월세")) return "120";
  if (label.includes("보증금") || label.includes("금액") || label.includes("가격")) return "50,000";
  return "100";
}

function nextInputValue(current, type) {
  if (type === "date") return current === "1990-01-01" ? "1991-01-01" : "1990-01-01";
  const normalized = current.replace(/,/g, "");
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) return "1";
  if (normalized.includes(".")) return String(Number((numeric + 0.5).toFixed(2)));
  return String(Math.max(1, Math.round(numeric * 1.05)));
}

async function waitForSettledPage(page) {
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(100);
}

function isIgnoredConsoleError(text) {
  return /favicon\.ico/i.test(text);
}

function collectPathValues(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const values = [];
  const regex = /path:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    values.push(match[1]);
  }
  return Array.from(new Set(values));
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

function renderReport({ generatedAt, baseUrl: reportBaseUrl, rows, failures }) {
  const rowsMarkdown = rows.map((row) => `| ${row.kind} | ${row.path} | ${row.viewport} | ${row.failures.length ? row.failures.join("<br>") : "ok"} |`).join("\n");
  return `# Static Browser Check

- Generated at: ${generatedAt}
- Base URL: ${reportBaseUrl}
- Checks: ${rows.length}
- Failures: ${failures.length}

## Results

| Kind | Path | Viewport | Result |
| --- | --- | --- | --- |
${rowsMarkdown}
`;
}
