import { describe, expect, it } from "vitest";
import { createBhScraper } from "../../src/adapters/scrapers/bh/bh-scraper.js";
import { createTrueCablesScraper } from "../../src/adapters/scrapers/truecables/truecables-scraper.js";
import type { RobotsClient } from "../../src/adapters/scrapers/common/robots.js";

const robotsClient: RobotsClient = {
  async canFetch() {
    return true;
  }
};

describe("source scraper factories", () => {
  it("creates source-specific scraper adapters", () => {
    expect(createTrueCablesScraper("agent", 0, robotsClient).source).toBe("truecables");
    expect(createBhScraper("agent", 0, robotsClient).source).toBe("bh");
  });
});

