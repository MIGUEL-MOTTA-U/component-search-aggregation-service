import type { CachePort } from "../ports/cache-port.js";
import type { ScraperPort } from "../ports/scraper-port.js";
import { filterComponents } from "../domain/filter-components.js";
import type { Component, SearchFilters, SearchResult } from "../domain/component.js";

export class SearchComponents {
  constructor(
    private readonly scrapers: ScraperPort[],
    private readonly cache: CachePort,
    private readonly ttlSeconds: number
  ) {}

  async execute(filters: SearchFilters): Promise<SearchResult> {
    const source = filters.source ?? "all";
    const selectedScrapers = source === "all" ? this.scrapers : this.scrapers.filter((scraper) => scraper.source === source);
    const cacheKey = this.cacheKey(filters);
    const cached = await this.cache.get<SearchResult>(cacheKey);

    if (cached) {
      return cached;
    }

    const scraperResults = await Promise.allSettled(
      selectedScrapers.map((scraper) =>
        scraper.search({
          query: filters.query,
          category: filters.category
        })
      )
    );

    const fulfilled = scraperResults.filter(
      (res): res is PromiseFulfilledResult<Component[]> => res.status === "fulfilled"
    );

    if (fulfilled.length === 0 && selectedScrapers.length > 0) {
      const rejected = scraperResults.find(
        (res): res is PromiseRejectedResult => res.status === "rejected"
      );
      if (rejected) {
        throw rejected.reason;
      }
    }

    const components = fulfilled.flatMap((res) => res.value);

    const result = filterComponents(components, filters);
    await this.cache.set(cacheKey, result, this.ttlSeconds);
    return result;
  }

  private cacheKey(filters: SearchFilters): string {
    return `components:${JSON.stringify({
      query: filters.query ?? "",
      source: filters.source ?? "all",
      category: filters.category ?? "",
      minPrice: filters.minPrice ?? null,
      maxPrice: filters.maxPrice ?? null,
      page: filters.page,
      pageSize: filters.pageSize
    })}`;
  }
}

