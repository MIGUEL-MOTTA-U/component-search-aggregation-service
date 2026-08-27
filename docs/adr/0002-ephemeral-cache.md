# ADR 0002: Ephemeral Cache Only

- Date: 2026-08-27
- Status: Accepted

## Context

The service aggregates data owned by TrueCables and B&H. Persisting those catalogs would duplicate the source of truth and create staleness risk.

## Decision

Do not add a persistent database for core functionality. Use TTL-based cache only: in-memory for MVP and Redis for local or deployed environments.

## Alternatives

- PostgreSQL catalog persistence
- MongoDB document persistence
- No cache

## Justification

The service remains stateless with respect to definitive catalog data. TTL caching reduces outbound load and supports ethical scraping behavior without turning the service into a catalog owner.

