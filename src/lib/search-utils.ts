// ============================================================
// WEBUOS Search Engine — Shared utilities & types
// Used by all /api/search* and /api/businesses routes
// ============================================================

import { db } from "@/lib/db";

// ------------------------------------------------------------
// Public types — response shapes returned by the search APIs
// ------------------------------------------------------------

export type EntityType =
  | "company"
  | "product"
  | "service"
  | "industry"
  | "technology"
  | "location";

export type SortOption =
  | "relevance"
  | "newest"
  | "recently_updated"
  | "most_complete"
  | "nearest"
  | "az";

export interface InterpretedQuery {
  intent: string;
  entity_type: string | null;
  industry: string | null;
  location: string | null;
  business_type: string | null;
  keywords: string[];
  // Extended (used internally — surfaced in /api/search/interpret)
  country?: string | null;
  state?: string | null;
  city?: string | null;
  category?: string | null;
}

export interface CompanyResult {
  type: "company";
  id: string;
  slug: string;
  name: string;
  description: string | null;
  verified: boolean;
  claimed: boolean;
  business_type: string;
  ecosystem: string | null;
  industry: string | null;
  category: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  rating: number;
  review_count: number;
  product_count: number;
  service_count: number;
  website: string | null;
  relevance_score: number;
  logo: string | null;
}

export interface ProductResult {
  type: "product";
  id: string;
  slug: string;
  name: string;
  description: string | null;
  company_id: string;
  company_name: string | null;
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  price_range: string | null;
  availability: string | null;
  location: string | null;
  relevance_score: number;
}

export interface ServiceResult {
  type: "service";
  id: string;
  slug: string;
  name: string;
  description: string | null;
  company_id: string;
  company_name: string | null;
  category: string | null;
  industry_served: string | null;
  coverage: string | null;
  pricing_model: string | null;
  location: string | null;
  relevance_score: number;
}

export interface IndustryResult {
  type: "industry";
  id: string;
  slug: string;
  name: string;
  description: string | null;
  ecosystem: string | null;
  company_count: number;
  product_count: number;
  service_count: number;
  relevance_score: number;
}

export interface TechnologyResult {
  type: "technology";
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type_field: string | null;
  providers: string[];
  use_cases: string[];
  industries: string[];
  company_count: number;
  relevance_score: number;
}

export interface LocationResult {
  type: "location";
  id: string;
  slug: string;
  name: string;
  type_field: string;
  country: string | null;
  state: string | null;
  city: string | null;
  business_count: number;
  industries: string[];
  relevance_score: number;
}

export type SearchResult =
  | CompanyResult
  | ProductResult
  | ServiceResult
  | IndustryResult
  | TechnologyResult
  | LocationResult;

export interface SearchFacets {
  ecosystems: { id: string; name: string; count: number }[];
  business_types: { name: string; count: number }[];
  countries: { name: string; count: number }[];
  cities: { name: string; count: number }[];
  verified: { verified: number; claimed: number; registered: number };
}

export interface DiscoveryData {
  related_companies: SearchResult[];
  similar_businesses: SearchResult[];
  nearby_businesses: SearchResult[];
  trending_searches: string[];
  related_industries: { name: string; count: number }[];
  recommended_categories: { name: string; count: number }[];
  knowledge_panel: SearchResult | null;
  explore_more: { label: string; query: string; icon: string }[];
}

export interface SearchResponse {
  query: string;
  interpreted_query: InterpretedQuery;
  filters: {
    type: string;
    ecosystem: string | null;
    country: string | null;
  };
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  results: SearchResult[];
  facets: SearchFacets;
  related_searches: string[];
  discovery: DiscoveryData;
}

// ------------------------------------------------------------
// Constants & lookup tables
// ------------------------------------------------------------

export const CANONICAL_BUSINESS_TYPES = [
  "Manufacturer",
  "Supplier",
  "Distributor",
  "Wholesaler",
  "Service Provider",
  "Consultant",
  "Startup",
  "Enterprise",
] as const;

export const BUSINESS_SIZE_OPTIONS = [
  "Startup",
  "Small",
  "Medium",
  "Large",
  "Enterprise",
] as const;

