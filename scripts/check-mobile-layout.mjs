#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const docsDir = path.join(process.cwd(), "docs");
const args = parseArgs(process.argv.slice(2));
const baseUrl = stripTrailingSlash(args.base ?? "http://localhost:3000");
const chromePath = args.chrome ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = Number(args.port ?? 9333);

const viewports = [
  { width: 360, height: 900 },
  { width: 390, height: 900 },
  { width: 412, height: 915 }
];

const paths = [
  "/dsr-calculator",
  "/acquisition-tax-calculator",
  "/real-estate-brokerage-fee-calculator",
  "/rent-vs-jeonse-calculator",
  "/monthly-rent-conversion-calculator",
  "/housing-subscription-score-calculator",
  "/jeonse-loan-interest-calculator",
  "/electricity-bill-calculator",
  "/dividend-income-calculator"
];

fs.mkdirSync(docsDir, { recursive: true });

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(chromePath)) {
    throw new Error(`Chrome not found: ${chromePath}`);
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "jipcalc-mobile-chrome-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: "ignore" });

  const failures = [];
  const rows = [];

  try {
    await waitForChrome(port);
    for (const viewport of viewports) {
      for (const routePath of paths) {
        const result = await inspectPage({ routePath, viewport });
        rows.push(result);
        if (result.hasHorizontalScroll) failures.push(`${routePath} ${viewport.width}px: horizontal scroll`);
        if (result.clippedInputs.length > 0) failures.push(`${routePath} ${viewport.width}px: clipped inputs ${result.clippedInputs.join(", ")}`);
        if (result.smallButtons.length > 0) failures.push(`${routePath} ${viewport.width}px: small buttons ${result.smallButtons.join(", ")}`);
        if (!result.firstScreenOrderOk) failures.push(`${routePath} ${viewport.width}px: first-screen order is not H1, description, form, button`);
      }
    }
  } finally {
    chrome.kill("SIGTERM");
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // Chrome may hold cache files briefly after SIGTERM; the OS temp cleaner can remove them later.
    }
  }

  const report = renderReport({ generatedAt: new Date().toISOString(), baseUrl, rows, failures });
  fs.writeFileSync(path.join(docsDir, "mobile-layout-report.md"), report);
  console.log("Wrote docs/mobile-layout-report.md");

  if (failures.length > 0) {
    console.error(`Mobile layout check failed: ${failures.length} issue(s)`);
    process.exit(1);
  }
}

async function waitForChrome(debugPort) {
  const started = Date.now();
  while (Date.now() - started < 10_000) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return;
    } catch {
      await sleep(100);
    }
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

async function inspectPage({ routePath, viewport }) {
  const target = await createTarget("about:blank");
  const cdp = await CdpSession.connect(target.webSocketDebuggerUrl);
  try {
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: true
    });
    await cdp.send("Page.navigate", { url: `${baseUrl}${routePath}` });
    await waitForReadyState(cdp);
    await sleep(500);
    const evaluated = await cdp.send("Runtime.evaluate", {
      expression: `(${browserInspection.toString()})()`,
      returnByValue: true
    });
    return {
      path: routePath,
      viewport: viewport.width,
      ...evaluated.result.value
    };
  } finally {
    await cdp.close();
  }
}

async function createTarget(url) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome target: HTTP ${response.status}`);
  return response.json();
}

async function waitForReadyState(cdp) {
  const started = Date.now();
  while (Date.now() - started < 10_000) {
    const result = await cdp.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true
    });
    if (result.result.value === "complete") return;
    await sleep(100);
  }
  throw new Error("Page did not finish loading");
}

function browserInspection() {
  const viewportWidth = document.documentElement.clientWidth;
  const bodyScrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);

  function visible(element) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
  }

  function labelFor(element) {
    return element.getAttribute("aria-label") || element.textContent?.replace(/\s+/g, " ").trim().slice(0, 40) || element.tagName.toLowerCase();
  }

  const inputs = Array.from(document.querySelectorAll("input, select, textarea")).filter(visible);
  const buttons = Array.from(document.querySelectorAll("button")).filter(visible);
  const clippedInputs = inputs
    .filter((input) => {
      const rect = input.getBoundingClientRect();
      return rect.left < -1 || rect.right > viewportWidth + 1;
    })
    .map(labelFor);
  const smallButtons = buttons
    .filter((button) => {
      const rect = button.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    })
    .map(labelFor);

  const h1 = document.querySelector("h1");
  const description = h1?.parentElement?.querySelector("p");
  const form = document.querySelector("form");
  const submitButton = form?.querySelector("button[type='submit'], button");
  const firstScreenOrderOk = Boolean(h1 && description && form && submitButton) &&
    h1.getBoundingClientRect().top <= description.getBoundingClientRect().top &&
    description.getBoundingClientRect().bottom <= form.getBoundingClientRect().top &&
    form.getBoundingClientRect().top <= submitButton.getBoundingClientRect().top;

  return {
    hasHorizontalScroll: bodyScrollWidth > viewportWidth + 1,
    scrollWidth: bodyScrollWidth,
    clientWidth: viewportWidth,
    clippedInputs,
    smallButtons,
    firstScreenOrderOk
  };
}

class CdpSession {
  static connect(url) {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      const session = new CdpSession(socket);
      socket.addEventListener("open", () => resolve(session), { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
  }

  constructor(socket) {
    this.socket = socket;
    this.id = 0;
    this.pending = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.socket.close();
    return sleep(50);
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderReport({ generatedAt, baseUrl, rows, failures }) {
  const lines = [];
  lines.push("# Mobile Layout Report");
  lines.push("");
  lines.push(`- Generated at: ${generatedAt}`);
  lines.push(`- Fetch base: ${baseUrl}`);
  lines.push(`- Viewports: ${Array.from(new Set(rows.map((row) => `${row.viewport}px`))).join(", ")}`);
  lines.push(`- Checked combinations: ${rows.length}`);
  lines.push(`- Failures: ${failures.length}`);
  lines.push("");
  lines.push("## Results");
  lines.push("");
  lines.push("| Path | Width | Horizontal scroll | Scroll/client | Clipped inputs | Small buttons | First-screen order |");
  lines.push("| --- | ---: | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| ${row.path} | ${row.viewport} | ${row.hasHorizontalScroll ? "fail" : "pass"} | ${row.scrollWidth}/${row.clientWidth} | ${escapeTable(row.clippedInputs.join(", "))} | ${escapeTable(row.smallButtons.join(", "))} | ${row.firstScreenOrderOk ? "pass" : "fail"} |`);
  }
  lines.push("");
  lines.push("## Failures");
  lines.push("");
  lines.push(failures.length ? failures.map((item) => `- ${item}`).join("\n") : "No mobile layout failures were detected.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}
