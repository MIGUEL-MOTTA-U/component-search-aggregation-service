import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseProducts } from "../../src/adapters/scrapers/common/html-product-parser.js";
import { sourceSelectors } from "../../src/config/selectors.js";

const here = dirname(fileURLToPath(import.meta.url));

describe("parseProducts", () => {
  it("normalizes TrueCables fixture products", () => {
    const html = readFileSync(join(here, "../fixtures/truecables-search.html"), "utf8");
    const products = parseProducts(html, "truecables", sourceSelectors.truecables, "https://www.truecable.com/");

    expect(products).toMatchObject([
      {
        source: "truecables",
        name: "Cat6 Riser Ethernet Cable",
        price: 129.99,
        category: "cable",
        specs: { length: "1000 ft", jacket: "CMR" },
        url: "https://www.truecable.com/products/cat6-riser"
      }
    ]);
    expect(products[0]?.id).toMatch(/^truecables:/);
  });

  it("normalizes B&H fixture products", () => {
    const html = readFileSync(join(here, "../fixtures/bh-search.html"), "utf8");
    const products = parseProducts(html, "bh", sourceSelectors.bh, "https://www.bhphotovideo.com/");

    expect(products).toMatchObject([
      {
        source: "bh",
        name: "8-Port Gigabit Network Switch",
        price: 49.5,
        category: "switch",
        specs: { ports: "8", speed: "1GbE" },
        url: "https://www.bhphotovideo.com/c/product/123/network-switch.html"
      }
    ]);
    expect(products[0]?.id).toMatch(/^bh:/);
  });
});

