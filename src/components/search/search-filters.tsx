"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, RotateCcw, X } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ecosystems } from "@/data/taxonomy";
import { Facets, ResultType, SearchSort } from "@/lib/search/server";

export interface SearchFiltersState {
  q?: string;
  type?: ResultType | "all";
  ecosystem?: string;
  sector?: string;
  category?: string;
  country?: string;
  state?: string;
  city?: string;
  business_type?: string;
  business_size?: string;
  verified?: string;
  sort?: SearchSort;
  page?: number;
}

interface Props {
  filters: SearchFiltersState;
  facets: Facets;
  onApply: (next: SearchFiltersState) => void;
  onReset: () => void;
  className?: string;
}

const ENTITY_TYPES: { key: ResultType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "company", label: "Companies" },
  { key: "product", label: "Products" },
  { key: "service", label: "Services" },
  { key: "industry", label: "Industries" },
  { key: "technology", label: "Technologies" },
  { key: "location", label: "Locations" },
];

const BUSINESS_TYPES = [
  "Manufacturer", "Supplier", "Distributor", "Wholesaler",
  "Service Provider", "Consultant", "Startup", "Enterprise",
];

const BUSINESS_SIZES = ["Startup", "Small", "Medium", "Large", "Enterprise"];

const VERIFICATION_OPTIONS = [
  { key: "all", label: "All Businesses" },
  { key: "true", label: "Verified" },
  { key: "claimed", label: "Claimed" },
  { key: "registered", label: "Registered" },
];

const SORT_OPTIONS: { key: SearchSort; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "newest", label: "Newest" },
  { key: "recently_updated", label: "Recently Updated" },
  { key: "most_complete", label: "Most Complete" },
  { key: "nearest", label: "Nearest" },
  { key: "az", label: "A-Z" },
];

