// ============================================================
// WEBUOS Search API — Autocomplete suggestions
// GET /api/search/suggest?q=...
// Returns up to 10 mixed-type suggestions across companies, products,
// services, industries, technologies, locations + query expansions.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getMockSuggestions } from "@/data/mock-db";
import { sanitizeQuery } from "@/lib/search-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = sanitizeQuery(req.nextUrl.searchParams.get("q"));

  if (!q || q.length < 1) {
    return NextResponse.json({ query: q, suggestions: [] });
  }

  const suggestions = getMockSuggestions(q);

  return NextResponse.json(
    { query: q, suggestions },
    { headers: { "Cache-Control": "no-store" } },
  );
}
