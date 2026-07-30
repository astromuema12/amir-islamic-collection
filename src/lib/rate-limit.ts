import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.includes("placeholder") || token.includes("placeholder")) {
    return null;
  }
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const redis = createRedis();

function msToDuration(ms: number): `${number} s` | `${number} m` | `${number} h` | `${number} d` {
  if (ms < 60_000) return `${Math.ceil(ms / 1000)} s`;
  if (ms < 3_600_000) return `${Math.ceil(ms / 60_000)} m`;
  if (ms < 86_400_000) return `${Math.ceil(ms / 3_600_000)} h`;
  return `${Math.ceil(ms / 86_400_000)} d`;
}

const limiterCache = new Map<string, Ratelimit>();

function getLimiter(prefix: string, limit: number, windowMs: number): Ratelimit {
  if (!redis) {
    return noopLimiter;
  }
  const cacheKey = `${prefix}:${limit}:${windowMs}`;
  let instance = limiterCache.get(cacheKey);
  if (!instance) {
    instance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, msToDuration(windowMs)),
      prefix: `rl:${prefix}`,
      ephemeralCache: new Map(),
    });
    limiterCache.set(cacheKey, instance);
  }
  return instance;
}

const noopLimiter = {
  limit: async () => ({ success: true, limit: Infinity, remaining: Infinity, reset: Date.now() }),
} as unknown as Ratelimit;

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const limiter = getLimiter("default", limit, windowMs);
  const result = await limiter.limit(key);
  return {
    success: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}

export const apiLimiter = {
  async limit(key: string): Promise<RateLimitResult> {
    const limiter = getLimiter("api", 30, 60_000);
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining, resetAt: result.reset };
  },
};

export const authLimiter = {
  async limit(key: string): Promise<RateLimitResult> {
    const limiter = getLimiter("auth", 5, 60_000);
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining, resetAt: result.reset };
  },
};

export const checkoutLimiter = {
  async limit(key: string): Promise<RateLimitResult> {
    const limiter = getLimiter("checkout", 10, 60_000);
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining, resetAt: result.reset };
  },
};