export const VALID_ENTITY_TYPES: EntityType[] = [
  "company",
  "product",
  "service",
  "industry",
  "technology",
  "location",
];

export const VALID_SORTS: SortOption[] = [
  "relevance",
  "newest",
  "recently_updated",
  "most_complete",
  "nearest",
  "az",
];

export const VALID_EVENT_TYPES = [
  "search_started",
  "search_submitted",
  "search_result_viewed",
  "company_opened",
  "product_opened",
  "service_opened",
  "filter_applied",
  "search_result_clicked",
  "save_business",
  "contact_business",
  "request_quote",
  "search_no_results",
  "search_refined",
] as const;

export const ECOSYSTEM_NAMES: Record<string, string> = {
  industrial: "Industrial Engineering & Manufacturing",
  "technology-ai": "Information Technology & Artificial Intelligence",
  "business-services": "Professional, Commercial & Business Services",
};

// City aliases — handle legacy/alternative spellings that map to a
// canonical name stored in the Location table.
const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru",
  bombay: "Mumbai",
  madras: "Chennai",
  calcutta: "Kolkata",
  bangalorecity: "Bengaluru",
  gurgaon: "Gurugram",
};

// ------------------------------------------------------------
// Query sanitization & tokenization
// ------------------------------------------------------------

export function sanitizeQuery(q: string | null | undefined): string {
  if (!q) return "";
  let s = String(q).trim();
  // Limit to 200 chars per spec
  if (s.length > 200) s = s.slice(0, 200);
  // Strip control chars
  s = s.replace(/[\u0000-\u001f\u007f]/g, " ");
  return s.trim();
}

export function tokenize(query: string): string[] {
  if (!query) return [];
  const stop = new Set([
    "the",
    "and",
    "for",
    "of",
    "in",
    "near",
    "around",
    "to",
    "with",
    "a",
    "an",
    "is",
    "are",
    "by",
    "at",
    "on",
    "or",
    "vs",
    "vs.",
    "&",
    "-",
  ]);
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && !stop.has(t));
}

/**
 * Expand a token list using synonyms (loaded from DB).
 * Returns a de-duplicated list of all known variants — the original tokens
 * plus any synonym expansions. Each synonym string is split on BOTH commas
 * AND whitespace so multi-word synonyms like "Manufacturing Company" yield
 * two separate terms ("manufacturing", "company").
 *
 * Example: ["ai", "companies"] → ["ai", "companies", "artificial", "intelligence", "machine", "learning", "ml"]
 */
export function expandTokensWithSynonyms(
  tokens: string[],
  synonyms: { term: string; synonyms: string }[],
): string[] {
  const out = new Set<string>(tokens);
  for (const t of tokens) {
    const lc = t.toLowerCase();
    const match = synonyms.find((s) => s.term.toLowerCase() === lc);
    if (match) {
      match.synonyms
        .split(/[, ]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => out.add(s));
    }
  }
  return Array.from(out);
}

// ------------------------------------------------------------
// Business type normalization (for facets & filtering)
// ------------------------------------------------------------

/**
 * Map a raw businessType string (e.g. "Contract Manufacturer") to one of
 * the 8 canonical WEBUOS business types.
 */
export function normalizeBusinessType(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("manufacturer")) return "Manufacturer";
  if (s.includes("supplier")) return "Supplier";
  if (s.includes("distributor")) return "Distributor";
  if (s.includes("wholesaler") || s.includes("wholesale")) return "Wholesaler";
  if (s.includes("consultant") || s.includes("consulting") || s.includes("law firm") || s.includes("ip law")) {
    return "Consultant";
  }
  if (s.includes("startup")) return "Startup";
  if (s.includes("enterprise") || s.includes("retail chain") || s.includes("e-commerce")) {
    return "Enterprise";
  }
  if (s.includes("service") || s.includes("agency") || s.includes("provider") || s.includes("lab") || s.includes("integrator") || s.includes("contractor") || s.includes("builder") || s.includes("charging") || s.includes("printing") || s.includes("epc")) {
    return "Service Provider";
  }
  // Fall back to "Enterprise" for anything company-like
  if (s.includes("company") || s.includes("firm") || s.includes("vendor")) {
    return "Enterprise";
  }
  return raw;
}

