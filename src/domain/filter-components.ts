import type { Component, SearchFilters, SearchResult } from "./component.js";

export function filterComponents(components: Component[], filters: SearchFilters): SearchResult {
  const query = filters.query?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();

  const filtered = components.filter((component) => {
    if (filters.source && filters.source !== "all" && component.source !== filters.source) {
      return false;
    }

    if (category && component.category?.toLowerCase() !== category) {
      return false;
    }

    if (filters.minPrice !== undefined && (component.price === null || component.price < filters.minPrice)) {
      return false;
    }

    if (filters.maxPrice !== undefined && (component.price === null || component.price > filters.maxPrice)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      component.name,
      component.category ?? "",
      ...Object.entries(component.specs).map(([key, value]) => `${key} ${value}`)
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const start = (filters.page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  return {
    data: filtered.slice(start, end),
    meta: {
      page: filters.page,
      pageSize: filters.pageSize,
      total: filtered.length
    }
  };
}

