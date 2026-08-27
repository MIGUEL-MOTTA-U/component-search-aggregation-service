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
});

