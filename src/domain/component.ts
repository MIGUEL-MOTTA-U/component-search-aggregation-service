export const componentSources = ["truecables", "bh"] as const;

export type ComponentSource = (typeof componentSources)[number];

export interface Component {
  id: string;
  source: ComponentSource;
  name: string;
  price: number | null;
  category: string | null;
  specs: Record<string, string>;
  url: string;
}

export interface SearchFilters {
  query?: string;
  source?: ComponentSource | "all";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
}

export interface SearchResult {
  data: Component[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export function makeComponentId(source: ComponentSource, url: string): string {
  const normalizedUrl = url.trim().toLowerCase();
  const encoded = Buffer.from(normalizedUrl).toString("base64url");
  return `${source}:${encoded}`;
}

