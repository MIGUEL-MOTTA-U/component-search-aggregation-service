import { describe, expect, it, vi } from "vitest";
import { SourceRateLimiter } from "../../src/adapters/scrapers/common/rate-limiter.js";

describe("SourceRateLimiter", () => {
  it("waits between source requests", async () => {
    vi.useFakeTimers();
    const limiter = new SourceRateLimiter(1000);

    await limiter.wait();
    const waitPromise = limiter.wait();
    const settled = vi.fn();
    void waitPromise.then(settled);

    await vi.advanceTimersByTimeAsync(999);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await waitPromise;
    expect(settled).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