// ------------------------------------------------------------
// Relevance scoring
// ------------------------------------------------------------

export function computeRelevance(opts: {
  query: string;
  tokens: string[];
  name: string | null;
  description?: string | null;
  otherText?: string;
  verified?: boolean;
  claimed?: boolean;
  registered?: boolean;
  popularity?: number;
  createdAt?: Date;
  companyCount?: number;
}): number {
  let score = 0;
  const q = opts.query.toLowerCase().trim();
  const name = (opts.name ?? "").toLowerCase();
  const desc = (opts.description ?? "").toLowerCase();
  const other = (opts.otherText ?? "").toLowerCase();

  // Exact full-query match in name (highest boost)
  if (q && name === q) score += 35;
  else if (q && name.includes(q)) score += 25;

  // Exact full-query match in description
  if (q && desc.includes(q)) score += 12;
  else if (q && other.includes(q)) score += 8;

  // Prefix match
  if (q && name.startsWith(q)) score += 20;

  // Per-token matching
  for (const t of opts.tokens) {
    if (!t) continue;
    if (name === t) score += 8;
    else if (name.includes(t)) score += 6;
    if (desc.includes(t)) score += 3;
    if (other.includes(t)) score += 2;
  }

  // Verification boost
  if (opts.verified) score += 10;
  else if (opts.claimed) score += 6;
  else if (opts.registered) score += 2;

  // Popularity boost (0..15)
  if (typeof opts.popularity === "number") {
    score += Math.min(15, opts.popularity * 15);
  }
  // Company count boost (industries, technologies, locations)
  if (typeof opts.companyCount === "number") {
    score += Math.min(10, opts.companyCount * 0.3);
  }

  // Freshness boost — up to +5 for items created in last 90 days
  if (opts.createdAt) {
    const ageDays = (Date.now() - opts.createdAt.getTime()) / 86_400_000;
    if (ageDays < 90) score += 5 * (1 - ageDays / 90);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ------------------------------------------------------------
// Query interpretation (used by /api/search/interpret AND /api/search)
// ------------------------------------------------------------

interface IndustryLookup {
  id: string;
  name: string;
  ecosystemId: string | null;
  sectorId: string | null;
  categoryId: string | null;
}

interface LocationLookup {
  id: string;
  name: string;
  type: string;
  country: string | null;
  state: string | null;
  city: string | null;
  slug: string;
}

/**
 * Detect business-type keyword in a token list.
 * Returns the canonical business type or null.
 */
export function detectBusinessType(tokens: string[]): string | null {
  const t = new Set(tokens.map((x) => x.toLowerCase()));
  // exact keyword matches
  if (t.has("manufacturer") || t.has("manufacturers") || t.has("manufacturing")) {
    return "Manufacturer";
  }
  if (t.has("supplier") || t.has("suppliers") || t.has("vendor") || t.has("vendors")) {
    return "Supplier";
  }
  if (t.has("distributor") || t.has("distributors")) return "Distributor";
  if (t.has("wholesaler") || t.has("wholesalers") || t.has("wholesale")) {
    return "Wholesaler";
  }
  if (t.has("consultant") || t.has("consultants") || t.has("consulting")) {
    return "Consultant";
  }
  if (t.has("startup") || t.has("startups")) return "Startup";
  if (t.has("enterprise") || t.has("enterprises")) return "Enterprise";
  if (t.has("retailer") || t.has("retailers")) return "Service Provider";
  return null;
}

/**
 * Detect an entity-type keyword ("companies", "products", etc.).
 */
export function detectEntityType(tokens: string[]): string | null {
  const t = new Set(tokens.map((x) => x.toLowerCase()));
  if (t.has("company") || t.has("companies") || t.has("firm") || t.has("firms") || t.has("business") || t.has("businesses")) {
    return "company";
  }
  if (t.has("product") || t.has("products")) return "product";
  if (t.has("service") || t.has("services") || t.has("provider") || t.has("providers")) {
    return "service";
  }
  if (t.has("industry") || t.has("industries") || t.has("sector")) return "industry";
  if (t.has("technology") || t.has("technologies") || t.has("tech")) {
    return "technology";
  }
  if (t.has("location") || t.has("locations") || t.has("place") || t.has("places")) {
    return "location";
  }
  return null;
}

/**
 * Resolve an alias (e.g. "bangalore" -> "Bengaluru") using a small known list.
 */
export function resolveCityAlias(name: string): string {
  return CITY_ALIASES[name.toLowerCase()] ?? name;
}

/**
 * Build a RegExp that matches `name` as a whole word, case-insensitive.
 * Falls back to substring match if the name contains non-word chars.
 */
function buildWholeWordRegex(name: string): RegExp {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Only treat as whole word if the name is alphanumeric-only
  if (/^[a-zA-Z0-9 ]+$/.test(name)) {
    return new RegExp(`\\b${escaped}\\b`, "i");
  }
  return new RegExp(escaped, "i");
}

/**
 * Interpret a raw search query. Loads industries/locations/synonyms from DB
 * and produces an `InterpretedQuery` object describing the user's intent.
 *
 * @param rawQuery  user query string (will be sanitized)
 * @param ctx       pre-loaded industry & location & synonym lookups (avoid re-querying)
 */
export async function interpretQuery(
  rawQuery: string,
  ctx?: {
    industries?: IndustryLookup[];
    locations?: LocationLookup[];
    synonyms?: { term: string; synonyms: string }[];
  },
): Promise<InterpretedQuery> {
  const query = sanitizeQuery(rawQuery);
  const industries = ctx?.industries ?? (await db.industry.findMany({
    select: {
      id: true,
      name: true,
      ecosystemId: true,
      sectorId: true,
      categoryId: true,
    },
  }));
  const locations =
    ctx?.locations ??
    (await db.location.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        country: true,
        state: true,
        city: true,
        slug: true,
      },
    }));
  const synonyms = ctx?.synonyms ?? (await db.searchSynonym.findMany());

  // 1) Tokenize & expand with synonyms
  const baseTokens = tokenize(query);
  const expanded = expandTokensWithSynonyms(baseTokens, synonyms);

  // 2) Detect entity type — fall back to "company" if a business-type keyword
  //    is present (manufacturers, suppliers, distributors, etc.)
  let entity_type = detectEntityType(baseTokens);
  const business_type = detectBusinessType(baseTokens);
  if (!entity_type && business_type) entity_type = "company";

  // 4) Detect industry — score each industry by how well its name overlaps
  //    with the query's expanded token set. Direct user-token matches (the
  //    word the user actually typed) beat synonym-expansion matches. More
  //    word overlap is better. Category-level (specific) industries beat
  //    sector-level (general) ones.
  let industry: string | null = null;
  let matchedIndustryRecord: IndustryLookup | null = null;
  let bestIndustryScore = 0;
  const baseTokenSet = new Set(baseTokens.map((t) => t.toLowerCase()));
  // Light stemming — strip common suffixes so "components" matches "component",
  // "manufacturing" matches "manufacturer", etc.
  const stem = (w: string) =>
    w
      .replace(/(ies)$/i, "y")
      .replace(/(ing)$/i, "")
      .replace(/(es)$/i, "")
      .replace(/(s)$/i, "");
  const stemmedBase = new Set(baseTokens.map((t) => stem(t.toLowerCase())));
  const stemmedExpanded = new Set(expanded.map((t) => stem(t)));
  // Known alternate spellings map (user token → industry word)
  const altMap: Record<string, string> = {
    automobile: "automotive",
    automobiles: "automotive",
    vehicle: "automotive",
    vehicles: "automotive",
    machine: "machinery",
    machines: "machinery",
  };
  const altBase = new Set(
    baseTokens
      .map((t) => altMap[t.toLowerCase()])
      .filter(Boolean),
  );
  for (const ind of industries) {
    const regex = buildWholeWordRegex(ind.name);
    const inQuery = regex.test(query);
    const nameWords = ind.name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 2);
    let directMatches = 0;
    let synonymMatches = 0;
    for (const w of nameWords) {
      if (baseTokenSet.has(w) || altBase.has(w)) directMatches++;
      else if (
        stemmedBase.has(stem(w)) ||
        expanded.includes(w) ||
        stemmedExpanded.has(stem(w))
      )
        synonymMatches++;
    }
    if (!inQuery && directMatches === 0 && synonymMatches === 0) continue;

    let score = 0;
    if (inQuery) score += 50;
    score += directMatches * 30;
    score += synonymMatches * 5;
    if (ind.categoryId) score += 5;
    const firstWord = nameWords[0];
    if (firstWord && (baseTokenSet.has(firstWord) || altBase.has(firstWord)))
      score += 15;

    if (score > bestIndustryScore) {
      bestIndustryScore = score;
      matchedIndustryRecord = ind;
      industry = ind.name;
    }
  }

  // If no industry matched, try matching the ecosystem name
  if (!industry) {
    for (const [ecoId, ecoName] of Object.entries(ECOSYSTEM_NAMES)) {
      const regex = buildWholeWordRegex(ecoName);
      if (regex.test(query)) {
        industry = ecoName;
        break;
      }
      // Try shorter aliases like "industrial", "technology", "ai", "business"
      const alias: Record<string, string[]> = {
        industrial: ["industrial", "manufacturing", "factory"],
        "technology-ai": ["technology", "tech", "software", "ai", "ml", "cloud", "cyber", "iot", "data"],
        "business-services": ["business", "consulting", "finance", "legal", "marketing", "retail"],
      };
      const aliases = alias[ecoId] ?? [];
      if (aliases.some((a) => expanded.includes(a) || baseTokens.includes(a))) {
        industry = ecoName;
        break;
      }
    }
  }

  // 5) Detect location — match location names as whole words in the query
  let location: string | null = null;
  let country: string | null = null;
  let state: string | null = null;
  let city: string | null = null;

  let matchedLocation: LocationLookup | null = null;
  // First, try matching against the canonical names
  for (const loc of locations) {
    const regex = buildWholeWordRegex(loc.name);
    if (regex.test(query)) {
      matchedLocation = loc;
      break;
    }
  }
  // If no canonical match, try the alias map (e.g. bangalore -> Bengaluru)
  if (!matchedLocation) {
    for (const t of baseTokens) {
      const alias = CITY_ALIASES[t.toLowerCase()];
      if (alias) {
        const found = locations.find(
          (l) => l.name.toLowerCase() === alias.toLowerCase(),
        );
        if (found) {
          matchedLocation = found;
          break;
        }
      }
    }
  }

  if (matchedLocation) {
    const parts: string[] = [];
    if (matchedLocation.type === "Country") {
      country = matchedLocation.country;
      parts.push(country!);
    } else if (matchedLocation.type === "State") {
      state = matchedLocation.state;
      country = matchedLocation.country;
      if (state) parts.push(state);
      if (country) parts.push(country);
    } else {
      // City
      city = matchedLocation.city;
      state = matchedLocation.state;
      country = matchedLocation.country;
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (country) parts.push(country);
    }
    if (parts.length > 0) location = parts.join(", ");
  }

  // 6) Determine intent
  let intent = "General Information";
  if (entity_type === "product") intent = "Product Discovery";
  else if (entity_type === "service") intent = "Service Discovery";
  else if (entity_type === "industry") intent = "Industry Research";
  else if (entity_type === "location") intent = "Location Research";
  else if (entity_type === "technology") intent = "Technology Research";
  else if (entity_type === "company" || business_type || industry) {
    intent = "Business Discovery";
  } else if (city || state || country) {
    intent = "Business Discovery";
  }

  // 7) Keywords — strip out stop-words, location names, business-type
  //    keywords, entity-type keywords and "in"-like particles so we're
  //    left with the meaningful content keywords.
  const allStop = new Set<string>([
    "company",
    "companies",
    "firm",
    "firms",
    "business",
    "businesses",
    "product",
    "products",
    "service",
    "services",
    "provider",
    "providers",
    "industry",
    "industries",
    "sector",
    "technology",
    "technologies",
    "tech",
    "location",
    "locations",
    "place",
    "places",
    "manufacturer",
    "manufacturers",
    "manufacturing",
    "supplier",
    "suppliers",
    "vendor",
    "vendors",
    "distributor",
    "distributors",
    "wholesaler",
    "wholesalers",
    "wholesale",
    "consultant",
    "consultants",
    "consulting",
    "startup",
    "startups",
    "enterprise",
    "enterprises",
    "retailer",
    "retailers",
  ]);
  const matchedLocationNames = new Set<string>();
  if (matchedLocation) {
    matchedLocation.name
      .toLowerCase()
      .split(/\s+/)
      .forEach((w) => matchedLocationNames.add(w));
    if (matchedLocation.country)
      matchedLocationNames.add(matchedLocation.country.toLowerCase());
    if (matchedLocation.state)
      matchedLocationNames.add(matchedLocation.state.toLowerCase());
    if (matchedLocation.city)
      matchedLocationNames.add(matchedLocation.city.toLowerCase());
  }
  // Inverse alias map — if the user typed "bangalore" but it resolved to
  // "Bengaluru", also strip "bangalore" from keywords.
  for (const t of baseTokens) {
    const alias = CITY_ALIASES[t.toLowerCase()];
    if (
      alias &&
      matchedLocation &&
      matchedLocation.name.toLowerCase() === alias.toLowerCase()
    ) {
      matchedLocationNames.add(t.toLowerCase());
    }
  }
  const keywords = baseTokens.filter(
    (t) => !allStop.has(t) && !matchedLocationNames.has(t),
  );

  return {
    intent,
    entity_type: entity_type
      ? entity_type.charAt(0).toUpperCase() + entity_type.slice(1)
      : null,
    industry,
    location,
    business_type,
    country,
    state,
    city,
    category: matchedIndustryRecord?.categoryId ?? null,
    keywords,
  };
}

