// ============================================================
// WEBUOS Search Engine — Server-side in-memory search runner
//
// Pure TypeScript mock-data powered search engine.
// Exposes `runSearch(params)` for both /api/search and /search page.
// Zero database / Prisma dependencies.
// ============================================================

import {
  MOCK_COMPANIES,
  MOCK_PRODUCTS,
  MOCK_SERVICES,
  MOCK_INDUSTRIES,
  MOCK_TECHNOLOGIES,
  MOCK_LOCATIONS,
  MOCK_SYNONYMS,
} from "@/data/mock-db";
import { ecosystems as allEcosystems } from "@/data/taxonomy";
import {
  buildFacets,
  buildRelatedSearches,
  computeRelevance,
  expandTokensWithSynonyms,
  interpretQuery,
  sanitizeQuery,
  sortResults,
  tokenize,
  VALID_ENTITY_TYPES,
  VALID_SORTS,
  type DiscoveryData,
  type EntityType,
  type InterpretedQuery,
  type SearchResponse,
  type SearchResult,
  type SortOption,
} from "@/lib/search-utils";

// ------------------------------------------------------------
// Public types
// ------------------------------------------------------------

export interface SearchParams {
  q: string;
  type?: string;
  ecosystem?: string;
  sector?: string;
  category?: string;
  country?: string;
  state?: string;
  city?: string;
  business_type?: string;
  business_size?: string;
  verified?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// ------------------------------------------------------------
// Text matching helper
// ------------------------------------------------------------

function matchesTokens(
  targetText: string,
  tokens: string[],
  fallbackQuery: string,
): boolean {
  if (!tokens.length && !fallbackQuery) return true;
  const lower = targetText.toLowerCase();
  if (tokens.length > 0) {
    return tokens.some((t) => t && lower.includes(t.toLowerCase()));
  }
  return lower.includes(fallbackQuery.toLowerCase());
}

// ------------------------------------------------------------
// Main search runner
// ------------------------------------------------------------

export async function runSearch(params: SearchParams): Promise<SearchResponse> {
  const query = sanitizeQuery(params.q ?? "");

  // Parse & validate `type`
  const typeParam = (params.type ?? "all").toLowerCase();
  const type: EntityType | "all" = VALID_ENTITY_TYPES.includes(
    typeParam as EntityType,
  )
    ? (typeParam as EntityType)
    : "all";

  const ecosystem = params.ecosystem ?? null;
  const sector = params.sector ?? null;
  const category = params.category ?? null;
  const country = params.country ?? null;
  const state = params.state ?? null;
  const city = params.city ?? null;
  const business_type = params.business_type ?? null;
  const business_size = params.business_size ?? null;
  const verified = params.verified === "true";

  const sortParam = (params.sort ?? "relevance").toLowerCase();
  const sort: SortOption = VALID_SORTS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "relevance";

  let page = params.page ?? 1;
  if (isNaN(page) || page < 1) page = 1;
  let limit = params.limit ?? 10;
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50;

  // Synonyms and tokens
  const synonyms = MOCK_SYNONYMS;
  const baseTokens = tokenize(query);
  const expandedTokens = expandTokensWithSynonyms(baseTokens, synonyms);

  // Interpret query
  const interpreted: InterpretedQuery = await interpretQuery(query, {
    industries: MOCK_INDUSTRIES.map((ind) => ({
      id: ind.id,
      name: ind.name,
      ecosystemId: ind.ecosystemId,
      sectorId: ind.sectorId,
      categoryId: ind.categoryId ?? "",
    })),
    locations: MOCK_LOCATIONS.map((loc) => ({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      country: loc.country,
      state: loc.state,
      city: loc.city,
      slug: loc.slug,
    })),
    synonyms,
  });

  const activeCountry = country ?? interpreted.country ?? null;
  const activeState = state ?? interpreted.state ?? null;
  const activeCity = city ?? interpreted.city ?? null;

  // ----------------------------------------------------------
  // 1. Search Companies
  // ----------------------------------------------------------
  const companyResults: Extract<SearchResult, { type: "company" }>[] = [];

  if (type === "all" || type === "company") {
    for (const c of MOCK_COMPANIES) {
      // Filters
      if (ecosystem && c.ecosystemId.toLowerCase() !== ecosystem.toLowerCase()) continue;
      if (sector && c.sectorId.toLowerCase() !== sector.toLowerCase()) continue;
      if (category && c.categoryId.toLowerCase() !== category.toLowerCase()) continue;
      if (business_size && c.businessSize.toLowerCase() !== business_size.toLowerCase()) continue;
      if (verified && !c.verified) continue;
      if (business_type && !c.businessType.toLowerCase().includes(business_type.toLowerCase())) continue;
      if (activeCountry && !c.country.toLowerCase().includes(activeCountry.toLowerCase())) continue;
      if (activeState && !c.state.toLowerCase().includes(activeState.toLowerCase())) continue;
      if (activeCity && !c.city.toLowerCase().includes(activeCity.toLowerCase())) continue;

      const searchableText = [
        c.name,
        c.description,
        c.businessType,
        c.industryName,
        c.categoryName,
        c.country,
        c.state,
        c.city,
        c.certifications,
        c.industriesServed,
        c.marketsServed,
      ].join(" ");

      if (query && !matchesTokens(searchableText, expandedTokens, query)) {
        continue;
      }

      const otherText = [
        c.businessType,
        c.industryName,
        c.categoryName,
        c.country,
        c.state,
        c.city,
        c.certifications,
        c.industriesServed,
        c.marketsServed,
      ].join(" ");

      const relevance = query
        ? computeRelevance({
            query,
            tokens: expandedTokens,
            name: c.name,
            description: c.description,
            otherText,
            verified: c.verified,
            claimed: c.claimed,
            registered: c.registered,
            popularity: c.popularity,
            createdAt: new Date(2025, 0, 1),
          })
        : Math.round((c.popularity ?? 0.5) * 50 + (c.verified ? 10 : 0) + (c.claimed ? 5 : 0));

      const locationBits = [c.city, c.state, c.country].filter(Boolean);
      companyResults.push({
        type: "company",
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        verified: c.verified,
        claimed: c.claimed,
        business_type: c.businessType,
        ecosystem: c.ecosystemId,
        industry: c.industryName,
        category: c.categoryName,
        location: locationBits.join(", "),
        city: c.city,
        country: c.country,
        rating: c.rating,
        review_count: c.reviewCount,
        product_count: c.productCount,
        service_count: c.serviceCount,
        website: c.website,
        relevance_score: relevance,
        logo: c.logoUrl,
      });
    }
  }

  // ----------------------------------------------------------
  // 2. Search Products
  // ----------------------------------------------------------
  const productResults: Extract<SearchResult, { type: "product" }>[] = [];

  if (type === "all" || type === "product") {
    for (const p of MOCK_PRODUCTS) {
      if (activeCountry && !p.country.toLowerCase().includes(activeCountry.toLowerCase())) continue;
      if (activeCity && !p.city.toLowerCase().includes(activeCity.toLowerCase())) continue;

      const searchableText = [p.name, p.description, p.category, p.subcategory, p.brand, p.companyName].join(" ");
      if (query && !matchesTokens(searchableText, expandedTokens, query)) {
        continue;
      }

      const otherText = [p.category, p.subcategory, p.brand, p.companyName].join(" ");
      const relevance = query
        ? computeRelevance({
            query,
            tokens: expandedTokens,
            name: p.name,
            description: p.description,
            otherText,
            popularity: 0.8,
            createdAt: new Date(2025, 0, 1),
          })
        : 50;

      const loc = [p.city, p.state, p.country].filter(Boolean).join(", ");
      productResults.push({
        type: "product",
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        company_id: p.companyId,
        company_name: p.companyName,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory,
        price_range: p.priceRange,
        availability: p.availability,
        location: loc || null,
        relevance_score: relevance,
      });
    }
  }

  // ----------------------------------------------------------
  // 3. Search Services
  // ----------------------------------------------------------
  const serviceResults: Extract<SearchResult, { type: "service" }>[] = [];

  if (type === "all" || type === "service") {
    for (const s of MOCK_SERVICES) {
      if (activeCountry && !s.country.toLowerCase().includes(activeCountry.toLowerCase())) continue;
      if (activeCity && !s.city.toLowerCase().includes(activeCity.toLowerCase())) continue;

      const searchableText = [s.name, s.description, s.category, s.industryServed, s.companyName].join(" ");
      if (query && !matchesTokens(searchableText, expandedTokens, query)) {
        continue;
      }

      const otherText = [s.category, s.industryServed, s.companyName].join(" ");
      const relevance = query
        ? computeRelevance({
            query,
            tokens: expandedTokens,
            name: s.name,
            description: s.description,
            otherText,
            popularity: 0.8,
            createdAt: new Date(2025, 0, 1),
          })
        : 50;

      const loc = [s.city, s.state, s.country].filter(Boolean).join(", ");
      serviceResults.push({
        type: "service",
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        company_id: s.companyId,
        company_name: s.companyName,
        category: s.category,
        industry_served: s.industryServed,
        coverage: s.coverage,
        pricing_model: s.pricingModel,
        location: loc || null,
        relevance_score: relevance,
      });
    }
  }

  // ----------------------------------------------------------
  // 4. Search Industries
  // ----------------------------------------------------------
  const industryResults: Extract<SearchResult, { type: "industry" }>[] = [];

  if (type === "all" || type === "industry") {
    for (const ind of MOCK_INDUSTRIES) {
      if (ecosystem && ind.ecosystemId.toLowerCase() !== ecosystem.toLowerCase()) continue;
      if (sector && ind.sectorId.toLowerCase() !== sector.toLowerCase()) continue;
      if (category && ind.categoryId && ind.categoryId.toLowerCase() !== category.toLowerCase()) continue;

      const searchableText = [ind.name, ind.description].join(" ");
      if (query && !matchesTokens(searchableText, expandedTokens, query)) {
        continue;
      }

      const relevance = query
        ? computeRelevance({
            query,
            tokens: expandedTokens,
            name: ind.name,
            description: ind.description,
            companyCount: ind.companyCount,
            createdAt: new Date(2025, 0, 1),
          })
        : 50;

      industryResults.push({
        type: "industry",
        id: ind.id,
        slug: ind.slug,
        name: ind.name,
        description: ind.description,
        ecosystem: ind.ecosystemId,
        company_count: ind.companyCount,
        product_count: ind.productCount,
        service_count: ind.serviceCount,
        relevance_score: relevance,
      });
    }
  }

  // ----------------------------------------------------------
  // 5. Search Technologies
  // ----------------------------------------------------------
  const techResults: Extract<SearchResult, { type: "technology" }>[] = [];

  if (type === "all" || type === "technology") {
    for (const t of MOCK_TECHNOLOGIES) {
      const searchableText = [t.name, t.description, t.providers, t.useCases, t.industries].join(" ");
      if (query && !matchesTokens(searchableText, expandedTokens, query)) {
        continue;
      }

      const otherText = [t.providers, t.useCases, t.industries].join(" ");
      const relevance = query
        ? computeRelevance({
            query,
            tokens: expandedTokens,
            name: t.name,
            description: t.description,
            otherText,
            companyCount: t.companyCount,
            createdAt: new Date(2025, 0, 1),
          })
        : 50;

      techResults.push({
        type: "technology",
        id: t.id,
        slug: t.slug,
        name: t.name,
        description: t.description,
        type_field: t.type,
        providers: t.providers ? t.providers.split(",").map((s) => s.trim()).filter(Boolean) : [],
        use_cases: t.useCases ? t.useCases.split(",").map((s) => s.trim()).filter(Boolean) : [],
        industries: t.industries ? t.industries.split(",").map((s) => s.trim()).filter(Boolean) : [],
        company_count: t.companyCount,
        relevance_score: relevance,
      });
    }
  }

  // ----------------------------------------------------------
  // 6. Search Locations
  // ----------------------------------------------------------
  const locationResults: Extract<SearchResult, { type: "location" }>[] = [];

  if (type === "all" || type === "location") {
    for (const l of MOCK_LOCATIONS) {
      const searchableText = [l.name, l.country, l.state, l.city, l.type, l.industries].join(" ");
      if (query && !matchesTokens(searchableText, expandedTokens, query)) {
        continue;
      }

      const relevance = query
        ? computeRelevance({
            query,
            tokens: expandedTokens,
            name: l.name,
            description: l.country,
            otherText: [l.state, l.city, l.type, l.industries].join(" "),
            companyCount: l.businessCount,
            createdAt: new Date(2025, 0, 1),
          })
        : 50;

      locationResults.push({
        type: "location",
        id: l.id,
        slug: l.slug,
        name: l.name,
        type_field: l.type,
        country: l.country,
        state: l.state,
        city: l.city,
        business_count: l.businessCount,
        industries: l.industries ? l.industries.split(",").map((s) => s.trim()).filter(Boolean) : [],
        relevance_score: relevance,
      });
    }
  }

  // ----------------------------------------------------------
  // Combine all results
  // ----------------------------------------------------------
  const allResults: SearchResult[] = [
    ...companyResults,
    ...productResults,
    ...serviceResults,
    ...industryResults,
    ...techResults,
    ...locationResults,
  ];

  const filtered = query ? allResults.filter((r) => r.relevance_score > 0) : allResults;
  const sorted = sortResults(filtered, sort);

  const total = sorted.length;
  const total_pages = Math.max(1, Math.ceil(total / limit));
  const startIdx = (page - 1) * limit;
  const pageResults = sorted.slice(startIdx, startIdx + limit);

  // ----------------------------------------------------------
  // Build facets
  // ----------------------------------------------------------
  const facetCompanies = companyResults.map((c) => ({
    ecosystemId: c.ecosystem ?? "",
    businessType: c.business_type,
    country: c.country,
    city: c.city,
    verified: c.verified,
    claimed: c.claimed,
    registered: true,
  }));
  const facets = buildFacets(facetCompanies);

  // ----------------------------------------------------------
  // Build related searches
  // ----------------------------------------------------------
  const topResults = sorted.slice(0, 5).map((r) => ({ name: r.name, type: r.type }));
  const related_searches = buildRelatedSearches(interpreted, topResults);

  // ----------------------------------------------------------
  // Build Discovery Data (40% panel)
  // ----------------------------------------------------------
  const knowledgePanel =
    pageResults.find((r) => r.type === "company" && r.relevance_score > 70) ?? null;

  const topIndustries = new Set(
    pageResults
      .filter((r) => r.type === "company")
      .map((r) => (r as Extract<SearchResult, { type: "company" }>).industry)
      .filter(Boolean),
  );
  const topCategories = new Set(
    pageResults
      .filter((r) => r.type === "company")
      .map((r) => (r as Extract<SearchResult, { type: "company" }>).category)
      .filter(Boolean),
  );
  const currentPageIds = new Set(pageResults.map((r) => r.id));

  const relatedCompanies = sorted
    .filter(
      (r) =>
        r.type === "company" &&
        !currentPageIds.has(r.id) &&
        (((r as Extract<SearchResult, { type: "company" }>).industry &&
          topIndustries.has((r as Extract<SearchResult, { type: "company" }>).industry)) ||
          ((r as Extract<SearchResult, { type: "company" }>).category &&
            topCategories.has((r as Extract<SearchResult, { type: "company" }>).category))),
    )
    .slice(0, 5);

  const topBusinessTypes = new Set(
    pageResults
      .filter((r) => r.type === "company")
      .map((r) => (r as Extract<SearchResult, { type: "company" }>).business_type)
      .filter(Boolean),
  );
  const similarBusinesses = sorted
    .filter(
      (r) =>
        r.type === "company" &&
        !currentPageIds.has(r.id) &&
        !relatedCompanies.includes(r) &&
        (r as Extract<SearchResult, { type: "company" }>).business_type &&
        topBusinessTypes.has((r as Extract<SearchResult, { type: "company" }>).business_type),
    )
    .slice(0, 5);

  const topCities = new Set(
    pageResults
      .filter((r) => (r as Extract<SearchResult, { type: "company" }>).city)
      .map((r) => (r as Extract<SearchResult, { type: "company" }>).city),
  );
  const topCountries = new Set(
    pageResults
      .filter((r) => (r as Extract<SearchResult, { type: "company" }>).country)
      .map((r) => (r as Extract<SearchResult, { type: "company" }>).country),
  );
  const nearbyBusinesses = sorted
    .filter(
      (r) =>
        r.type === "company" &&
        !currentPageIds.has(r.id) &&
        !relatedCompanies.includes(r) &&
        !similarBusinesses.includes(r) &&
        (((r as Extract<SearchResult, { type: "company" }>).city &&
          topCities.has((r as Extract<SearchResult, { type: "company" }>).city)) ||
          ((r as Extract<SearchResult, { type: "company" }>).country &&
            topCountries.has((r as Extract<SearchResult, { type: "company" }>).country))),
    )
    .slice(0, 5);

  const trendingSearches: string[] = [
    `${query || "Industrial"} manufacturers`,
    `${query || "B2B"} suppliers`,
    `${query || "Manufacturing"} companies in India`,
    `best ${query || "tech"} companies`,
    `${query || "Services"} near me`,
  ].slice(0, 5);

  const matchingIndustries = MOCK_INDUSTRIES.filter((ind) =>
    interpreted.industry ? ind.name.toLowerCase().includes(interpreted.industry.toLowerCase()) : true,
  )
    .sort((a, b) => b.companyCount - a.companyCount)
    .slice(0, 5)
    .map((i) => ({ name: i.name, count: i.companyCount }));

  const queryLower = query.toLowerCase();
  const matchingCategories = allEcosystems
    .flatMap((e) => e.categories.flatMap((s) => s.categories))
    .filter(
      (c) =>
        !query ||
        c.name.toLowerCase().includes(queryLower) ||
        c.products.some((p) => p.name.toLowerCase().includes(queryLower)),
    )
    .slice(0, 5)
    .map((c) => ({ name: c.name, count: c.businessProfiles.length }));

  const exploreMore = [
    { label: "Companies", query: `${query} type=company`.trim(), icon: "Building2" },
    { label: "Products", query: `${query} type=product`.trim(), icon: "Package" },
    { label: "Services", query: `${query} type=service`.trim(), icon: "Wrench" },
    { label: "Industries", query: `${query} type=industry`.trim(), icon: "BarChart3" },
  ];

  const discovery: DiscoveryData = {
    related_companies: relatedCompanies,
    similar_businesses: similarBusinesses,
    nearby_businesses: nearbyBusinesses,
    trending_searches: trendingSearches,
    related_industries: matchingIndustries,
    recommended_categories: matchingCategories,
    knowledge_panel: knowledgePanel,
    explore_more: exploreMore,
  };

  return {
    query,
    interpreted_query: interpreted,
    filters: {
      type,
      ecosystem,
      country: country ?? interpreted.country ?? null,
    },
    total,
    page,
    limit,
    total_pages,
    results: pageResults,
    facets,
    related_searches,
    discovery,
  };
}
