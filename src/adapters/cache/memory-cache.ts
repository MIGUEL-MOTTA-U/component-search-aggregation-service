import type { CachePort } from "../../ports/cache-port.js";

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

export class MemoryCache implements CachePort {
  private readonly values = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.values.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.values.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.values.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}

