import { describe, expect, it, vi } from "vitest";
import { SearchComponents } from "../../src/application/search-components.js";
import { MemoryCache } from "../../src/adapters/cache/memory-cache.js";
import type { ScraperPort } from "../../src/ports/scraper-port.js";

describe("SearchComponents", () => {
  it("aggregates selected scraper results and caches the response", async () => {
    const scraper: ScraperPort = {
      source: "truecables",
      search: vi.fn().mockResolvedValue([
        {
          id: "truecables:1",
          source: "truecables",
          name: "Cat6 Cable",
          price: 10,
          category: "cable",
          specs: {},
          url: "https://example.test/cat6"
        }
      ])
    };
    const useCase = new SearchComponents([scraper], new MemoryCache(), 60);

    const first = await useCase.execute({ query: "cat6", source: "all", page: 1, pageSize: 20 });
    const second = await useCase.execute({ query: "cat6", source: "all", page: 1, pageSize: 20 });

    expect(first).toEqual(second);
    expect(scraper.search).toHaveBeenCalledTimes(1);
  });

  it("returns results from successful scrapers when one scraper fails", async () => {
    const successScraper: ScraperPort = {
      source: "truecables",
      search: vi.fn().mockResolvedValue([
        {
          id: "truecables:1",
          source: "truecables",
          name: "Cat6 Cable",
          price: 10,
          category: "cable",
          specs: {},
          url: "https://example.test/cat6"
        }
      ])
    };
    const failingScraper: ScraperPort = {
      source: "bh",
      search: vi.fn().mockRejectedValue(new Error("Source bh returned HTTP 403"))
    };
    const useCase = new SearchComponents([successScraper, failingScraper], new MemoryCache(), 60);

    const result = await useCase.execute({ query: "cat6", source: "all", page: 1, pageSize: 20 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].source).toBe("truecables");
  });

  it("throws error when all selected scrapers fail", async () => {
    const failingScraper: ScraperPort = {
      source: "bh",
      search: vi.fn().mockRejectedValue(new Error("Source bh returned HTTP 403"))
    };
    const useCase = new SearchComponents([failingScraper], new MemoryCache(), 60);

    await expect(useCase.execute({ query: "cat6", source: "bh", page: 1, pageSize: 20 })).rejects.toThrow("Source bh returned HTTP 403");
  });
});

