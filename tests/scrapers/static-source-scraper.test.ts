import { describe, expect, it, vi } from "vitest";
import { StaticSourceScraper } from "../../src/adapters/scrapers/static-source-scraper.js";
import { SourceRateLimiter } from "../../src/adapters/scrapers/common/rate-limiter.js";
import { sourceSelectors } from "../../src/config/selectors.js";
import type { RobotsClient } from "../../src/adapters/scrapers/common/robots.js";

describe("StaticSourceScraper", () => {
  it("checks robots, rate limits, fetches HTML, and parses normalized products", async () => {
    const robotsClient: RobotsClient = { canFetch: vi.fn().mockResolvedValue(true) };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(`
        <article data-component-product>
          <a data-component-url href="/item">Item</a>
          <h2 data-component-name>Cat6 Patch Cable</h2>
          <span data-component-price>$12.00</span>
          <span data-component-category>cable</span>
        </article>
      `)
    });
    vi.stubGlobal("fetch", fetchMock);

    const scraper = new StaticSourceScraper(
      "truecables",
      "https://example.test/",
      sourceSelectors.truecables,
      "agent",
      new SourceRateLimiter(0),
      robotsClient
    );

    const result = await scraper.search({ query: "cat6", category: "cable" });

    expect(robotsClient.canFetch).toHaveBeenCalledWith("https://example.test/search?q=cat6&category=cable", "agent");
    expect(fetchMock).toHaveBeenCalledWith("https://example.test/search?q=cat6&category=cable", {
      headers: {
        "user-agent": "agent",
        accept: "text/html"
      }
    });
    expect(result[0]).toMatchObject({
      source: "truecables",
      name: "Cat6 Patch Cable",
      price: 12,
      category: "cable",
      url: "https://example.test/item"
    });

    vi.unstubAllGlobals();
  });

  it("fails before fetching when robots.txt blocks the URL", async () => {
    const robotsClient: RobotsClient = { canFetch: vi.fn().mockResolvedValue(false) };
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const scraper = new StaticSourceScraper(
      "bh",
      "https://example.test/",
      sourceSelectors.bh,
      "agent",
      new SourceRateLimiter(0),
      robotsClient
    );

    await expect(scraper.search({})).rejects.toThrow("Scraping blocked by robots.txt");
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("fails explicitly when the source returns an HTTP error", async () => {
    const robotsClient: RobotsClient = { canFetch: vi.fn().mockResolvedValue(true) };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    const scraper = new StaticSourceScraper(
      "bh",
      "https://example.test/",
      sourceSelectors.bh,
      "agent",
      new SourceRateLimiter(0),
      robotsClient
    );

    await expect(scraper.search({})).rejects.toThrow("Source bh returned HTTP 503");

    vi.unstubAllGlobals();
  });
});

