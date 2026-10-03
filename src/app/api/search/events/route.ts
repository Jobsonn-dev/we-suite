// ============================================================
// WEBUOS Search API — Search event tracking
// POST /api/search/events
// Body: { event_type, query, result_count?, clicked_position?, session_id? }
// Inserts a row into the SearchEvent table.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

  // Numeric validation — coerce to safe ints or null
  const resultCount =
    typeof body.result_count === "number" && Number.isFinite(body.result_count)
      ? Math.max(0, Math.floor(body.result_count))
      : null;
  const clickedPosition =
    typeof body.clicked_position === "number" &&
    Number.isFinite(body.clicked_position)
      ? Math.max(0, Math.floor(body.clicked_position))
      : null;

  const sessionId = body.session_id
    ? String(body.session_id).slice(0, 200)
    : null;

  try {
    await db.searchEvent.create({
      data: {
        eventType,
        query,
        resultCount,
        clickedPosition,
        sessionId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[search/events] insert failed", err);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 },
    );
  }
}
