#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const docsDir = path.join(process.cwd(), "docs");
const args = parseArgs(process.argv.slice(2));
const baseUrl = stripTrailingSlash(args.base ?? "http://localhost:3000");
const chromePath = args.chrome ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = Number(args.port ?? 9444);

const targets = [
  "/",
  "/dsr-calculator",
  "/rent-vs-jeonse-calculator",
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

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "jipcalc-perf-chrome-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: "ignore" });

  const rows = [];
  const failures = [];

  try {
    await waitForChrome(port);
    for (const target of targets) {
      const row = await measurePage(target);
      rows.push(row);
      if (row.lcpMs > 2500) failures.push(`${target}: LCP ${row.lcpMs}ms exceeds 2500ms`);
      if (row.syntheticInpMs > 200) failures.push(`${target}: synthetic INP ${row.syntheticInpMs}ms exceeds 200ms`);
      if (row.cls > 0.1) failures.push(`${target}: CLS ${row.cls} exceeds 0.1`);
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
  fs.writeFileSync(path.join(docsDir, "performance-report.md"), report);
  console.log("Wrote docs/performance-report.md");

  if (failures.length > 0) {
    console.error(`Performance check failed: ${failures.length} issue(s)`);
    process.exit(1);
  }
}

async function measurePage(routePath) {
  const target = await createTarget("about:blank");
  const cdp = await CdpSession.connect(target.webSocketDebuggerUrl);
  try {
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 900,
      deviceScaleFactor: 1,
      mobile: true
    });
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        window.__jipcalcPerf = { lcp: 0, cls: 0, maxEventDuration: 0 };
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) window.__jipcalcPerf.lcp = entry.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch {}
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__jipcalcPerf.cls += entry.value;
          }).observe({ type: "layout-shift", buffered: true });
        } catch {}
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) window.__jipcalcPerf.maxEventDuration = Math.max(window.__jipcalcPerf.maxEventDuration, entry.duration || 0);
          }).observe({ type: "event", buffered: true, durationThreshold: 16 });
        } catch {}
      `
    });
    await cdp.send("Page.navigate", { url: `${baseUrl}${routePath}` });
    await waitForReadyState(cdp);
    await sleep(1500);
    const loadMetrics = await readMetrics(cdp);
    await cdp.send("Runtime.evaluate", {
      expression: "document.querySelector('button[type=submit], button')?.click()",
      returnByValue: true
    });
    await sleep(500);
    const interactionMetrics = await readMetrics(cdp);
    return {
      path: routePath,
      ...loadMetrics,
      syntheticInpMs: interactionMetrics.syntheticInpMs
    };
  } finally {
    await cdp.close();
  }
}

async function readMetrics(cdp) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const metrics = window.__jipcalcPerf || {};
      return {
        domContentLoadedMs: Math.round(nav?.domContentLoadedEventEnd || 0),
        loadMs: Math.round(nav?.loadEventEnd || 0),
        lcpMs: Math.round(metrics.lcp || 0),
        cls: Number((metrics.cls || 0).toFixed(4)),
        syntheticInpMs: Math.round(metrics.maxEventDuration || 0)
      };
    })()`,
    returnByValue: true
  });
  return result.result.value;
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
  lines.push("# Performance Report");
  lines.push("");
  lines.push(`- Generated at: ${generatedAt}`);
  lines.push(`- Fetch base: ${baseUrl}`);
  lines.push("- Browser: Chrome Headless, 390px mobile viewport");
  lines.push("- Note: INP is approximated from synthetic click event timing in local Chrome. Lighthouse or CrUX should be used for production user-experience confirmation.");
  lines.push(`- Failures: ${failures.length}`);
  lines.push("");
  lines.push("## Metrics");
  lines.push("");
  lines.push("| Path | DCL ms | Load ms | LCP ms | Synthetic INP ms | CLS |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  for (const row of rows) {
    lines.push(`| ${row.path} | ${row.domContentLoadedMs} | ${row.loadMs} | ${row.lcpMs} | ${row.syntheticInpMs} | ${row.cls} |`);
  }
  lines.push("");
  lines.push("## Failures");
  lines.push("");
  lines.push(failures.length ? failures.map((item) => `- ${item}`).join("\n") : "No local performance threshold failures were detected.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}