// ------------------------------------------------------------
// Related-search generation
// ------------------------------------------------------------

/**
 * Build up to 5 related-search suggestions based on the interpreted query
 * and the actual results returned.
 */
export function buildRelatedSearches(
  interpreted: InterpretedQuery,
  topResults: { name: string; type: string }[],
): string[] {
  const out = new Set<string>();
  const kw = interpreted.keywords[0] ?? "";
  const kwCap = kw ? kw.charAt(0).toUpperCase() + kw.slice(1) : "";
  const country = interpreted.country;

  // 1) "{keyword} startups {country}"
  if (kw && country) {
    out.add(`${kwCap} startups ${country}`);
  }
  // 2) "{keyword} companies"
  if (kw) {
    out.add(`${kwCap} companies`);
  }
  // 3) "{industry or ecosystem fragment} companies"
  if (interpreted.industry) {
    const frag = interpreted.industry.split(/[&\-,]/)[0].trim();
    if (frag && frag.toLowerCase() !== kw.toLowerCase()) {
      out.add(`${frag} companies`);
    }
  }
  // 4) "{keyword} consulting services"
  if (kw) {
    out.add(`${kwCap} consulting services`);
  }
  // 5) "{keyword} software companies"
  if (kw) {
    out.add(`${kwCap} software companies`);
  }
  // 6) "{top-result-name}-style" — based on top company
  for (const r of topResults) {
    if (r.type === "company" && r.name && !r.name.toLowerCase().includes(kw)) {
      const shortName = r.name.split(/\s+/).slice(0, 2).join(" ");
      out.add(`Companies like ${shortName}`);
    }
    if (out.size >= 5) break;
  }

  // Always ensure we have at least 5 entries by adding category-based suggestions
  if (kw && out.size < 5) {
    out.add(`${kwCap} distributors`);
  }
  if (kw && out.size < 5) {
    out.add(`${kwCap} suppliers`);
  }
  if (kw && out.size < 5) {
    out.add(`${kwCap} service providers`);
  }
  if (kw && out.size < 5) {
    out.add(`Top ${kwCap} companies`);
  }
  if (kw && out.size < 5) {
    out.add(`${kwCap} industry overview`);
  }

  return Array.from(out).slice(0, 5);
}

