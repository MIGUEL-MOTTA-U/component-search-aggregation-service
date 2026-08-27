import { createClient, type RedisClientType } from "redis";
import type { CachePort } from "../../ports/cache-port.js";

export class RedisCache implements CachePort {
  private readonly client: RedisClientType;
  private connected = false;

  constructor(url: string) {
    this.client = createClient({ url });
  }

  async get<T>(key: string): Promise<T | null> {
    await this.connect();
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.connect();
    await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  }

  async close(): Promise<void> {
    if (this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }

  private async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }
}

