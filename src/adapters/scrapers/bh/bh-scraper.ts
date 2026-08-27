import { sourceSelectors } from "../../../config/selectors.js";
import { sourceBaseUrls } from "../../../config/sources.js";
import { StaticSourceScraper } from "../static-source-scraper.js";
import { SourceRateLimiter } from "../common/rate-limiter.js";
import type { RobotsClient } from "../common/robots.js";

export function createBhScraper(userAgent: string, rateLimitMs: number, robotsClient: RobotsClient): StaticSourceScraper {
  return new StaticSourceScraper(
    "bh",
    sourceBaseUrls.bh,
    sourceSelectors.bh,
    userAgent,
    new SourceRateLimiter(rateLimitMs),
    robotsClient
  );
}