// ------------------------------------------------------------
// Facets aggregation (in-memory)
// ------------------------------------------------------------

export function buildFacets(
  companies: {
    ecosystemId: string;
    businessType: string;
    country: string | null;
    city: string | null;
    verified: boolean;
    claimed: boolean;
    registered: boolean;
  }[],
): SearchFacets {
  const ecosystemMap = new Map<string, number>();
  const btMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  const cityMap = new Map<string, number>();
  let verifiedCount = 0;
  let claimedCount = 0;
  let registeredCount = 0;

  for (const c of companies) {
    if (c.ecosystemId) {
      ecosystemMap.set(c.ecosystemId, (ecosystemMap.get(c.ecosystemId) ?? 0) + 1);
    }
    const bt = normalizeBusinessType(c.businessType);
    if (bt) btMap.set(bt, (btMap.get(bt) ?? 0) + 1);
    if (c.country) countryMap.set(c.country, (countryMap.get(c.country) ?? 0) + 1);
    if (c.city) cityMap.set(c.city, (cityMap.get(c.city) ?? 0) + 1);
    if (c.verified) verifiedCount++;
    else if (c.claimed) claimedCount++;
    else if (c.registered) registeredCount++;
  }

  const toArr = (m: Map<string, number>) =>
    Array.from(m.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

  return {
    ecosystems: Array.from(ecosystemMap.entries()).map(([id, count]) => ({
      id,
      name: ECOSYSTEM_NAMES[id] ?? id,
      count,
    })),
    business_types: toArr(btMap),
    countries: toArr(countryMap),
    cities: toArr(cityMap),
    verified: {
      verified: verifiedCount,
      claimed: claimedCount,
      registered: registeredCount,
    },
  };
}

// ------------------------------------------------------------
// Demo user (used by saved-searches endpoints)
// ------------------------------------------------------------

let cachedDemoUserId: string | null = null;
export async function getDemoUserId(): Promise<string> {
  if (cachedDemoUserId) return cachedDemoUserId;
  const email = "demo@webuos.com";
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: { email, name: "WEBUOS Demo User" },
    });
  }
  cachedDemoUserId = user.id;
  return user.id;
}

