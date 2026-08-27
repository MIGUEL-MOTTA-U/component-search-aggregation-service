# Component Search Aggregation Service

REST API for retrieving, normalizing, caching, and serving component search results from TrueCables and B&H.

The service is intentionally not a catalog owner, checkout system, pricing history store, inventory tracker, or user-account backend. Cached results are TTL-based only.

## Stack

- Node.js 22 and TypeScript strict mode
- Fastify REST API with JSON Schema validation and OpenAPI generation
- Hexagonal structure: domain, application, ports, adapters, config
- Hybrid scraper adapters: static HTTP parsing first, browser fallback reserved behind the scraper port
- In-memory cache by default, Redis available through Docker Compose
- Vitest with coverage thresholds at 80%

## Setup

```bash
pnpm install
cp .env.example .env
pnpm run typecheck
pnpm test
```

On this Windows shell, `pnpm run typecheck` and `pnpm run build` may hang while the direct TypeScript binary works. Use these equivalent local checks if needed:

```bash
node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit --pretty false
node node_modules/typescript/bin/tsc -p tsconfig.json --pretty false
```

Run the API:

```bash
pnpm run dev
```

Run Redis for local integration work:

```bash
docker compose up -d redis
```

Set `CACHE_DRIVER=redis` and `REDIS_URL=redis://localhost:6379` to use Redis.

## API

`GET /api/v1/components/search`

Query parameters:

- `query`: search text
- `source`: `truecables`, `bh`, or `all`
- `category`: optional category filter
- `minPrice`, `maxPrice`: optional numeric price filters
- `page`, `pageSize`: pagination controls

Errors use RFC 9457 Problem Details.

## Compliance Notes

Production scraping is blocked on stakeholder confirmation that result caching and scraping are acceptable under each source site's Terms of Service. The adapters enforce robots checks and per-source rate limiting, but legal approval is still a separate requirement.
