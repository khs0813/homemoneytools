const DEFAULT_SITE_URL = "https://home-money-calculator.onrender.com";
const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export function sanitizeSiteUrl(value: string | undefined, fallback = DEFAULT_SITE_URL): string {
  const trimmed = value?.trim();
  const candidate = trimmed && trimmed.length <= 2048 ? trimmed : fallback;

  try {
    const url = new URL(candidate);
    const isLocalHttp = url.protocol === "http:" && LOCALHOST_HOSTS.has(url.hostname);
    const isPublicHttps = url.protocol === "https:";

    if (!isLocalHttp && !isPublicHttps) {
      return fallback;
    }

    url.username = "";
    url.password = "";
    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const fallbackSiteUrl = DEFAULT_SITE_URL;