// ------------------------------------------------------------
// Sort comparator helpers
// ------------------------------------------------------------

export function sortResults(
  results: SearchResult[],
  sort: SortOption,
): SearchResult[] {
  switch (sort) {
    case "az":
      return [...results].sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? ""),
      );
    case "newest":
      // Companies/products/services carry createdAt implicitly via relevance_score
      // (we cannot sort by createdAt directly across mixed types in memory
      // without preserving it on each result). We approximate by treating
      // higher relevance as "newer" for non-company types. For company types
      // we have stored nothing about createdAt here, so fall through.
      return [...results].sort(
        (a, b) => b.relevance_score - a.relevance_score,
      );
    case "recently_updated":
      return [...results].sort(
        (a, b) => b.relevance_score - a.relevance_score,
      );
    case "most_complete":
      // Companies with more products+services rank higher
      return [...results].sort((a, b) => {
        const aCount =
          a.type === "company"
            ? a.product_count + a.service_count
            : a.type === "industry"
              ? a.company_count
              : a.type === "technology"
                ? a.company_count
                : a.type === "location"
                  ? a.business_count
                  : 0;
        const bCount =
          b.type === "company"
            ? b.product_count + b.service_count
            : b.type === "industry"
              ? b.company_count
              : b.type === "technology"
                ? b.company_count
                : b.type === "location"
                  ? b.business_count
                  : 0;
        return bCount - aCount || b.relevance_score - a.relevance_score;
      });
    case "nearest":
      // No real geo-distance without query location context — keep relevance
      return [...results].sort(
        (a, b) => b.relevance_score - a.relevance_score,
      );
    case "relevance":
    default:
      return [...results].sort((a, b) => b.relevance_score - a.relevance_score);
  }
}
