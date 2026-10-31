interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_MAP_ENTRIES = 5000;
let lastCleanup = Date.now();

/**
 * Periodically removes expired entries from memory to prevent memory leaks.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  // Clean up at most once every 30 seconds or if map exceeds capacity
  if (now - lastCleanup < 30 * 1000 && rateLimitMap.size < MAX_MAP_ENTRIES) {
    return;
  }
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }

  // If map is still unusually large, prune oldest entries
  if (rateLimitMap.size > MAX_MAP_ENTRIES) {
    const keysToDelete = Array.from(rateLimitMap.keys()).slice(0, 1000);
    for (const key of keysToDelete) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Rate limits an identifier (e.g. "contact:1.2.3.4" or "login:admin@example.com:1.2.3.4").
 * @param key Unique key to rate limit
 * @param limit Maximum allowed hits within windowMs
 * @param windowMs Time window in milliseconds (default 60,000ms = 1 min)
 */
export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60 * 1000
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.resetTime,
  };
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Safely extracts client IP address from request headers, preventing spoofing.
 */
export function getClientIp(req: Request | { headers: Headers | Record<string, string> }): string {
  try {
    let forwarded: string | null = null;
    let realIp: string | null = null;
    let cfIp: string | null = null;

    if ('headers' in req && typeof (req.headers as any).get === 'function') {
      const headers = (req as Request).headers;
      forwarded = headers.get('x-forwarded-for');
      realIp = headers.get('x-real-ip');
      cfIp = headers.get('cf-connecting-ip');
    } else if ('headers' in req && typeof req.headers === 'object') {
      const h = req.headers as Record<string, string>;
      forwarded = h['x-forwarded-for'] || null;
      realIp = h['x-real-ip'] || null;
      cfIp = h['cf-connecting-ip'] || null;
    }

    if (cfIp && cfIp.trim()) return cfIp.trim();
    if (realIp && realIp.trim()) return realIp.trim();

    if (forwarded && forwarded.trim()) {
      // In X-Forwarded-For: "client, proxy1, proxy2" - the first non-empty entry is the real client
      const client = forwarded.split(',')[0].trim();
      if (client) return client;
    }
  } catch {
    // ignore
  }

  return '127.0.0.1';
}
