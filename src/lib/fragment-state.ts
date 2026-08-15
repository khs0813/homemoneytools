const SAFE_FRAGMENT_KEY_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;
const SAFE_FRAGMENT_VALUE_PATTERN = /^[a-zA-Z0-9_.-]{1,128}$/;

export function buildFragmentPath(path: string, values: Record<string, string | number | boolean | undefined | null>): string {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (!SAFE_FRAGMENT_KEY_PATTERN.test(key)) return;
    if (value === undefined || value === null || value === "") return;

    const stringValue = String(value);
    if (!SAFE_FRAGMENT_VALUE_PATTERN.test(stringValue)) return;
    params.set(key, stringValue);
  });

  const query = params.toString();
  return query ? `${path}#${query}` : path;
}

export function buildFragmentUrl(path: string, values: Record<string, string | number | boolean | undefined | null>): string {
  if (typeof window === "undefined") return buildFragmentPath(path, values);
  return new URL(buildFragmentPath(path, values), window.location.origin).toString();
}

