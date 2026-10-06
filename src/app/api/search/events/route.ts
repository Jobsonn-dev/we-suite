// ============================================================
// WEBUOS Search API — Search event tracking (Mock/No-op)
// POST /api/search/events
// Body: { event_type, query, result_count?, clicked_position?, session_id? }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { VALID_EVENT_TYPES, sanitizeQuery } from "@/lib/search-utils";

export const dynamic = "force-dynamic";

interface EventRequestBody {
  event_type?: string;
  query?: string;
  result_count?: number;
  clicked_position?: number;
  session_id?: string;
}

export async function POST(req: NextRequest) {
  let body: EventRequestBody = {};
  try {
    body = (await req.json()) as EventRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const eventType = body.event_type;
  if (!eventType || !VALID_EVENT_TYPES.includes(eventType as (typeof VALID_EVENT_TYPES)[number])) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const query = sanitizeQuery(body.query ?? "");
  // In-memory telemetry log for developer insights
  if (process.env.NODE_ENV !== "production") {
    console.log(`[mock-analytics] search event: ${eventType} query="${query}"`);
  }

  return NextResponse.json({ success: true });
}
