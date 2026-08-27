import { describe, expect, it, vi } from "vitest";
import { HttpRobotsClient } from "../../src/adapters/scrapers/common/robots.js";

describe("HttpRobotsClient", () => {
  it("honors robots exclusions for the configured user agent", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("User-agent: *\nDisallow: /blocked")
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpRobotsClient();

    await expect(client.canFetch("https://example.test/open", "agent")).resolves.toBe(true);
    await expect(client.canFetch("https://example.test/blocked/item", "agent")).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });
});

