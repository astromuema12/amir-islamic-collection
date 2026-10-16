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

// Fail open: if Redis is unreachable or misconfigured, allow the request rather
// than turning a rate-limit outage into a hard failure for the whole app.
async function safeLimit(limiter: Ratelimit, key: string): Promise<RateLimitResult> {
  try {
    const result = await limiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  } catch (error) {
    console.error(
      "[rate-limit] Redis unavailable — allowing request:",
      error instanceof Error ? error.message : error,
    );
    return { success: true, remaining: Infinity, resetAt: Date.now() };
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const limiter = getLimiter("default", limit, windowMs);
  return safeLimit(limiter, key);
}

export const apiLimiter = {
  async limit(key: string): Promise<RateLimitResult> {
    return safeLimit(getLimiter("api", 30, 60_000), key);
  },
};

export const authLimiter = {
  async limit(key: string): Promise<RateLimitResult> {
    return safeLimit(getLimiter("auth", 5, 60_000), key);
  },
};

export const checkoutLimiter = {
  async limit(key: string): Promise<RateLimitResult> {
    return safeLimit(getLimiter("checkout", 10, 60_000), key);
  },
};
