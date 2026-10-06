// ============================================================
// WEBUOS Search API — Main hybrid search endpoint
// GET /api/search?q=...&type=...&ecosystem=...&...
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { runSearch, type SearchParams } from "@/lib/search/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const params: SearchParams = {
    q: url.searchParams.get("q") ?? "",
    type: url.searchParams.get("type") ?? undefined,
    ecosystem: url.searchParams.get("ecosystem") ?? undefined,
    sector: url.searchParams.get("sector") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    country: url.searchParams.get("country") ?? undefined,
    state: url.searchParams.get("state") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    business_type: url.searchParams.get("business_type") ?? undefined,
    business_size: url.searchParams.get("business_size") ?? undefined,
    verified: url.searchParams.get("verified") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    page: url.searchParams.get("page") ? parseInt(url.searchParams.get("page")!, 10) : undefined,
    limit: url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!, 10) : undefined,
  };

  const response = await runSearch(params);
  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
