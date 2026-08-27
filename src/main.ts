import { SearchComponents } from "./application/search-components.js";
import { MemoryCache } from "./adapters/cache/memory-cache.js";
import { RedisCache } from "./adapters/cache/redis-cache.js";
import { createBhScraper } from "./adapters/scrapers/bh/bh-scraper.js";
import { HttpRobotsClient, PermissiveRobotsClient } from "./adapters/scrapers/common/robots.js";
import { createTrueCablesScraper } from "./adapters/scrapers/truecables/truecables-scraper.js";
import { buildServer } from "./adapters/http/server.js";
import { loadConfig } from "./config/env.js";
import type { CachePort } from "./ports/cache-port.js";

const config = loadConfig();
const cache: CachePort = config.cacheDriver === "redis" ? new RedisCache(config.redisUrl) : new MemoryCache();
const robotsClient = config.ignoreRobotsTxt ? new PermissiveRobotsClient() : new HttpRobotsClient();
const scrapers = [
  createTrueCablesScraper(config.scraperUserAgent, config.sourceRateLimitMs, robotsClient),
  createBhScraper(config.scraperUserAgent, config.sourceRateLimitMs, robotsClient)
];
const searchComponents = new SearchComponents(scrapers, cache, config.cacheTtlSeconds);
const app = await buildServer({
  searchComponents,
  publicRateLimitMax: config.publicRateLimitMax,
  publicRateLimitWindow: config.publicRateLimitWindow
});

const shutdown = async (): Promise<void> => {
  await app.close();
  await cache.close?.();
};

process.on("SIGINT", () => {
  void shutdown().then(() => process.exit(0));
});
process.on("SIGTERM", () => {
  void shutdown().then(() => process.exit(0));
});

await app.listen({ host: config.host, port: config.port });
