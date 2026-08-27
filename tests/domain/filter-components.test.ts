import { describe, expect, it } from "vitest";
import type { Component } from "../../src/domain/component.js";
import { filterComponents } from "../../src/domain/filter-components.js";

const components: Component[] = [
  {
    id: "truecables:1",
    source: "truecables",
    name: "Cat6 Riser Ethernet Cable",
    price: 129.99,
    category: "cable",
    specs: { jacket: "CMR", length: "1000 ft" },
    url: "https://www.truecable.com/products/cat6-riser"
  },
  {
    id: "bh:1",
    source: "bh",
    name: "8-Port Gigabit Network Switch",
    price: 49.5,
    category: "switch",
    specs: { ports: "8", speed: "1GbE" },
    url: "https://www.bhphotovideo.com/c/product/123/network-switch.html"
  }
];

describe("filterComponents", () => {
  it("filters by query, source, category, and price range", () => {
    const result = filterComponents(components, {
      query: "gigabit",
      source: "bh",
      category: "switch",
      minPrice: 40,
      maxPrice: 60,
      page: 1,
      pageSize: 10
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe("8-Port Gigabit Network Switch");
    expect(result.meta.total).toBe(1);
  });

  it("paginates deterministically", () => {
    const result = filterComponents(components, {
      source: "all",
      page: 2,
      pageSize: 1
    });

    expect(result.data).toEqual([components[1]]);
    expect(result.meta).toEqual({ page: 2, pageSize: 1, total: 2 });
  });
});

