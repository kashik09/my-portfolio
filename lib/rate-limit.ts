import type { NextRequest } from 'next/server'

type RateLimitEntry = {
  count: number
  reset: number
}

export type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  reset: number
}

// Best-effort in-memory limiter; resets on deploy and per instance.
const store = new Map<string, RateLimitEntry>()

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  return request.ip ?? 'unknown'
}

export function getRateLimitKey(request: NextRequest, scope: string): string {
  return `${scope}:${getClientIp(request)}`
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.reset) {
    const reset = now + windowMs
    store.set(key, { count: 1, reset })
    return { allowed: true, limit, remaining: limit - 1, reset }
  }

  if (entry.count >= limit) {
    return { allowed: false, limit, remaining: 0, reset: entry.reset }
  }

  entry.count += 1
  return {
    allowed: true,
    limit,
    remaining: Math.max(limit - entry.count, 0),
    reset: entry.reset,
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const retryAfter = Math.max(Math.ceil((result.reset - Date.now()) / 1000), 0)

  return {
    'Retry-After': retryAfter.toString(),
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.reset / 1000).toString(),
  }
}
