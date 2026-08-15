export type RecentCalculation = {
  calculator_type: string;
  page_path: string;
  summary: string;
  saved_at: string;
};

const STORAGE_KEY = "jipcalc:recent-calculations:v1";
const MAX_ITEMS = 5;
const RETENTION_DAYS = 30;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

function storageAvailable(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const key = "jipcalc:storage-check";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecent(item: RecentCalculation, now = Date.now()) {
  const savedAt = Date.parse(item.saved_at);
  return Number.isFinite(savedAt) && now - savedAt <= RETENTION_MS;
}

export function loadRecentCalculations(): RecentCalculation[] {
  const storage = storageAvailable();
  if (!storage) return [];

  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "[]") as RecentCalculation[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.calculator_type === "string" && typeof item.page_path === "string" && typeof item.summary === "string")
      .filter((item) => isRecent(item))
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function saveRecentCalculation(item: Omit<RecentCalculation, "saved_at">) {
  const storage = storageAvailable();
  if (!storage) return;

  const next: RecentCalculation = {
    calculator_type: item.calculator_type,
    page_path: item.page_path,
    summary: item.summary.slice(0, 120),
    saved_at: new Date().toISOString()
  };
  const existing = loadRecentCalculations().filter((record) => !(record.calculator_type === next.calculator_type && record.page_path === next.page_path));
  storage.setItem(STORAGE_KEY, JSON.stringify([next, ...existing].slice(0, MAX_ITEMS)));
}

export function clearRecentCalculations() {
  const storage = storageAvailable();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}

