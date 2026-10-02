// ============================================================
// WEBUOS Search API — Autocomplete suggestions
// GET /api/search/suggest?q=...
// Returns up to 10 mixed-type suggestions across companies, products,
// services, industries, technologies, locations + "query" expansions.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sanitizeQuery } from "@/lib/search-utils";

export const dynamic = "force-dynamic";

interface Suggestion {
  label: string;
  type: "query" | "company" | "product" | "service" | "industry" | "technology" | "location";
  slug?: string;
  description?: string;
}

// Common business-suffix expansions — appended to the user's input to
// generate "query" type suggestions.
const SUFFIXES = [
  "Manufacturers",
  "Suppliers",
  "Companies",
  "Services",
  "Products",
  "Distributors",
  "Industry",
];

const MAX_SUGGESTIONS = 10;
// Limit per entity-type so we have a balanced mix (not 9 companies + 1 product)
const PER_ENTITY_LIMIT = 3;
// Max query-type suggestions — these are placeholders that let the user
// expand their search. We only want a few of them mixed with real entities.
const MAX_QUERY_SUGGESTIONS = 3;

export async function GET(req: NextRequest) {
  const q = sanitizeQuery(req.nextUrl.searchParams.get("q"));

  if (!q || q.length < 1) {
    return NextResponse.json({ query: q, suggestions: [] });
  }

  // Normalize for prefix matching — Prisma `contains` is case-insensitive
  // for SQLite strings, so we pass the query as-is.
  const prefix = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
  const out: Suggestion[] = [];
  const seen = new Set<string>();
  const push = (s: Suggestion) => {
    const key = `${s.type}:${s.label.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  // ----------------------------------------------------------
  // 1. Companies — highest-priority entity type
  // ----------------------------------------------------------
  const companies = await db.company.findMany({
    where: { name: { contains: prefix } },
    take: PER_ENTITY_LIMIT,
    select: { slug: true, name: true, description: true },
  });
  for (const c of companies) {
    push({
      label: c.name,
      type: "company",
      slug: c.slug,
      description: c.description ?? undefined,
    });
  }

  // ----------------------------------------------------------
  // 2. Products
  // ----------------------------------------------------------
  const products = await db.product.findMany({
    where: { name: { contains: prefix } },
    take: PER_ENTITY_LIMIT,
    select: { slug: true, name: true, description: true },
  });
  for (const p of products) {
    push({
      label: p.name,
      type: "product",
      slug: p.slug,
      description: p.description ?? undefined,
    });
  }

  // ----------------------------------------------------------
  // 3. Services
  // ----------------------------------------------------------
  const services = await db.service.findMany({
    where: { name: { contains: prefix } },
    take: PER_ENTITY_LIMIT,
    select: { slug: true, name: true, description: true },
  });
  for (const s of services) {
    push({
      label: s.name,
      type: "service",
      slug: s.slug,
      description: s.description ?? undefined,
    });
  }

  // ----------------------------------------------------------
  // 4. Industries
  // ----------------------------------------------------------
  const industries = await db.industry.findMany({
    where: { name: { contains: prefix } },
    take: 2,
    select: { slug: true, name: true, description: true },
  });
  for (const i of industries) {
    push({
      label: i.name,
      type: "industry",
      slug: i.slug,
      description: i.description ?? undefined,
    });
  }

  // ----------------------------------------------------------
  // 5. Technologies
  // ----------------------------------------------------------
  const techs = await db.technology.findMany({
    where: { name: { contains: prefix } },
    take: 2,
    select: { slug: true, name: true, description: true },
  });
  for (const t of techs) {
    push({
      label: t.name,
      type: "technology",
      slug: t.slug,
      description: t.description ?? undefined,
    });
  }

  // ----------------------------------------------------------
  // 6. Locations
  // ----------------------------------------------------------
  const locs = await db.location.findMany({
    where: { name: { contains: prefix } },
    take: 2,
    select: { slug: true, name: true, type: true },
  });
  for (const l of locs) {
    push({ label: l.name, type: "location", slug: l.slug, description: l.type });
  }

  // ----------------------------------------------------------
  // 7. Query-type suggestions — fill remaining slots with
  //    "{q} Manufacturers", "{q} Suppliers", etc.
  // ----------------------------------------------------------
  let addedQueries = 0;
  for (const suf of SUFFIXES) {
    if (out.length >= MAX_SUGGESTIONS) break;
    if (addedQueries >= MAX_QUERY_SUGGESTIONS) break;
    push({ label: `${prefix} ${suf}`, type: "query" });
    addedQueries++;
  }

  // ----------------------------------------------------------
  // 8. If still short, add more entity matches using a lowercased
  //    contains (catches different casing patterns)
  // ----------------------------------------------------------
  if (out.length < MAX_SUGGESTIONS) {
    const more = await db.company.findMany({
      where: {
        AND: [
          { name: { contains: q.toLowerCase() } },
          { slug: { notIn: companies.map((c) => c.slug) } },
        ],
      },
      take: MAX_SUGGESTIONS - out.length,
      select: { slug: true, name: true, description: true },
    });
    for (const c of more) {
      if (out.length >= MAX_SUGGESTIONS) break;
      push({
        label: c.name,
        type: "company",
        slug: c.slug,
        description: c.description ?? undefined,
      });
    }
  }

  // ----------------------------------------------------------
  // 9. Final cap & dedupe
  // ----------------------------------------------------------
  const final = out.slice(0, MAX_SUGGESTIONS);
  return NextResponse.json(
    { query: q, suggestions: final },
    { headers: { "Cache-Control": "no-store" } },
  );
}
