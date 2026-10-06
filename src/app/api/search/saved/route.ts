// ============================================================
// WEBUOS Search API — Saved searches / search history (In-Memory Mock)
// GET  /api/search/saved      → returns saved search history for the demo user
// POST /api/search/saved      → saves a search history entry for the demo user
// Body: { query }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
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

// In-memory store of saved searches seeded with realistic demo entries
let inMemorySavedSearches: SavedSearchItem[] = [
  { id: "saved-1", query: "CNC Machining Bengaluru", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "saved-2", query: "Enterprise SaaS ERP", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "saved-3", query: "Precision Sheet Metal Pune", created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "saved-4", query: "Industrial Automation Solutions", created_at: new Date(Date.now() - 259200000).toISOString() },
];

export async function GET() {
  const userId = await getDemoUserId();

  const response: SavedSearchListResponse = {
    user_id: userId,
    count: inMemorySavedSearches.length,
    saved: inMemorySavedSearches,
  };
  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}

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

  const newEntry: SavedSearchItem = {
    id: `saved-${Date.now()}`,
    query,
    created_at: new Date().toISOString(),
  };

  // Prepend so latest is first, cap to 50
  inMemorySavedSearches = [newEntry, ...inMemorySavedSearches.filter((s) => s.query !== query)].slice(0, 50);

  return NextResponse.json({
    success: true,
    id: newEntry.id,
    query: newEntry.query,
    created_at: newEntry.created_at,
  });
}
