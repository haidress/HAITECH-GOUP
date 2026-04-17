type RateLimitResult = {
  ok: boolean;
  retryAfterSec?: number;
};

async function checkViaUpstashRedis(key: string, windowSec: number, limit: number): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const endpoint = `${url}/pipeline`;
  const commands = [
    ["INCR", key],
    ["EXPIRE", key, String(windowSec)],
    ["GET", key]
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands)
  });
  if (!response.ok) return null;
  const data = (await response.json()) as Array<{ result?: string }>;
  const count = Number(data[2]?.result ?? "0");
  if (count > limit) return { ok: false, retryAfterSec: windowSec };
  return { ok: true };
}

export async function checkDistributedRateLimit({
  key,
  windowSec,
  limit
}: {
  key: string;
  windowSec: number;
  limit: number;
}): Promise<RateLimitResult | null> {
  try {
    return await checkViaUpstashRedis(key, windowSec, limit);
  } catch {
    return null;
  }
}
