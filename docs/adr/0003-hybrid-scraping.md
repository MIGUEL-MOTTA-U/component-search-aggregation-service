# ADR 0003: Hybrid Scraping Strategy

- Date: 2026-08-27
- Status: Accepted

## Context

Source site rendering and bot protection can change without notice. Selectors are volatile implementation details.

## Decision

Expose one scraper port and implement source-specific adapters. Each adapter isolates selectors and uses static HTTP parsing by default. Browser automation is reserved for cases proven empirically necessary.

## Alternatives

- Playwright-only scraping
- HTTP-only scraping

## Justification

Static HTTP parsing is lighter when available. Browser automation is substantially more expensive and should be used only when a source requires it. Isolating selectors keeps DOM-change blast radius inside source adapters.