export function SearchFilters({ filters, facets, onApply, onReset, className }: Props) {
  const [local, setLocal] = useState<SearchFiltersState>(filters);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Reset local when parent filters change
  // (Don't resync on every render; rely on controlled local state during typing.)

  const updateLocal = useCallback(<K extends keyof SearchFiltersState>(key: K, value: SearchFiltersState[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }, []);

  // For business_type, multiple selections allowed (we'll send the first one selected; toggling updates set)
  const selectedTypes = useMemo(() => {
    const set = new Set<string>();
    if (local.business_type) {
      for (const t of local.business_type.split(",").map((s) => s.trim()).filter(Boolean)) set.add(t);
    }
    return set;
  }, [local.business_type]);

  const selectedSizes = useMemo(() => {
    const set = new Set<string>();
    if (local.business_size) {
      for (const s of local.business_size.split(",").map((s) => s.trim()).filter(Boolean)) set.add(s);
    }
    return set;
  }, [local.business_size]);

  function toggleType(t: string) {
    const next = new Set(selectedTypes);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    updateLocal("business_type", Array.from(next).join(","));
  }
  function toggleSize(s: string) {
    const next = new Set(selectedSizes);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    updateLocal("business_size", Array.from(next).join(","));
  }

  function apply() {
    const next = { ...local, page: 1 };
    onApply(next);
    setMobileOpen(false);
  }

  function reset() {
    const cleared: SearchFiltersState = {
      q: filters.q,
      type: "all",
      sort: "relevance",
      page: 1,
    };
    setLocal(cleared);
    onReset();
    setMobileOpen(false);
  }

  const FilterContent = (
    <div className="space-y-1">
      {/* Ecosystem */}
      <Accordion type="multiple" defaultValue={["eco", "type", "bt", "size", "loc", "ver", "sort"]} className="w-full">
        <AccordionItem value="eco">
          <AccordionTrigger className="text-sm font-semibold">Ecosystem</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={local.ecosystem ?? ""}
              onValueChange={(v) => updateLocal("ecosystem", v === "all" ? "" : v)}
              className="gap-2"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem id="eco-all" value="" />
                <span className="text-sm">All Ecosystems</span>
              </label>
              {ecosystems.map((e) => (
                <label key={e.id} className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem id={`eco-${e.id}`} value={e.id} />
                  <span className="text-sm">{e.shortName}</span>
                </label>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Entity Type (synced with tabs) */}
        <AccordionItem value="type">
          <AccordionTrigger className="text-sm font-semibold">Entity Type</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={local.type ?? "all"}
              onValueChange={(v) => updateLocal("type", v as ResultType | "all")}
              className="gap-2"
            >
              {ENTITY_TYPES.map((t) => {
                const typesMap = facets?.types ?? ({} as Record<ResultType, number>);
                const count = t.key === "all"
                  ? Object.values(typesMap).reduce((a: number, b: number) => a + (b || 0), 0)
                  : typesMap[t.key as ResultType] ?? 0;
                return (
                  <label key={t.key} className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <RadioGroupItem id={`type-${t.key}`} value={t.key} />
                    <span className="text-sm">{t.label}</span>
                  </span>
                  {t.key !== "all" && count > 0 && (
                    <span className="text-[11px] font-medium text-muted-foreground">{count}</span>
                  )}
                </label>
                );
              })}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Business Type */}
        <AccordionItem value="bt">
          <AccordionTrigger className="text-sm font-semibold">Business Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {BUSINESS_TYPES.map((bt) => {
                const facet = (facets?.business_types ?? []).find((f) => (f.label ?? f.key) === bt);
                const count = facet?.count ?? 0;
                const checked = selectedTypes.has(bt);
                return (
                  <label key={bt} className="flex items-center justify-between gap-2 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Checkbox checked={checked} onCheckedChange={() => toggleType(bt)} id={`bt-${bt}`} />
                      <span className="text-sm">{bt}</span>
                    </span>
                    {count > 0 && <span className="text-[11px] text-muted-foreground">{count}</span>}
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Business Size */}
        <AccordionItem value="size">
          <AccordionTrigger className="text-sm font-semibold">Business Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {BUSINESS_SIZES.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedSizes.has(s)} onCheckedChange={() => toggleSize(s)} id={`size-${s}`} />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location */}
        <AccordionItem value="loc">
          <AccordionTrigger className="text-sm font-semibold">Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="country-select" className="text-xs text-muted-foreground">Country</Label>
                <Select value={local.country ?? "all"} onValueChange={(v) => updateLocal("country", v === "all" ? "" : v)}>
                  <SelectTrigger id="country-select" className="w-full">
                    <SelectValue placeholder="Any country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any country</SelectItem>
                    {(facets?.countries ?? []).map((c) => (
                      <SelectItem key={c.key} value={c.key}>{c.label} ({c.count})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city-select" className="text-xs text-muted-foreground">City</Label>
                <Select value={local.city ?? "all"} onValueChange={(v) => updateLocal("city", v === "all" ? "" : v)}>
                  <SelectTrigger id="city-select" className="w-full">
                    <SelectValue placeholder="Any city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any city</SelectItem>
                    {(facets?.cities ?? []).map((c) => (
                      <SelectItem key={c.key} value={c.key}>{c.label} ({c.count})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Verification */}
        <AccordionItem value="ver">
          <AccordionTrigger className="text-sm font-semibold">Verification</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={local.verified ?? "all"}
              onValueChange={(v) => updateLocal("verified", v === "all" ? "" : v)}
              className="gap-2"
            >
              {VERIFICATION_OPTIONS.map((opt) => (
                <label key={opt.key} className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <RadioGroupItem id={`ver-${opt.key}`} value={opt.key} />
                    <span className="text-sm">{opt.label}</span>
                  </span>
                  {opt.key === "true" && (facets?.verified?.verified ?? 0) > 0 && (
                    <span className="text-[11px] text-muted-foreground">{facets?.verified?.verified}</span>
                  )}
                  {opt.key === "claimed" && (facets?.verified?.claimed ?? 0) > 0 && (
                    <span className="text-[11px] text-muted-foreground">{facets?.verified?.claimed}</span>
                  )}
                  {opt.key === "all" && (facets?.verified?.all ?? 0) > 0 && (
                    <span className="text-[11px] text-muted-foreground">{facets?.verified?.all}</span>
                  )}
                </label>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Sort */}
        <AccordionItem value="sort">
          <AccordionTrigger className="text-sm font-semibold">Sort By</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={local.sort ?? "relevance"}
              onValueChange={(v) => updateLocal("sort", v as SearchSort)}
              className="gap-2"
            >
              {SORT_OPTIONS.map((s) => (
                <label key={s.key} className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem id={`sort-${s.key}`} value={s.key} />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-3" />

      <div className="flex flex-col gap-2">
        <Button onClick={apply} className="w-full">Apply Filters</Button>
        <Button onClick={reset} variant="outline" className="w-full gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:block", className)}>
        <div className="sticky top-[76px] max-h-[calc(100vh-92px)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-soft scrollbar-thin">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>
          </div>
          {FilterContent}
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden gap-2" aria-label="Open filters">
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {(() => {
              const activeCount = Object.keys(local).filter((k) => k !== "q" && k !== "sort" && k !== "page" && local[k as keyof SearchFiltersState]).length;
              return activeCount > 0 ? (
                <Badge key="filter-count" className="ml-1 bg-primary text-primary-foreground">
                  {activeCount}
                </Badge>
              ) : null;
            })()}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-2 h-[calc(100vh-80px)] pr-2">
            {FilterContent}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
