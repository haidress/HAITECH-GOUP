import { checkDistributedRateLimit } from "@/lib/rate-limit-distributed";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(request: Request, key: string, limit: number, windowMs: number) {
  const ip = getClientIp(request);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const current = buckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  buckets.set(bucketKey, current);
  return { ok: true, remaining: limit - current.count };
}

export async function checkRateLimitSmart(request: Request, key: string, limit: number, windowMs: number) {
  const ip = getClientIp(request);
  const distributed = await checkDistributedRateLimit({
    key: `${key}:${ip}`,
    windowSec: Math.max(1, Math.ceil(windowMs / 1000)),
    limit
  });
  if (distributed) return distributed;
  return checkRateLimit(request, key, limit, windowMs);
}
