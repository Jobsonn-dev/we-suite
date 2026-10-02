// ============================================================
// WEBUOS Search API — Saved searches / search history
// GET  /api/search/saved      → returns saved search history for the demo user
// POST /api/search/saved      → saves a search history entry for the demo user
// Body: { query }
//
// Since auth isn't wired up yet, we resolve the demo user via the
// `demo@webuos.com` email (creating the user record if missing) and use
// their id for all SearchHistory rows.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDemoUserId, sanitizeQuery } from "@/lib/search-utils";

export const dynamic = "force-dynamic";

interface SavedSearchItem {
  id: string;
  query: string;
  created_at: string;
}

interface SavedSearchListResponse {
  user_id: string;
  count: number;
  saved: SavedSearchItem[];
}

interface SaveRequestBody {
  query?: string;
  session_id?: string;
}

// ------------------------------------------------------------
// GET — list the demo user's saved searches (most-recent first)
// ------------------------------------------------------------

export async function GET() {
  const userId = await getDemoUserId();
  const rows = await db.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, query: true, createdAt: true },
  });

  const response: SavedSearchListResponse = {
    user_id: userId,
    count: rows.length,
    saved: rows.map((r) => ({
      id: r.id,
      query: r.query,
      created_at: r.createdAt.toISOString(),
    })),
  };
  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}

// ------------------------------------------------------------
// POST — save a search history entry for the demo user
// ------------------------------------------------------------

export async function POST(req: NextRequest) {
  let body: SaveRequestBody = {};
  try {
    body = (await req.json()) as SaveRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const query = sanitizeQuery(body.query ?? "");
  if (!query) {
    return NextResponse.json(
      { success: false, error: "Query is required" },
      { status: 400 },
    );
  }

  const userId = await getDemoUserId();
  const sessionId = body.session_id ? String(body.session_id).slice(0, 200) : null;

  const created = await db.searchHistory.create({
    data: { query, userId, sessionId },
    select: { id: true, query: true, createdAt: true },
  });

  return NextResponse.json({
    success: true,
    id: created.id,
    query: created.query,
    created_at: created.createdAt.toISOString(),
  });
}
