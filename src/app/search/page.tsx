import { Suspense } from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { runSearch, SearchParams } from "@/lib/search/server";
import { PageShell } from "@/components/layout/page-shell";
import { SearchClient } from "@/components/search/search-client";

type SearchParamsType = Promise<{
  q?: string;
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
  page?: string;
  limit?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsType;
}): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const title = q ? `Search: ${q} — WEBUOS` : "Search — WEBUOS";
  const description = q
    ? `Discover companies, products, services, industries and technologies matching "${q}" on WEBUOS — the global business discovery platform.`
    : "Search the WEBUOS global business index for companies, products, services, industries and technologies.";

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") ?? "webuos.com";
  const proto = reqHeaders.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;
  const path = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
  const canonicalUrl = `${origin}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WEBUOS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const sp = await searchParams;

  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const limit = sp.limit ? parseInt(sp.limit, 10) : 10;

  const params: SearchParams = {
    q: sp.q ?? "",
    type: sp.type ?? "all",
    ecosystem: sp.ecosystem,
    sector: sp.sector,
    category: sp.category,
    country: sp.country,
    state: sp.state,
    city: sp.city,
    business_type: sp.business_type,
    business_size: sp.business_size,
    verified: sp.verified,
    sort: sp.sort ?? "relevance",
    page,
    limit,
  };

  const data = await runSearch(params);

  // Construct a complete filters object from the URL params (the backend's
  // `runSearch` may return a partial `filters` field — we always want the
  // full set so the client component can hydrate state correctly).
  const initialFilters: SearchParams = { ...params };

  return (
    <PageShell>
      <Suspense fallback={<div className="container mx-auto py-12 text-center text-sm text-muted-foreground">Loading search results...</div>}>
        <SearchClient
          initialQuery={data.query}
          initialFilters={initialFilters}
          initialResults={data.results}
          interpreted={data.interpreted_query as never}
          related_searches={data.related_searches}
          facets={data.facets as never}
          totalPages={data.total_pages}
          total={data.total}
          initialDiscovery={data.discovery}
        />
      </Suspense>
    </PageShell>
  );
}

