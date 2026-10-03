"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2, Package, Wrench, Factory, Cpu, MapPin,
  ArrowRight, X, TrendingUp, Sparkles, BadgeCheck,
  Globe, Users, Briefcase, Network, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AiAnswerPanel } from "@/components/search/ai-answer-panel";
import { ResultCard } from "@/components/search/results/result-card";
import { SearchPagination } from "@/components/search/search-pagination";
import { EmptyState } from "@/components/search/empty-state";
import { LoadingState } from "@/components/search/loading-state";
import { DiscoveryPanel } from "@/components/search/discovery-panel";
import {
  Facets, InterpretedQuery, SearchResult, SearchParams, SearchResponse, ResultType,
  DiscoveryData,
} from "@/lib/search-utils";

interface Props {
  initialQuery: string;
  initialFilters: SearchParams;
  initialResults: SearchResult[];
  interpreted: InterpretedQuery;
  related_searches: string[];
  facets: Facets;
  totalPages: number;
  total: number;
  initialDiscovery: DiscoveryData;
}

function buildUrl(q: string, params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== "all") sp.set(k, String(v));
  }
  const str = sp.toString();
  return `/search${str ? `?${str}` : ""}`;
}

// Active filter chip definitions
interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  param: string;
}

export function SearchClient({
  initialQuery,
  initialFilters,
  initialResults,
  interpreted,
  related_searches,
  facets: initialFacets,
  totalPages: initialTotalPages,
  total: initialTotal,
  initialDiscovery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchParams>(initialFilters);
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [facets, setFacets] = useState<Facets>(initialFacets);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const resultsTopRef = useRef<HTMLDivElement>(null);

  // Keep local state in sync with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    const urlType = (searchParams.get("type") ?? "all") as ResultType | "all";
    const urlSort = (searchParams.get("sort") ?? "relevance") as SearchParams["sort"];
    const urlPage = parseInt(searchParams.get("page") ?? "1", 10);

    setQuery(urlQuery);
    setFilters((prev) => ({
      ...prev,
      q: urlQuery,
      type: urlType,
      sort: urlSort,
      page: urlPage,
      ecosystem: searchParams.get("ecosystem") ?? prev.ecosystem,
      country: searchParams.get("country") ?? prev.country,
      city: searchParams.get("city") ?? prev.city,
      business_type: searchParams.get("business_type") ?? prev.business_type,
      business_size: searchParams.get("business_size") ?? prev.business_size,
      verified: searchParams.get("verified") ?? prev.verified,
      sector: searchParams.get("sector") ?? prev.sector,
      category: searchParams.get("category") ?? prev.category,
    }));
  }, [searchParams]);

  const doFetch = useCallback(
    async (nextFilters: SearchParams) => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (nextFilters.q) params.set("q", nextFilters.q);
        if (nextFilters.type && nextFilters.type !== "all") params.set("type", nextFilters.type);
        if (nextFilters.ecosystem) params.set("ecosystem", nextFilters.ecosystem);
        if (nextFilters.sector) params.set("sector", nextFilters.sector);
        if (nextFilters.category) params.set("category", nextFilters.category);
        if (nextFilters.country) params.set("country", nextFilters.country);
        if (nextFilters.state) params.set("state", nextFilters.state);
        if (nextFilters.city) params.set("city", nextFilters.city);
        if (nextFilters.business_type) params.set("business_type", nextFilters.business_type);
        if (nextFilters.business_size) params.set("business_size", nextFilters.business_size);
        if (nextFilters.verified) params.set("verified", nextFilters.verified);
        if (nextFilters.sort && nextFilters.sort !== "relevance") params.set("sort", nextFilters.sort);
        params.set("page", String(nextFilters.page ?? 1));

        const res = await fetch(`/api/search?${params.toString()}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error("Search failed");
        const data: SearchResponse = await res.json();

        const normalizedFacets: Facets = {
          ecosystems: (data.facets?.ecosystems ?? []).map((e: { id?: string; key?: string; name?: string; label?: string; count?: number }) => ({
            key: e.key ?? e.id ?? "",
            label: e.label ?? e.name ?? "",
            count: e.count ?? 0,
          })),
          business_types: (data.facets?.business_types ?? []).map((b: { name?: string; key?: string; label?: string; count?: number }) => ({
            key: b.key ?? b.name ?? "",
            label: b.label ?? b.name ?? "",
            count: b.count ?? 0,
          })),
          countries: (data.facets?.countries ?? []).map((c: { name?: string; key?: string; label?: string; count?: number }) => ({
            key: c.key ?? c.name ?? "",
            label: c.label ?? c.name ?? "",
            count: c.count ?? 0,
          })),
          cities: (data.facets?.cities ?? []).map((c: { name?: string; key?: string; label?: string; count?: number }) => ({
            key: c.key ?? c.name ?? "",
            label: c.label ?? c.name ?? "",
            count: c.count ?? 0,
          })),
          verified: {
            all: (data.facets?.verified as { all?: number; registered?: number })?.all
              ?? (data.facets?.verified as { registered?: number })?.registered
              ?? 0,
            verified: (data.facets?.verified as { verified?: number })?.verified ?? 0,
            claimed: (data.facets?.verified as { claimed?: number })?.claimed ?? 0,
          },
          types: (data.facets?.types ?? {}) as Record<ResultType, number>,
        };

        if (!data.facets?.types) {
          const counts: Record<ResultType, number> = {
            company: 0, product: 0, service: 0, industry: 0, technology: 0, location: 0,
          };
          for (const r of data.results) {
            counts[r.type] = (counts[r.type] ?? 0) + 1;
          }
          normalizedFacets.types = counts;
        }

        setResults(data.results);
        setFacets(normalizedFacets);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Search fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateURL = useCallback(
    (nextFilters: SearchParams, opts?: { scroll?: boolean }) => {
      const url = buildUrl(nextFilters.q ?? "", {
        type: nextFilters.type,
        ecosystem: nextFilters.ecosystem,
        sector: nextFilters.sector,
        category: nextFilters.category,
        country: nextFilters.country,
        state: nextFilters.state,
        city: nextFilters.city,
        business_type: nextFilters.business_type,
        business_size: nextFilters.business_size,
        verified: nextFilters.verified,
        sort: nextFilters.sort,
        page: nextFilters.page,
      });
      router.push(url, { scroll: opts?.scroll ?? false });
    },
    [router]
  );

  function onPageChange(page: number) {
    const next = { ...filters, page };
    setFilters(next);
    updateURL(next, { scroll: true });
    doFetch(next);
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onResetAll() {
    const next: SearchParams = { q: "", type: "all", sort: "relevance", page: 1 };
    setFilters(next);
    setQuery("");
    updateURL(next);
    doFetch(next);
  }

  // Remove a single filter by param key
  function removeFilter(param: string) {
    const next = { ...filters, [param]: "", page: 1 } as SearchParams;
    setFilters(next);
    updateURL(next);
    doFetch(next);
  }

  // Build active filter chips
  const activeFilters: ActiveFilter[] = [];
  if (filters.type && filters.type !== "all") {
    const typeLabel = filters.type.charAt(0).toUpperCase() + filters.type.slice(1) + "s";
    activeFilters.push({ key: "type", label: "Type", value: typeLabel, param: "type" });
  }
  if (filters.ecosystem) {
    activeFilters.push({ key: "ecosystem", label: "Ecosystem", value: filters.ecosystem, param: "ecosystem" });
  }
  if (filters.business_type) {
    activeFilters.push({ key: "business_type", label: "Business Type", value: filters.business_type, param: "business_type" });
  }
  if (filters.business_size) {
    activeFilters.push({ key: "business_size", label: "Business Size", value: filters.business_size, param: "business_size" });
  }
  if (filters.nature_of_business) {
    activeFilters.push({ key: "nature", label: "Nature of Business", value: filters.nature_of_business ?? "", param: "nature_of_business" });
  }
  if (filters.sector) {
    activeFilters.push({ key: "sector", label: "Core Sector", value: filters.sector ?? "", param: "sector" });
  }
  if (filters.category) {
    activeFilters.push({ key: "category", label: "Category", value: filters.category ?? "", param: "category" });
  }
  if (filters.country) {
    activeFilters.push({ key: "country", label: "Country", value: filters.country, param: "country" });
  }
  if (filters.city) {
    activeFilters.push({ key: "city", label: "City", value: filters.city, param: "city" });
  }
  if (filters.verified) {
    const vLabel = filters.verified === "true" ? "Verified" : filters.verified === "claimed" ? "Claimed" : "Registered";
    activeFilters.push({ key: "verified", label: "Verification", value: vLabel, param: "verified" });
  }
  if (filters.sort && filters.sort !== "relevance") {
    activeFilters.push({ key: "sort", label: "Sort", value: filters.sort, param: "sort" });
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 60/40 grid: primary results (left) + sticky discovery panel (right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] xl:grid-cols-[2fr_1fr]">
          {/* ===================== LEFT COLUMN (60%) ===================== */}
          <div className="min-w-0">
            {/* Quick stats bar */}
            <div ref={resultsTopRef} className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="text-slate-400">
                {!loading && (
                  <span>
                    <span className="font-semibold text-white">{total.toLocaleString()}</span>{" "}
                    {total === 1 ? "result" : "results"}
                    {query && <> for &ldquo;<span className="font-medium text-cyan-400">{query}</span>&rdquo;</>}
                    {interpreted.city && <> in <span className="font-medium text-white">{interpreted.city}</span></>}
                  </span>
                )}
                {loading && <span className="italic text-slate-500">Searching…</span>}
              </div>
              <div className="flex items-center gap-2">
                {interpreted.intent !== "General" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-400">
                    <Sparkles className="h-3 w-3" /> {interpreted.intent}
                  </span>
                )}
                <span className="hidden text-xs text-slate-500 sm:inline">Page {filters.page ?? 1} of {totalPages}</span>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {activeFilters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => removeFilter(f.param)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <span className="text-slate-500">{f.label}:</span>
                    <span>{f.value}</span>
                    <X className="h-3 w-3 text-slate-500 transition-colors group-hover:text-red-400" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onResetAll}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:text-red-300"
                >
                  <X className="h-3 w-3" /> Clear all
                </button>
              </div>
            )}

            {/* AI Overview panel */}
            <AiAnswerPanel query={query} interpreted={interpreted} results={results} />

            {/* Results / Loading / Empty */}
            {loading ? (
              <LoadingState count={5} />
            ) : results.length === 0 ? (
              <EmptyState query={query} relatedSearches={related_searches} onReset={onResetAll} />
            ) : (
              <div className="space-y-3">
                {results.map((r, idx) => (
                  <div
                    key={`${r.type}-${r.id}-${idx}`}
                    style={{ animation: `fadeInUp .3s ease-out ${idx * 0.05}s both` }}
                  >
                    <ResultCard result={r} query={query} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && results.length > 0 && (
              <SearchPagination
                page={filters.page ?? 1}
                totalPages={totalPages}
                onChange={onPageChange}
              />
            )}

            {/* Related searches */}
            {!loading && related_searches.length > 0 && results.length > 0 && (
              <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <TrendingUp className="h-3 w-3" /> Related searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {related_searches.map((r) => (
                    <Link
                      key={r}
                      href={`/search?q=${encodeURIComponent(r)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/30 hover:bg-cyan-500/5 hover:text-cyan-400"
                    >
                      {r}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===================== RIGHT COLUMN (40%) ===================== */}
          {/* Sticky Intelligent Discovery Panel — hidden on mobile/tablet, shown on lg+ */}
          <aside className="hidden lg:block">
            <div className="sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin pr-1">
              <DiscoveryPanel discovery={initialDiscovery} query={query} />
            </div>
          </aside>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
