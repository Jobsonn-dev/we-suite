"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2, Package, Wrench, Factory, Cpu, MapPin,
  ArrowRight, SlidersHorizontal, Sparkles, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/search/search-input";
import { SearchFilters, SearchFiltersState } from "@/components/search/search-filters";
import { AiAnswerPanel } from "@/components/search/ai-answer-panel";
import { ResultCard } from "@/components/search/results/result-card";
import { SearchPagination } from "@/components/search/search-pagination";
import { EmptyState } from "@/components/search/empty-state";
import { LoadingState } from "@/components/search/loading-state";
import {
  Facets, InterpretedQuery, SearchResult, SearchParams, SearchResponse, ResultType,
} from "@/lib/search/server";

interface Props {
  initialQuery: string;
  initialFilters: SearchParams;
  initialResults: SearchResult[];
  interpreted: InterpretedQuery;
  related_searches: string[];
  facets: Facets;
  totalPages: number;
  total: number;
}

const TAB_LIST: { key: ResultType | "all"; label: string; icon: typeof Building2 }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "company", label: "Companies", icon: Building2 },
  { key: "product", label: "Products", icon: Package },
  { key: "service", label: "Services", icon: Wrench },
  { key: "industry", label: "Industries", icon: Factory },
  { key: "technology", label: "Technology", icon: Cpu },
  { key: "location", label: "Locations", icon: MapPin },
];

const SORT_OPTIONS = [
  { key: "relevance", label: "Relevance" },
  { key: "newest", label: "Newest" },
  { key: "recently_updated", label: "Recently Updated" },
  { key: "most_complete", label: "Most Complete" },
  { key: "az", label: "A-Z" },
];

function buildUrl(q: string, params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== "all") sp.set(k, String(v));
  }
  const str = sp.toString();
  return `/search${str ? `?${str}` : ""}`;
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

  // Hydrate initial state once on mount — already done via useState initial values

  // Keep local state in sync with URL changes (e.g. browser back/forward)
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

        // Normalize facets — the /api/search endpoint may use a slightly different
        // shape (e.g. business_types with { name } instead of { key, label },
        // verified with { verified, claimed, registered } instead of { all, ... }).
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

        // If the API didn't return facets.types, compute from results length by type
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

  function onTabChange(tab: ResultType | "all") {
    const next = { ...filters, type: tab, page: 1 };
    setFilters(next);
    updateURL(next);
    doFetch(next);
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onSortChange(sort: NonNullable<SearchParams["sort"]>) {
    const next = { ...filters, sort, page: 1 };
    setFilters(next);
    updateURL(next);
    doFetch(next);
  }

  function onApplyFilters(state: SearchFiltersState) {
    const next: SearchParams = {
      ...filters,
      type: state.type,
      ecosystem: state.ecosystem,
      sector: state.sector,
      category: state.category,
      country: state.country,
      state: state.state,
      city: state.city,
      business_type: state.business_type,
      business_size: state.business_size,
      verified: state.verified,
      sort: state.sort,
      page: 1,
    };
    setFilters(next);
    updateURL(next);
    doFetch(next);
  }

  function onResetFilters() {
    const next: SearchParams = {
      q: filters.q,
      type: "all",
      sort: "relevance",
      page: 1,
    };
    setFilters(next);
    updateURL(next);
    doFetch(next);
  }

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

  return (
    <div className="bg-background">
      {/* Search Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <SearchInput initialValue={query} autoFocus={!query} />

          {/* Quick stats */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>
              {!loading && (
                <span>
                  <span className="font-semibold text-foreground">{total.toLocaleString()}</span>{" "}
                  {total === 1 ? "result" : "results"}
                  {query && <> for &ldquo;<span className="font-medium text-foreground/80">{query}</span>&rdquo;</>}
                  {interpreted.city && <> in <span className="font-medium text-foreground/80">{interpreted.city}</span></>}
                </span>
              )}
              {loading && <span className="italic">Searching…</span>}
            </div>
            <div className="flex items-center gap-2">
              {interpreted.intent !== "General" && (
                <Badge variant="outline" className="gap-1 text-[10px] font-medium">
                  <Sparkles className="h-3 w-3" /> {interpreted.intent}
                </Badge>
              )}
              <span className="hidden sm:inline">Page {filters.page ?? 1} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs (entity type) */}
        <div ref={resultsTopRef} className="mb-4 overflow-x-auto scrollbar-thin">
          <Tabs value={(filters.type ?? "all") as string} onValueChange={(v) => onTabChange(v as ResultType | "all")}>
            <TabsList className="h-auto flex-wrap gap-1 bg-muted/50 p-1">
              {TAB_LIST.map((t) => {
                const Icon = t.icon;
                const typesMap = facets?.types ?? {};
                const count = t.key === "all"
                  ? Object.values(typesMap).reduce((a: number, b: number) => a + (b || 0), 0)
                  : typesMap[t.key as ResultType] ?? 0;
                return (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                    {count > 0 && (
                      <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-semibold text-muted-foreground">
                        {count > 999 ? `${Math.floor(count / 1000)}k` : count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Layout: filters sidebar + results */}
        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <SearchFilters
            filters={{
              q: filters.q,
              type: filters.type,
              ecosystem: filters.ecosystem,
              sector: filters.sector,
              category: filters.category,
              country: filters.country,
              state: filters.state,
              city: filters.city,
              business_type: filters.business_type,
              business_size: filters.business_size,
              verified: filters.verified,
              sort: filters.sort,
              page: filters.page,
            }}
            facets={facets}
            onApply={onApplyFilters}
            onReset={onResetFilters}
          />

          {/* Results column */}
          <div className="min-w-0 space-y-4">
            {/* Sort bar (desktop inline) + mobile filters button row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 lg:hidden">
                {/* Mobile filters button is rendered inside <SearchFilters /> */}
                <span className="text-xs text-muted-foreground">Filters</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs font-medium text-muted-foreground">Sort:</label>
                <Select
                  value={(filters.sort ?? "relevance") as string}
                  onValueChange={(v) => onSortChange(v as NonNullable<SearchParams["sort"]>)}
                >
                  <SelectTrigger id="sort-select" size="sm" className="h-8 w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Overview panel */}
            <AiAnswerPanel query={query} interpreted={interpreted} results={results} />

            {/* Results / Loading / Empty */}
            {loading ? (
              <LoadingState count={5} />
            ) : results.length === 0 ? (
              <EmptyState query={query} relatedSearches={related_searches} onReset={onResetAll} />
            ) : (
              <div className="space-y-4">
                {results.map((r, idx) => (
                  <div key={`${r.type}-${r.id}-${idx}`}>
                    <ResultCard result={r} />
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
              <div className="space-y-2 border-t border-border pt-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <TrendingUp className="h-3 w-3" /> Related searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {related_searches.map((r) => (
                    <Link
                      key={r}
                      href={`/search?q=${encodeURIComponent(r)}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground"
                    >
                      {r}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
