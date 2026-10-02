# Task ID: 3 — Search Backend Subagent

## Task
Build the WEBUOS search engine backend APIs (Next.js 16 App Router + Prisma/SQLite).

## Work Log
1. Read `/home/z/my-project/worklog.md` to understand prior state — foundation,
   design system, Prisma schema + seed data already in place (117 companies,
   215 products, 198 services, 55 industries, 20 technologies, 39 locations,
   15 synonyms).
2. Inspected DB via Prisma client to confirm schema field names and seeded
   values (ecosystem ids, businessType variations, location names, synonyms).
3. Created `/home/z/my-project/src/lib/search-utils.ts` — shared utilities:
   - Types for all result shapes (CompanyResult, ProductResult, …)
   - `sanitizeQuery`, `tokenize`, `expandTokensWithSynonyms`
   - `normalizeBusinessType` — collapses raw types like "Contract Manufacturer"
     into the 8 canonical WEBUOS types for facets.
   - `computeRelevance` — hybrid scoring: exact-match + prefix + per-token
     matches + verification boost + popularity boost + freshness boost.
   - `interpretQuery` — detects entity_type, business_type, industry (with
     light stemming + alternate-spelling map), location (with city aliases
     like Bangalore→Bengaluru), and keywords (stop-word + location-name
     stripping).
   - `buildRelatedSearches` — 5 suggestions derived from interpreted query
     + top results.
   - `buildFacets` — ecosystem / business_type / country / city / verified
     aggregations from matched companies.
   - `getDemoUserId` — caches demo user lookup.
   - `sortResults` — relevance / az / most_complete / newest / nearest /
     recently_updated.
4. Created `/home/z/my-project/src/lib/search/server.ts` — `runSearch(params)`
   function that holds the actual hybrid-search algorithm (companies +
   products + services + industries + technologies + locations). Both the
   `/api/search` route AND the `/search` page (built by another agent) call
   this function so API and SSR results stay in sync.
5. Created `/home/z/my-project/src/app/api/search/route.ts` — thin wrapper
   that validates query params, calls `runSearch`, returns JSON.
6. Created `/home/z/my-project/src/app/api/search/suggest/route.ts` —
   autocomplete returning 10 mixed-type suggestions (companies + products +
   services + industries + technologies + locations + query-suffix
   expansions).
7. Created `/home/z/my-project/src/app/api/search/interpret/route.ts` —
   exposes query interpretation (intent, entity_type, industry, location,
   business_type, keywords).
8. Created `/home/z/my-project/src/app/api/search/events/route.ts` — POST
   handler that validates event_type against the 13-event whitelist and
   inserts into SearchEvent.
9. Created `/home/z/my-project/src/app/api/businesses/[slug]/route.ts` —
   full company profile (40 fields) + products + services + 5 related
   companies (same category, excluding current, ordered by popularity).
   Non-blocking view-counter increment.
10. Created `/home/z/my-project/src/app/api/search/saved/route.ts` — GET
    (list demo user's saved searches) + POST (save a new search query to
    SearchHistory).
11. Iteratively tested all routes via curl against the dev server:
    - `/api/search?q=ai+companies+in+bangalore` → 200, 42 results, correct
      interpretation (industry=AI & Machine Learning, location=Bengaluru…)
    - `/api/search?q=steel` → 200, 3 results (structural steel products)
    - `/api/search/suggest?q=ai` → 200, 10 mixed suggestions
    - `/api/search/interpret?q=automobile+component+manufacturers+in+Bangalore`
      → 200, correct (entity=Company, industry=Automotive Components,
      location=Bengaluru, business_type=Manufacturer)
    - POST `/api/search/events` → 200 `{success: true}`
    - POST `/api/search/events` (invalid event_type) → 400 with whitelist
    - GET `/api/search/saved` → 200, returns user_id + saved list
    - POST `/api/search/saved` → 200, persists search history
    - `/api/businesses/<slug>` → 200, full company profile + related
    - `/api/businesses/<bad-slug>` → 404
12. Tuned industry matching — switched from "first match wins" to scored
    selection so "AI" in the query correctly resolves to "AI & Machine
    Learning" (not "Business Intelligence"). Added light stemming
    (ies→y, ing→'', es→'', s→'') and an alternate-spelling map
    (automobile→automotive, vehicle→automotive, machine→machinery).
13. Fixed synonym expansion to split on both commas AND spaces so multi-word
    synonyms like "Manufacturing Company" yield two separate tokens
    ("manufacturing", "company") that match industry-name words.
14. Added entity_type fallback: when a business-type keyword
    (manufacturers, suppliers, …) is detected, entity_type defaults to
    "Company" even without an explicit "companies" / "firms" keyword.

## Stage Summary
- 6 new API route handlers + 2 shared lib modules added.
- All routes export `dynamic = "force-dynamic"` and use `NextRequest` /
  `NextResponse` per spec.
- Hybrid search returns ranked results across 6 entity types with facets,
  related searches, interpreted query, and pagination.
- `runSearch` is shared between `/api/search` route and the `/search` SSR
  page built by the parallel frontend agent.
- All curl sample tests from the spec pass with HTTP 200.

## Files created
- `src/lib/search-utils.ts` (~990 lines, types + utilities)
- `src/lib/search/server.ts` (~470 lines, shared `runSearch` function)
- `src/app/api/search/route.ts`
- `src/app/api/search/suggest/route.ts`
- `src/app/api/search/interpret/route.ts`
- `src/app/api/search/events/route.ts`
- `src/app/api/search/saved/route.ts`
- `src/app/api/businesses/[slug]/route.ts`

## Sample curl tests (all 200 OK)
- `curl -s "http://localhost:3000/api/search?q=ai+companies+in+bangalore"`
- `curl -s "http://localhost:3000/api/search?q=steel"`
- `curl -s "http://localhost:3000/api/search/suggest?q=ai"`
- `curl -s "http://localhost:3000/api/search/interpret?q=automobile+component+manufacturers+in+Bangalore"`
- `curl -s "http://localhost:3000/api/businesses/aircraft-manufacturing-systems-london-33"`
- `curl -s -X POST "http://localhost:3000/api/search/events" -H "Content-Type: application/json" -d '{"event_type":"search_submitted","query":"test"}'`
- `curl -s "http://localhost:3000/api/search/saved"`
