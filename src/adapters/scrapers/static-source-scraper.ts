import type { Component, ComponentSource } from "../../domain/component.js";
import type { ScrapeRequest, ScraperPort } from "../../ports/scraper-port.js";
import type { SourceSelectors } from "../../config/selectors.js";
import { parseProducts } from "./common/html-product-parser.js";
import { SourceRateLimiter } from "./common/rate-limiter.js";
import type { RobotsClient } from "./common/robots.js";

export class StaticSourceScraper implements ScraperPort {
  constructor(
    readonly source: ComponentSource,
    private readonly baseUrl: string,
    private readonly selectors: SourceSelectors,
    private readonly userAgent: string,
    private readonly rateLimiter: SourceRateLimiter,
    private readonly robotsClient: RobotsClient
  ) {}

  async search(request: ScrapeRequest): Promise<Component[]> {
    const url = this.searchUrl(request);
    const allowed = await this.robotsClient.canFetch(url, this.userAgent);

    if (!allowed) {
      throw new Error(`Scraping blocked by robots.txt for source ${this.source}`);
    }

    await this.rateLimiter.wait();
    const response = await fetch(url, {
      headers: {
        "user-agent": this.userAgent,
        accept: "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`Source ${this.source} returned HTTP ${response.status}`);
    }

    return parseProducts(await response.text(), this.source, this.selectors, this.baseUrl);
  }

  private searchUrl(request: ScrapeRequest): string {
    const url = new URL("/search", this.baseUrl);
    if (request.query) {
      url.searchParams.set("q", request.query);
    }
    if (request.category) {
      url.searchParams.set("category", request.category);
    }
    return url.toString();
  }
}

