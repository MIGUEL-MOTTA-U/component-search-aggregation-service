import type { CachePort } from "../ports/cache-port.js";
import type { ScraperPort } from "../ports/scraper-port.js";
import { filterComponents } from "../domain/filter-components.js";
import type { SearchFilters, SearchResult } from "../domain/component.js";

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

    const components = (
      await Promise.all(
        selectedScrapers.map((scraper) =>
          scraper.search({
            query: filters.query,
            category: filters.category
          })
        )
      )
    ).flat();

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

