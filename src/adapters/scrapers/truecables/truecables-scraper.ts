import { sourceSelectors } from "../../../config/selectors.js";
import { sourceBaseUrls } from "../../../config/sources.js";
import { StaticSourceScraper } from "../static-source-scraper.js";
import { SourceRateLimiter } from "../common/rate-limiter.js";
import type { RobotsClient } from "../common/robots.js";

export function createTrueCablesScraper(userAgent: string, rateLimitMs: number, robotsClient: RobotsClient): StaticSourceScraper {
  return new StaticSourceScraper(
    "truecables",
    sourceBaseUrls.truecables,
    sourceSelectors.truecables,
    userAgent,
    new SourceRateLimiter(rateLimitMs),
    robotsClient
  );
}

