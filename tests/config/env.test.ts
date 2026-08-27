import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config/env.js";

describe("loadConfig", () => {
  it("loads defaults for local development", () => {
    const config = loadConfig({});

    expect(config).toMatchObject({
      host: "0.0.0.0",
      port: 3000,
      cacheDriver: "memory",
      cacheTtlSeconds: 1800,
      publicRateLimitMax: 120,
      publicRateLimitWindow: "1 minute",
      sourceRateLimitMs: 1000,
      ignoreRobotsTxt: false
    });
  });

  it("parses explicit environment values", () => {
    const config = loadConfig({
      HOST: "127.0.0.1",
      PORT: "4000",
      CACHE_DRIVER: "redis",
      REDIS_URL: "redis://cache:6379",
      CACHE_TTL_SECONDS: "900",
      PUBLIC_RATE_LIMIT_MAX: "10",
      PUBLIC_RATE_LIMIT_WINDOW: "30 seconds",
      SOURCE_RATE_LIMIT_MS: "250",
      SCRAPER_USER_AGENT: "test-agent",
      IGNORE_ROBOTS_TXT: "true"
    });

    expect(config).toEqual({
      host: "127.0.0.1",
      port: 4000,
      cacheDriver: "redis",
      redisUrl: "redis://cache:6379",
      cacheTtlSeconds: 900,
      publicRateLimitMax: 10,
      publicRateLimitWindow: "30 seconds",
      sourceRateLimitMs: 250,
      scraperUserAgent: "test-agent",
      ignoreRobotsTxt: true
    });
  });
});

