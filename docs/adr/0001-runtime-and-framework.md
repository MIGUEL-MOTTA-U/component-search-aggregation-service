# ADR 0001: Runtime and Framework

- Date: 2026-08-27
- Status: Accepted

## Context

The service performs concurrent I/O for HTTP requests, scraping, caching, and API responses.

## Decision

Use Node.js 22, TypeScript strict mode, and Fastify.

## Alternatives

- Python with FastAPI
- NestJS on Node.js

## Justification

Node.js provides native async I/O for scraping workloads. TypeScript strict mode reduces runtime shape errors. Fastify provides schema validation, OpenAPI integration, and low framework overhead while preserving a clean composition root.

