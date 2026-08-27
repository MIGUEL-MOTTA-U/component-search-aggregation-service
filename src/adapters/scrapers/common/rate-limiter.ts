export class SourceRateLimiter {
  private lastRunAt = 0;

  constructor(private readonly minIntervalMs: number) {}

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRunAt;
    const waitMs = Math.max(0, this.minIntervalMs - elapsed);

    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    this.lastRunAt = Date.now();
  }
}

