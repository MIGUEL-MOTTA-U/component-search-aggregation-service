import { describe, expect, it, vi } from "vitest";
import { MemoryCache } from "../../src/adapters/cache/memory-cache.js";

describe("MemoryCache", () => {
  it("returns cached values before TTL expiry", async () => {
    const cache = new MemoryCache();

    await cache.set("key", { ok: true }, 60);

    await expect(cache.get("key")).resolves.toEqual({ ok: true });
  });

  it("evicts values after TTL expiry", async () => {
    vi.useFakeTimers();
    const cache = new MemoryCache();

    await cache.set("key", "value", 1);
    vi.advanceTimersByTime(1001);

    await expect(cache.get("key")).resolves.toBeNull();
    vi.useRealTimers();
  });
});

