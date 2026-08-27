export interface AppConfig {
  host: string;
  port: number;
  cacheDriver: "memory" | "redis";
  redisUrl: string;
  cacheTtlSeconds: number;
  publicRateLimitMax: number;
  publicRateLimitWindow: string;
  sourceRateLimitMs: number;
  scraperUserAgent: string;
  ignoreRobotsTxt: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  if (env === process.env && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile();
    } catch {
      // Ignore if .env file is missing
    }
  }

  return {
    host: env.HOST ?? "0.0.0.0",
    port: parseInteger(env.PORT, 3000),
    cacheDriver: env.CACHE_DRIVER === "redis" ? "redis" : "memory",
    redisUrl: env.REDIS_URL ?? "redis://localhost:6379",
    cacheTtlSeconds: parseInteger(env.CACHE_TTL_SECONDS, 1800),
    publicRateLimitMax: parseInteger(env.PUBLIC_RATE_LIMIT_MAX, 120),
    publicRateLimitWindow: env.PUBLIC_RATE_LIMIT_WINDOW ?? "1 minute",
    sourceRateLimitMs: parseInteger(env.SOURCE_RATE_LIMIT_MS, 1000),
    scraperUserAgent: env.SCRAPER_USER_AGENT ?? "ComponentSearchAggregationService/0.1 (+contact@example.com)",
    ignoreRobotsTxt: env.IGNORE_ROBOTS_TXT === "true"
  };
}

function parseInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

