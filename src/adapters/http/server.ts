import Fastify, { type FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { SearchComponents } from "../../application/search-components.js";
import { componentSources, type SearchFilters } from "../../domain/component.js";
import { errorHandler } from "./problem-details.js";

interface ServerOptions {
  searchComponents: SearchComponents;
  publicRateLimitMax: number;
  publicRateLimitWindow: string;
}

export async function buildServer(options: ServerOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });
  app.setErrorHandler(errorHandler);

  await app.register(rateLimit, {
    max: options.publicRateLimitMax,
    timeWindow: options.publicRateLimitWindow
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Component Search Aggregation Service",
        version: "0.1.0"
      }
    }
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });

  app.get(
    "/api/v1/components/search",
    {
      schema: {
        querystring: {
          type: "object",
          additionalProperties: false,
          properties: {
            query: { type: "string", minLength: 1, maxLength: 120 },
            source: { type: "string", enum: [...componentSources, "all"], default: "all" },
            category: { type: "string", minLength: 1, maxLength: 80 },
            minPrice: { type: "number", minimum: 0 },
            maxPrice: { type: "number", minimum: 0 },
            page: { type: "integer", minimum: 1, default: 1 },
            pageSize: { type: "integer", minimum: 1, maximum: 100, default: 20 }
          }
        },
        response: {
          200: {
            type: "object",
            required: ["data", "meta"],
            properties: {
              data: { type: "array", items: { type: "object", additionalProperties: true } },
              meta: {
                type: "object",
                required: ["page", "pageSize", "total"],
                properties: {
                  page: { type: "integer" },
                  pageSize: { type: "integer" },
                  total: { type: "integer" }
                }
              }
            }
          }
        }
      }
    },
    async (request) => {
      const query = request.query as Partial<SearchFilters>;
      return options.searchComponents.execute({
        query: query.query,
        source: query.source ?? "all",
        category: query.category,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 20
      });
    }
  );

  return app;
}

