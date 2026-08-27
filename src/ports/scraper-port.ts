import type { Component, ComponentSource } from "../domain/component.js";

export interface ScrapeRequest {
  query?: string;
  category?: string;
}

export interface ScraperPort {
  readonly source: ComponentSource;
  search(request: ScrapeRequest): Promise<Component[]>;
}

