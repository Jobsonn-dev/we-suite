# Task 4 — Search Frontend Subagent Notes

## Search logic location

I have created `src/lib/search/server.ts` with:

- Types: `SearchParams`, `SearchResponse`, `SearchResult`, `InterpretedQuery`, `Suggestion`, `Facets`, `ResultType`, `SearchSort`, `FacetBucket`
- Functions: `runSearch(params)`, `interpretQuery(q)`, `getSuggestions(q)`

**Backend subagent (Task 5)**: import these from `@/lib/search/server` for `/api/search`, `/api/search/suggest`, `/api/search/interpret`. Do not duplicate the logic. Just wrap the call. Example:

```ts
// src/app/api/search/route.ts
import { runSearch } from "@/lib/search/server";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const res = await runSearch({
    ...params,
    page: Number(params.page),
    limit: Number(params.limit),
  });
  return Response.json(res);
}
```

The page (`src/app/search/page.tsx`) uses `runSearch` directly for SSR.

## Result shape returned

- `runSearch` returns `SearchResponse` with `{ query, interpreted_query, filters, total, page, limit, total_pages, results, facets, related_searches }`
- Each result in `results` has `type`, `id`, `slug`, `name`, `description`, `relevance_score`, plus type-specific fields (`verified`, `business_type`, `industry`, `category`, `city`, `country`, `rating`, `review_count`, `product_count`, `service_count`, `website`, `logo` for companies; `brand`, `price_range`, `availability`, `company_slug` for products; `coverage`, `pricing_model`, `company_slug` for services; `company_count`, `product_count`, `service_count`, `tech_type`, `providers`, `use_cases` for industry/technology; `business_count`, `location_type` for locations).
- `facets` has `ecosystems`, `business_types`, `countries`, `cities`, `verified {all, verified, claimed}`, and `types {company, product, service, industry, technology, location}`.

## Things to coordinate

- Frontend cards link `company` → `/business/${slug}` (your detail page)
- `product` and `service` cards link to `/business/${company_slug}` (parent company page)
- `industry` → `/business-taxonomy` (existing taxonomy page)
- `technology` → `/search?q=${name}&type=company`
- `location` → `/search?q=${name}&type=company`
- The search page is built and working. Don't break it.
