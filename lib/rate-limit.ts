type RateLimitStore = Map<string, number[]>;

const defaultStore: RateLimitStore = new Map();

function pruneWindow(entries: number[], now: number, windowMs: number) {
  return entries.filter((timestamp) => now - timestamp < windowMs);
}

export function consumeRateLimit(
  store: RateLimitStore,
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  const current = pruneWindow(store.get(key) ?? [], now, windowMs);
  if (current.length >= limit) {
    const earliest = current[0] ?? now;
    return {
      allowed: false,
      retryAfterMs: Math.max(0, windowMs - (now - earliest)),
    };
  }

  current.push(now);
  store.set(key, current);
  return {
    allowed: true,
    retryAfterMs: 0,
  };
}

export function consumeDefaultRateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  return consumeRateLimit(defaultStore, key, limit, windowMs, now);
}

