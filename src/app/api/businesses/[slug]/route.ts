// ============================================================
// WEBUOS Business Profile API
// GET /api/businesses/[slug] — full company profile + products + services
// + 5 related companies in the same category
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getMockBusinessProfile } from "@/data/mock-db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const data = getMockBusinessProfile(slug);

  if (!data) {
    return NextResponse.json(
      { error: "Business not found", slug },
      { status: 404 },
    );
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
