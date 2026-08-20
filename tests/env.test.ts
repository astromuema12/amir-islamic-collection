import { describe, it, expect, beforeEach, vi } from "vitest";

describe("env validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  describe("server schema", () => {
    it("validates required DATABASE_URL", async () => {
      delete process.env.DATABASE_URL;
      delete process.env.AUTH_SECRET;

      const { getServerEnv } = await import("@/lib/env");
      expect(() => getServerEnv()).toThrow();
    });

    it("accepts valid server env", async () => {
      process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test";
      process.env.AUTH_SECRET = "test-secret";
      process.env.PAYSTACK_SECRET_KEY = "sk_test_123";
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

      const { getServerEnv } = await import("@/lib/env");
      const env = getServerEnv();
      expect(env.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/test");
      expect(env.AUTH_SECRET).toBe("test-secret");
    });

    it("rejects invalid DATABASE_URL", async () => {
      process.env.DATABASE_URL = "not-a-url";
      process.env.AUTH_SECRET = "test-secret";
      process.env.PAYSTACK_SECRET_KEY = "sk_test_123";
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

      const { getServerEnv } = await import("@/lib/env");
      expect(() => getServerEnv()).toThrow();
    });
  });

  describe("client schema", () => {
    it("validates NEXT_PUBLIC_APP_URL", async () => {
      process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test";
      process.env.AUTH_SECRET = "test-secret";
      process.env.PAYSTACK_SECRET_KEY = "sk_test_123";
      delete process.env.NEXT_PUBLIC_APP_URL;

      const { getClientEnv } = await import("@/lib/env");
      expect(() => getClientEnv()).toThrow();
    });

    it("accepts valid client env", async () => {
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

      const { getClientEnv } = await import("@/lib/env");
      const env = getClientEnv();
      expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    });
  });

  describe("caching", () => {
    it("caches validated env", async () => {
      process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test";
      process.env.AUTH_SECRET = "test-secret";
      process.env.PAYSTACK_SECRET_KEY = "sk_test_123";
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

      const { getServerEnv } = await import("@/lib/env");
      const env1 = getServerEnv();
      const env2 = getServerEnv();
      expect(env1).toBe(env2);
    });
  });
});
