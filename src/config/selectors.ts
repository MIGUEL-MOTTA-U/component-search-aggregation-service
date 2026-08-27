export interface SourceSelectors {
  product: string;
  name: string;
  price: string;
  category: string;
  url: string;
  spec: string;
}

export const sourceSelectors = {
  truecables: {
    product: "[data-component-product]",
    name: "[data-component-name]",
    price: "[data-component-price]",
    category: "[data-component-category]",
    url: "[data-component-url]",
    spec: "[data-component-spec]"
  },
  bh: {
    product: "[data-component-product]",
    name: "[data-component-name]",
    price: "[data-component-price]",
    category: "[data-component-category]",
    url: "[data-component-url]",
    spec: "[data-component-spec]"
  }
} satisfies Record<string, SourceSelectors>;

