// ============================================================
// WEBUOS Search API — Main hybrid search endpoint
// GET /api/search?q=...&type=...&ecosystem=...&...
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
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
  type CompanyResult,
  type EntityType,
  type InterpretedQuery,
  type LocationResult,
  type IndustryResult,
  type ProductResult,
  type SearchResponse,
  type SearchResult,
  type ServiceResult,
  type SortOption,
  type TechnologyResult,
} from "@/lib/search-utils";

export const dynamic = "force-dynamic";

// ------------------------------------------------------------
// Helper — build OR clauses for any model where input type is unknown
// ------------------------------------------------------------

function buildOrClauses(
  tokens: string[],
  fields: string[],
): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  for (const t of tokens) {
    if (!t) continue;
    for (const f of fields) {
      out.push({ [f]: { contains: t } });
    }
  }
  return out;
}

// ------------------------------------------------------------
// Main GET handler
// ------------------------------------------------------------

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const rawQuery = url.searchParams.get("q") ?? "";
  const query = sanitizeQuery(rawQuery);

  // Parse filters
  const typeParam = (url.searchParams.get("type") ?? "all").toLowerCase();
  const type: EntityType | "all" = VALID_ENTITY_TYPES.includes(
    typeParam as EntityType,
  )
    ? (typeParam as EntityType)
    : "all";

  const ecosystem = url.searchParams.get("ecosystem");
  const sector = url.searchParams.get("sector");
  const category = url.searchParams.get("category");
  const country = url.searchParams.get("country");
  const state = url.searchParams.get("state");
  const city = url.searchParams.get("city");
  const business_type = url.searchParams.get("business_type");
  const business_size = url.searchParams.get("business_size");
  const verified = url.searchParams.get("verified") === "true";

  const sortParam = (url.searchParams.get("sort") ?? "relevance").toLowerCase();
  const sort: SortOption = VALID_SORTS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "relevance";

  // Pagination — clamp to safe range
  let page = parseInt(url.searchParams.get("page") ?? "1", 10);
  if (isNaN(page) || page < 1) page = 1;
  let limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50;

  // Load synonyms once (used for token expansion and interpretation)
  const synonyms = await db.searchSynonym.findMany();

  // Tokenize & expand
  const baseTokens = tokenize(query);
  const expandedTokens = expandTokensWithSynonyms(baseTokens, synonyms);

  // Pre-load industries & locations so we can interpret without re-querying
  const [industriesAll, locationsAll] = await Promise.all([
    db.industry.findMany({
      select: {
        id: true,
        name: true,
        ecosystemId: true,
        sectorId: true,
        categoryId: true,
      },
    }),
    db.location.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        country: true,
        state: true,
        city: true,
        slug: true,
      },
    }),
  ]);

  // Interpret the query (entity type, industry, location, business type, keywords)
  const interpreted: InterpretedQuery = await interpretQuery(query, {
    industries: industriesAll,
    locations: locationsAll,
    synonyms,
  });

  // ----------------------------------------------------------
  // Search companies (unless filtered out)
  // ----------------------------------------------------------
  const companyResults: CompanyResult[] = [];

  if (type === "all" || type === "company") {
    const fields = [
      "name",
      "description",
      "businessType",
      "industryName",
      "categoryName",
      "country",
      "state",
      "city",
      "certifications",
      "industriesServed",
      "marketsServed",
    ];
    const companyWhere: Prisma.CompanyWhereInput = {};
    if (expandedTokens.length > 0) {
      // Per spec: combine with OR clauses per token across all searchable fields
      const flatOr: Prisma.CompanyWhereInput[] = [];
      for (const t of expandedTokens) {
        if (!t) continue;
        for (const f of fields) {
          flatOr.push({ [f]: { contains: t } } as Prisma.CompanyWhereInput);
        }
      }
      companyWhere.OR = flatOr;
    } else if (query) {
      const phraseOrs: Prisma.CompanyWhereInput[] = [];
      for (const f of fields) {
        phraseOrs.push({ [f]: { contains: query } } as Prisma.CompanyWhereInput);
      }
      companyWhere.OR = phraseOrs;
    }

    if (ecosystem) companyWhere.ecosystemId = ecosystem;
    if (sector) companyWhere.sectorId = sector;
    if (category) companyWhere.categoryId = category;
    if (business_size) companyWhere.businessSize = business_size;
    if (verified) companyWhere.verified = true;
    if (business_type) {
      // Match by `contains` since raw types include variations like
      // "Contract Manufacturer" → "Manufacturer"
      companyWhere.businessType = { contains: business_type };
    }
    // Apply location filters (query params take precedence over interpreted)
    if (country) companyWhere.country = { contains: country };
    else if (interpreted.country)
      companyWhere.country = { contains: interpreted.country };
    if (state) companyWhere.state = { contains: state };
    else if (interpreted.state)
      companyWhere.state = { contains: interpreted.state };
    if (city) companyWhere.city = { contains: city };
    else if (interpreted.city)
      companyWhere.city = { contains: interpreted.city };

    // Even with no query, allow faceted browsing (e.g., "show all in Bengaluru")
    if (Object.keys(companyWhere).length > 0 || query === "") {
      const companies = await db.company.findMany({
        where: companyWhere,
        take: 200,
        orderBy: { popularity: "desc" },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          verified: true,
          claimed: true,
          registered: true,
          businessType: true,
          ecosystemId: true,
          industryName: true,
          categoryName: true,
          country: true,
          state: true,
          city: true,
          rating: true,
          reviewCount: true,
          productCount: true,
          serviceCount: true,
          website: true,
          logoUrl: true,
          popularity: true,
          industriesServed: true,
          marketsServed: true,
          certifications: true,
          createdAt: true,
        },
      });

      for (const c of companies) {
        const otherText = [
          c.businessType ?? "",
          c.industryName ?? "",
          c.categoryName ?? "",
          c.country ?? "",
          c.state ?? "",
          c.city ?? "",
          c.certifications ?? "",
          c.industriesServed ?? "",
          c.marketsServed ?? "",
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
              createdAt: c.createdAt,
            })
          : Math.round(
              (c.popularity ?? 0) * 50 +
                (c.verified ? 10 : 0) +
                (c.claimed ? 5 : 0),
            );

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
  }

  // ----------------------------------------------------------
  // Search products
  // ----------------------------------------------------------
  const productResults: ProductResult[] = [];
  if (type === "all" || type === "product") {
    const fields = ["name", "description", "category", "subcategory", "brand"];
    const orClauses = buildOrClauses(expandedTokens, fields);
    const where: Prisma.ProductWhereInput = {};
    if (orClauses.length > 0) {
      where.OR = orClauses as Prisma.ProductWhereInput[];
    } else if (query) {
      where.OR = fields.map(
        (f) => ({ [f]: { contains: query } }) as Prisma.ProductWhereInput,
      );
    }
    if (country) where.country = { contains: country };
    else if (interpreted.country)
      where.country = { contains: interpreted.country };
    if (city) where.city = { contains: city };
    else if (interpreted.city) where.city = { contains: interpreted.city };

    if (Object.keys(where).length > 0 || query === "") {
      const products = await db.product.findMany({
        where,
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { id: true, name: true, slug: true, popularity: true } },
        },
      });
      for (const p of products) {
        const otherText = [p.category ?? "", p.subcategory ?? "", p.brand ?? ""].join(" ");
        const relevance = query
          ? computeRelevance({
              query,
              tokens: expandedTokens,
              name: p.name,
              description: p.description,
              otherText,
              popularity: p.company?.popularity,
              createdAt: p.createdAt,
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
          company_name: p.company?.name ?? null,
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
  }

  // ----------------------------------------------------------
  // Search services
  // ----------------------------------------------------------
  const serviceResults: ServiceResult[] = [];
  if (type === "all" || type === "service") {
    const fields = ["name", "description", "category", "industryServed"];
    const orClauses = buildOrClauses(expandedTokens, fields);
    const where: Prisma.ServiceWhereInput = {};
    if (orClauses.length > 0) {
      where.OR = orClauses as unknown as Prisma.ServiceWhereInput[];
    } else if (query) {
      where.OR = fields.map(
        (f) => ({ [f]: { contains: query } }) as unknown as Prisma.ServiceWhereInput,
      );
    }
    if (country) where.country = { contains: country };
    else if (interpreted.country)
      where.country = { contains: interpreted.country };
    if (city) where.city = { contains: city };
    else if (interpreted.city) where.city = { contains: interpreted.city };

    if (Object.keys(where).length > 0 || query === "") {
      const services = await db.service.findMany({
        where,
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { id: true, name: true, slug: true, popularity: true } },
        },
      });
      for (const s of services) {
        const otherText = [s.category ?? "", s.industryServed ?? ""].join(" ");
        const relevance = query
          ? computeRelevance({
              query,
              tokens: expandedTokens,
              name: s.name,
              description: s.description,
              otherText,
              popularity: s.company?.popularity,
              createdAt: s.createdAt,
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
          company_name: s.company?.name ?? null,
          category: s.category,
          industry_served: s.industryServed,
          coverage: s.coverage,
          pricing_model: s.pricingModel,
          location: loc || null,
          relevance_score: relevance,
        });
      }
    }
  }

  // ----------------------------------------------------------
  // Search industries
  // ----------------------------------------------------------
  const industryResults: IndustryResult[] = [];
  if (type === "all" || type === "industry") {
    const fields = ["name", "description"];
    const orClauses = buildOrClauses(expandedTokens, fields);
    const where: Prisma.IndustryWhereInput = {};
    if (orClauses.length > 0) {
      where.OR = orClauses as Prisma.IndustryWhereInput[];
    } else if (query) {
      where.OR = fields.map(
        (f) => ({ [f]: { contains: query } }) as Prisma.IndustryWhereInput,
      );
    }
    if (ecosystem) where.ecosystemId = ecosystem;
    if (sector) where.sectorId = sector;
    if (category) where.categoryId = category;

    if (Object.keys(where).length > 0 || query === "") {
      const industries = await db.industry.findMany({ where, take: 50 });
      for (const ind of industries) {
        const relevance = query
          ? computeRelevance({
              query,
              tokens: expandedTokens,
              name: ind.name,
              description: ind.description,
              companyCount: ind.companyCount,
              createdAt: ind.createdAt,
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
  }

  // ----------------------------------------------------------
  // Search technologies
  // ----------------------------------------------------------
  const techResults: TechnologyResult[] = [];
  if (type === "all" || type === "technology") {
    const fields = ["name", "description", "providers", "useCases", "industries"];
    const orClauses = buildOrClauses(expandedTokens, fields);
    const where: Prisma.TechnologyWhereInput = {};
    if (orClauses.length > 0) {
      where.OR = orClauses as Prisma.TechnologyWhereInput[];
    } else if (query) {
      where.OR = fields.map(
        (f) => ({ [f]: { contains: query } }) as Prisma.TechnologyWhereInput,
      );
    }

    if (Object.keys(where).length > 0 || query === "") {
      const techs = await db.technology.findMany({ where, take: 50 });
      for (const t of techs) {
        const otherText = [t.providers ?? "", t.useCases ?? "", t.industries ?? ""].join(" ");
        const relevance = query
          ? computeRelevance({
              query,
              tokens: expandedTokens,
              name: t.name,
              description: t.description,
              otherText,
              companyCount: t.companyCount,
              createdAt: t.createdAt,
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
  }

  // ----------------------------------------------------------
  // Search locations
  // ----------------------------------------------------------
  const locationResults: LocationResult[] = [];
  if (type === "all" || type === "location") {
    const fields = ["name", "country", "state", "city", "type"];
    const orClauses = buildOrClauses(expandedTokens, fields);
    const where: Prisma.LocationWhereInput = {};
    if (orClauses.length > 0) {
      where.OR = orClauses as Prisma.LocationWhereInput[];
    } else if (query) {
      where.OR = fields.map(
        (f) => ({ [f]: { contains: query } }) as Prisma.LocationWhereInput,
      );
    }

    if (Object.keys(where).length > 0 || query === "") {
      const locs = await db.location.findMany({ where, take: 50 });
      for (const l of locs) {
        const relevance = query
          ? computeRelevance({
              query,
              tokens: expandedTokens,
              name: l.name,
              description: l.country,
              otherText: [l.state ?? "", l.city ?? "", l.type ?? ""].join(" "),
              companyCount: l.businessCount,
              createdAt: l.createdAt,
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

  // Filter out zero-relevance noise when there was a query (e.g. items that
  // matched only via a synonym expansion but scored 0)
  const filtered = query ? allResults.filter((r) => r.relevance_score > 0) : allResults;

  // Sort
  const sorted = sortResults(filtered, sort);

  // Paginate
  const total = sorted.length;
  const total_pages = Math.max(1, Math.ceil(total / limit));
  const startIdx = (page - 1) * limit;
  const pageResults = sorted.slice(startIdx, startIdx + limit);

  // ----------------------------------------------------------
  // Build facets (based on ALL matched companies, not the page slice)
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
  const knowledgePanel = pageResults.find(r => r.type === "company" && r.relevance_score > 70) ?? null;

  const topIndustries = new Set(pageResults.filter(r => r.type === "company").map(r => r.industry).filter(Boolean));
  const topCategories = new Set(pageResults.filter(r => r.type === "company").map(r => r.category).filter(Boolean));
  const currentPageIds = new Set(pageResults.map(r => r.id));

  const relatedCompanies = sorted
    .filter(r => r.type === "company" && !currentPageIds.has(r.id) &&
      ((r.industry && topIndustries.has(r.industry)) || (r.category && topCategories.has(r.category))))
    .slice(0, 5);

  const topBusinessTypes = new Set(pageResults.filter(r => r.type === "company").map(r => r.business_type).filter(Boolean));
  const relatedIds = new Set(relatedCompanies.map(r => r.id));
  const similarBusinesses = sorted
    .filter(r => r.type === "company" && !currentPageIds.has(r.id) && !relatedIds.has(r.id) &&
      r.business_type && topBusinessTypes.has(r.business_type))
    .slice(0, 5);

  const topCities = new Set(pageResults.filter(r => r.city).map(r => r.city));
  const topCountries = new Set(pageResults.filter(r => r.country).map(r => r.country));
  const similarIds = new Set(similarBusinesses.map(r => r.id));
  const nearbyBusinesses = sorted
    .filter(r => r.type === "company" && !currentPageIds.has(r.id) && !relatedIds.has(r.id) && !similarIds.has(r.id) &&
      ((r.city && topCities.has(r.city)) || (r.country && topCountries.has(r.country))))
    .slice(0, 5);

  const trendingSearches = [
    `${query} manufacturers`,
    `${query} suppliers`,
    `${query} companies in India`,
    `best ${query} companies`,
    `${query} near me`,
  ].filter(s => !s.includes("undefined")).slice(0, 5);

  const allIndustries = await db.industry.findMany({
    where: interpreted.industry ? { name: { contains: interpreted.industry } } : {},
    select: { name: true, companyCount: true },
    take: 5,
    orderBy: { companyCount: "desc" },
  });
  const relatedIndustries = allIndustries.map(i => ({ name: i.name, count: i.companyCount }));

  const { ecosystems: allEcosystems } = await import("@/data/taxonomy");
  const queryLower = query.toLowerCase();
  const matchingCategories = allEcosystems
    .flatMap(e => e.categories.flatMap(s => s.categories))
    .filter(c => c.name.toLowerCase().includes(queryLower) || c.products.some(p => p.name.toLowerCase().includes(queryLower)))
    .slice(0, 5)
    .map(c => ({ name: c.name, count: c.businessProfiles.length }));

  const exploreMore = [
    { label: "Companies", query: `${query}`, icon: "Building2" },
    { label: "Products", query: `${query}`, icon: "Package" },
    { label: "Services", query: `${query}`, icon: "Wrench" },
    { label: "Industries", query: `${query}`, icon: "BarChart3" },
  ];

  const discovery = {
    related_companies: relatedCompanies,
    similar_businesses: similarBusinesses,
    nearby_businesses: nearbyBusinesses,
    trending_searches: trendingSearches,
    related_industries: relatedIndustries,
    recommended_categories: matchingCategories,
    knowledge_panel: knowledgePanel,
    explore_more: exploreMore,
  };

  const response: SearchResponse = {
    query,
    interpreted_query: interpreted,
    filters: {
      type,
      ecosystem: ecosystem ?? null,
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

  return NextResponse.json(response, { headers: { "Cache-Control": "no-store" } });
}
