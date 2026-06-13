interface RateLimitEntry {
  count: number
  expiresAt: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Lightweight in-memory rate limiter based on IP.
 * @param ip Client IP address
 * @param action Namespace/action identifier (e.g., 'upload', 'leads')
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 * @returns boolean True if allowed, false if limit exceeded
 */
export function checkRateLimit(
  ip: string,
  action: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const key = `${action}:${ip}`
  const now = Date.now()

  const entry = store.get(key)

  if (!entry || now > entry.expiresAt) {
    store.set(key, { count: 1, expiresAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count += 1
  return true
}

// Memory cleanup interval (every 15 mins)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of Array.from(store.entries())) {
      if (now > entry.expiresAt) {
        store.delete(key)
      }
    }
  }, 15 * 60 * 1000)
}
