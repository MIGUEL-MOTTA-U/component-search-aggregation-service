import { describe, expect, it, vi } from "vitest";
import { SearchComponents } from "../../src/application/search-components.js";
import { MemoryCache } from "../../src/adapters/cache/memory-cache.js";
import { buildServer } from "../../src/adapters/http/server.js";
import type { ScraperPort } from "../../src/ports/scraper-port.js";

describe("component search endpoint", () => {
  it("returns normalized search results", async () => {
    const scraper: ScraperPort = {
      source: "bh",
      search: vi.fn().mockResolvedValue([
        {
          id: "bh:1",
          source: "bh",
          name: "8-Port Gigabit Network Switch",
          price: 49.5,
          category: "switch",
          specs: { ports: "8" },
          url: "https://www.bhphotovideo.com/c/product/123/network-switch.html"
        }
      ])
    };
    const server = await buildServer({
      searchComponents: new SearchComponents([scraper], new MemoryCache(), 60),
      publicRateLimitMax: 100,
      publicRateLimitWindow: "1 minute"
    });

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/components/search?query=gigabit&source=bh&page=1&pageSize=20"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      data: [{ id: "bh:1", source: "bh", name: "8-Port Gigabit Network Switch" }],
      meta: { page: 1, pageSize: 20, total: 1 }
    });

    await server.close();
  });

  it("returns Problem Details for invalid query params", async () => {
    const server = await buildServer({
      searchComponents: new SearchComponents([], new MemoryCache(), 60),
      publicRateLimitMax: 100,
      publicRateLimitWindow: "1 minute"
    });

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/components/search?page=0"
    });

    expect(response.statusCode).toBe(400);
    expect(response.headers["content-type"]).toContain("application/problem+json");
    expect(response.json()).toMatchObject({
      type: "about:blank",
      title: "Bad Request",
      status: 400
    });

    await server.close();
  });
});

