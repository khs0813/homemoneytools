#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const staticRedirects = new Map([
  ["/severance-pay-calculator", "https://www.moneycalculator.co.kr/severance-pay-calculator"],
  ["/guides/acquisition-tax", "/guides/acquisition-tax-checklist"],
  ["/guides/brokerage-fee", "/guides/brokerage-fee-negotiation"],
  ["/guides/dsr", "/guides/what-dsr-40-means"],
  ["/guides/jeonse-loan-interest", "/guides/jeonse-loan-interest-mistakes"],
  ["/guides/monthly-rent-conversion", "/guides/monthly-rent-conversion-basics"],
  ["/guides/rent-vs-jeonse", "/guides/rent-vs-jeonse-decision-guide"],
  ["/guides/subscription-score", "/guides/subscription-score-interpretation"]
]);

export const staticSecurityHeaders = [
  ["X-DNS-Prefetch-Control", "off"],
  ["X-Frame-Options", "DENY"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-XSS-Protection", "0"],
  ["X-Download-Options", "noopen"],
  ["X-Permitted-Cross-Domain-Policies", "none"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
  ["Origin-Agent-Cluster", "?1"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"],
  ["Content-Security-Policy", "upgrade-insecure-requests"],
  [
    "Content-Security-Policy-Report-Only",
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-src https:"
  ]
];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"]
]);

export function createStaticOutServer({ dir = path.join(process.cwd(), "out") } = {}) {
  const root = path.resolve(dir);

  return http.createServer((request, response) => {
    for (const [name, value] of staticSecurityHeaders) {
      response.setHeader(name, value);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }

    let pathname;
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : "Bad request");
      return;
    }

    const redirectTarget = staticRedirects.get(pathname);
    if (redirectTarget) {
      response.writeHead(301, { Location: redirectTarget });
      response.end();
      return;
    }

    const filePath = resolveExistingFile(root, pathname);
    if (filePath) {
      sendFile({ filePath, method: request.method, response, statusCode: 200 });
      return;
    }

    const notFoundPath = safeJoin(root, "/404.html");
    if (notFoundPath && fs.existsSync(notFoundPath)) {
      sendFile({ filePath: notFoundPath, method: request.method, response, statusCode: 404 });
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : "Not found");
  });
}

function resolveExistingFile(root, pathname) {
  const candidates = pathname === "/"
    ? ["/index.html"]
    : [pathname, `${pathname}.html`, `${pathname}/index.html`];

  for (const candidate of candidates) {
    const filePath = safeJoin(root, candidate);
    if (!filePath) continue;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  return null;
}

function safeJoin(root, pathname) {
  const normalizedPath = path.posix.normalize(pathname.startsWith("/") ? pathname : `/${pathname}`);
  const filePath = path.resolve(root, `.${normalizedPath}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) return null;
  return filePath;
}

function sendFile({ filePath, method, response, statusCode }) {
  const extension = path.extname(filePath);
  const contentType = contentTypes.get(extension) ?? "application/octet-stream";
  const stat = fs.statSync(filePath);

  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": stat.size
  });

  if (method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
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

const isMain = path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url);

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const dir = path.resolve(String(args.dir ?? "out"));
  const port = Number(args.port ?? process.env.PORT ?? 3000);
  const host = String(args.host ?? "127.0.0.1");
  const server = createStaticOutServer({ dir });

  server.listen(port, host, () => {
    console.log(`Serving ${dir} at http://${host}:${port}`);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
    });
  }
}
