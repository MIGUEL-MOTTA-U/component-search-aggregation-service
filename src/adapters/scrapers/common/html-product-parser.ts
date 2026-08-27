import * as cheerio from "cheerio";
import type { Component, ComponentSource } from "../../../domain/component.js";
import { makeComponentId } from "../../../domain/component.js";
import type { SourceSelectors } from "../../../config/selectors.js";

export function parseProducts(html: string, source: ComponentSource, selectors: SourceSelectors, baseUrl: string): Component[] {
  const $ = cheerio.load(html);

  return $(selectors.product)
    .toArray()
    .map((element) => {
      const product = $(element);
      const relativeUrl = product.find(selectors.url).attr("href") ?? "";
      const url = new URL(relativeUrl, baseUrl).toString();
      const specs: Record<string, string> = {};

      product.find(selectors.spec).each((_, specElement) => {
        const key = $(specElement).attr("data-key")?.trim();
        const value = $(specElement).text().trim();
        if (key && value) {
          specs[key] = value;
        }
      });

      return {
        id: makeComponentId(source, url),
        source,
        name: product.find(selectors.name).text().trim(),
        price: parsePrice(product.find(selectors.price).text()),
        category: product.find(selectors.category).text().trim() || null,
        specs,
        url
      };
    })
    .filter((component) => component.name.length > 0 && component.url.length > 0);
}

export function parsePrice(text: string): number | null {
  const normalized = text.replace(/[^0-9.]/g, "");
  if (!normalized) {
    return null;
  }

  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

