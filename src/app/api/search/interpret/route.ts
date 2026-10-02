// ============================================================
// WEBUOS Search API — Query interpretation
// GET /api/search/interpret?q=...
// Returns the interpreted query: intent, entity_type, industry,
// category, business_type, country/state/city, keywords
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { interpretQuery, sanitizeQuery } from "@/lib/search-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = sanitizeQuery(req.nextUrl.searchParams.get("q"));
  const interpreted = await interpretQuery(q);

  return NextResponse.json(
    { query: q, interpreted },
    { headers: { "Cache-Control": "no-store" } },
  );
}
