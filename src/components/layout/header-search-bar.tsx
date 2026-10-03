"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Mic, ArrowRight, X, ChevronDown, ChevronUp,
  Layers, Building2, Briefcase, Package, Cpu, MapPin,
  Globe, Factory, TrendingUp, Users, Sparkles, Wrench, BarChart3,
  SlidersHorizontal, type LucideIcon,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ecosystems, getEcosystem } from "@/data/taxonomy";

// ============================================================
// Header Search Bar + Category Pills + Advanced Filters
//
// Layout:
//   1. Search bar (pill-shaped, dark)
//   2. Category pills row (All / Companies / Products / Services /
//      Industries / Technology / Locations) — icon + label, no chevron
//   3. "Advanced Search" button → expands to show dropdown filters:
//      Ecosystem, Business Type, Nature of Business, Core Sector,
//      Categories, Business Size, Country, City, Sort By, Digital & AI
// ============================================================

export type SearchCategory = "all" | "company" | "product" | "service" | "industry" | "technology" | "location";
export type SearchSort = "relevance" | "newest" | "recently_updated" | "most_complete" | "nearest" | "az";

interface FilterState {
  q: string;
  type: SearchCategory;
  ecosystem: string;
  business_type: string;
  nature_of_business: string;
  sector: string;
  category: string;
  business_size: string;
  country: string;
  city: string;
  sort: SearchSort;
  digital_ai: boolean;
}

const CATEGORY_PILLS: { key: SearchCategory; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "company", label: "Companies", icon: Building2 },
  { key: "product", label: "Products", icon: Package },
  { key: "service", label: "Services", icon: Wrench },
  { key: "industry", label: "Industries", icon: BarChart3 },
  { key: "technology", label: "Technology", icon: Cpu },
  { key: "location", label: "Locations", icon: MapPin },
];

const BUSINESS_TYPES = [
  "Manufacturer", "Supplier", "Distributor", "Wholesaler",
  "Service Provider", "Consultant", "Startup", "Enterprise",
];

const NATURE_OF_BUSINESS = [
  "Private Limited", "Public Limited", "LLP / Partnership",
  "Proprietorship", "Government / PSU", "Non-Profit / NGO",
];

const BUSINESS_SIZES = ["Startup", "Small", "Medium", "Large", "Enterprise"];

const SORT_OPTIONS: { key: SearchSort; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "newest", label: "Newest" },
  { key: "recently_updated", label: "Recently Updated" },
  { key: "most_complete", label: "Most Complete" },
  { key: "nearest", label: "Nearest" },
  { key: "az", label: "A-Z" },
];

const COUNTRIES = [
  "India", "USA", "United Kingdom", "United Arab Emirates",
  "Singapore", "Germany", "Australia", "Canada", "Japan", "China",
];

const CITIES = [
  "Bengaluru", "Mumbai", "Pune", "Chennai", "Hyderabad", "Delhi",
  "Gurugram", "Ahmedabad", "Jaipur",
  "San Francisco", "Austin", "Detroit", "New York",
  "Hamburg", "Munich", "London", "Singapore", "Tokyo", "Dubai", "Shanghai",
];

// Compact pill-shaped dropdown — transparent, [Icon] [Value] [Chevron]
function FilterDropdown({
  value,
  placeholder,
  options,
  onChange,
  icon: Icon,
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon?: LucideIcon;
}) {
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : v)}>
      <SelectTrigger
        className={cn(
          "h-8 w-auto gap-1.5 rounded-full border-transparent bg-transparent px-3 py-1 text-xs font-medium text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0",
          "[&_[data-slot=select-icon]_svg]:opacity-100 [&_[data-slot=select-icon]_svg]:text-slate-400 [&_[data-slot=select-icon]_svg]:size-3",
        )}
        aria-label={placeholder}
      >
        {Icon && <Icon className="size-3.5 shrink-0 text-slate-300" />}
        <span className="whitespace-nowrap">{displayLabel}</span>
      </SelectTrigger>
      <SelectContent className="max-h-72 border-white/10 bg-[#1a1f2e] text-white">
        <SelectItem value="all" className="text-xs text-slate-400 focus:bg-white/10 focus:text-white">
          {placeholder}
        </SelectItem>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-xs text-slate-200 focus:bg-white/10 focus:text-white"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialType = (searchParams.get("type") as SearchCategory | null) ?? "all";
  const initialSort = (searchParams.get("sort") as SearchSort | null) ?? "relevance";
  const [query, setQuery] = useState(initialQuery);
  const [listening, setListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    q: initialQuery,
    type: initialType,
    ecosystem: searchParams.get("ecosystem") ?? "",
    business_type: searchParams.get("business_type") ?? "",
    nature_of_business: searchParams.get("nature_of_business") ?? "",
    sector: searchParams.get("sector") ?? "",
    category: searchParams.get("category") ?? "",
    business_size: searchParams.get("business_size") ?? "",
    country: searchParams.get("country") ?? "",
    city: searchParams.get("city") ?? "",
    sort: initialSort,
    digital_ai: searchParams.get("ecosystem") === "technology-ai",
  });

  // Auto-expand advanced if any advanced filter is active on load (lazy init)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(() => {
    const eco = searchParams.get("ecosystem");
    const bType = searchParams.get("business_type");
    const nature = searchParams.get("nature_of_business");
    const sector = searchParams.get("sector");
    const cat = searchParams.get("category");
    const bSize = searchParams.get("business_size");
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const sort = searchParams.get("sort");
    return !!(eco || bType || nature || sector || cat || bSize || country || city || (sort && sort !== "relevance") || eco === "technology-ai");
  });

  // Cascading: sector options based on ecosystem
  const sectorOptions = useMemo(() => {
    if (!filters.ecosystem) {
      return ecosystems.flatMap((e) => e.categories).map((s) => ({ value: s.id, label: s.name }));
    }
    const eco = getEcosystem(filters.ecosystem);
    return (eco?.categories ?? []).map((s) => ({ value: s.id, label: s.name }));
  }, [filters.ecosystem]);

  // Cascading: category options based on ecosystem + sector
  const categoryOptions = useMemo(() => {
    if (!filters.ecosystem) {
      return ecosystems.flatMap((e) => e.categories).flatMap((s) => s.categories).map((c) => ({ value: c.id, label: c.name }));
    }
    const eco = getEcosystem(filters.ecosystem);
    if (!eco) return [];
    if (!filters.sector) {
      return eco.categories.flatMap((s) => s.categories).map((c) => ({ value: c.id, label: c.name }));
    }
    const sector = eco.categories.find((s) => s.id === filters.sector);
    return (sector?.categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  }, [filters.ecosystem, filters.sector]);

  // Keyboard shortcut: "/" or Cmd/Ctrl+K to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(overrides?: Partial<FilterState>) {
    const next = { ...filters, ...overrides, q: query.trim() };
    setFocused(false);
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.type && next.type !== "all") params.set("type", next.type);
    if (next.ecosystem) params.set("ecosystem", next.ecosystem);
    if (next.sector) params.set("sector", next.sector);
    if (next.category) params.set("category", next.category);
    if (next.business_type) params.set("business_type", next.business_type);
    if (next.nature_of_business) params.set("nature_of_business", next.nature_of_business);
    if (next.business_size) params.set("business_size", next.business_size);
    if (next.country) params.set("country", next.country);
    if (next.city) params.set("city", next.city);
    if (next.sort && next.sort !== "relevance") params.set("sort", next.sort);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go();
  }

  function selectCategory(cat: SearchCategory) {
    setFilters((prev) => ({ ...prev, type: cat }));
    go({ type: cat });
  }

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const overrides: Partial<FilterState> = { [key]: value };
    if (key === "ecosystem") {
      overrides.sector = "";
      overrides.category = "";
      overrides.digital_ai = value === "technology-ai";
    }
    if (key === "sector") {
      overrides.category = "";
    }
    if (key === "digital_ai") {
      if (value) {
        overrides.ecosystem = "technology-ai";
        overrides.sector = "";
        overrides.category = "";
      } else {
        overrides.ecosystem = "";
      }
    }
    setFilters((prev) => ({ ...prev, ...overrides }));
    go(overrides);
  }

  function startVoice() {
    type SpeechRecognitionLike = {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      start: () => void;
      stop: () => void;
      onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
    };
    const SR =
      (typeof window !== "undefined" &&
        ((window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      alert("Voice search is not supported in your browser. Please use Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      go({ q: transcript });
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  function resetFilters() {
    const cleared: FilterState = {
      q: query,
      type: "all",
      ecosystem: "",
      business_type: "",
      nature_of_business: "",
      sector: "",
      category: "",
      business_size: "",
      country: "",
      city: "",
      sort: "relevance",
      digital_ai: false,
    };
    setFilters(cleared);
    go(cleared);
  }

  const activeAdvancedCount = [
    filters.ecosystem, filters.business_type, filters.nature_of_business,
    filters.business_size, filters.sector, filters.category,
    filters.country, filters.city,
  ].filter(Boolean).length
    + (filters.sort !== "relevance" ? 1 : 0)
    + (filters.digital_ai ? 1 : 0);

  return (
    <div ref={ref} className="w-full">
      {/* ── Search bar (pill-shaped, dark) ── */}
      <form onSubmit={submit}>
        <div
          className={cn(
            "relative flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1f2e] pl-4 pr-1.5 py-1.5 transition-all sm:py-2",
            focused
              ? "border-cyan-400/50 shadow-[0_0_0_4px_rgba(34,211,238,0.12)] shadow-lg"
              : "hover:border-white/20",
          )}
        >
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search companies, products, services or industries..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-slate-400 focus:outline-none sm:text-base"
            aria-label="Search"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="hidden rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white sm:inline-flex"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={startVoice}
            className={cn(
              "hidden rounded-full p-2 transition-colors sm:inline-flex",
              listening ? "animate-pulse bg-red-500/20 text-red-400" : "text-slate-400 hover:bg-white/10 hover:text-white",
            )}
            aria-label="Voice search"
          >
            <Mic className="h-4.5 w-4.5" />
          </button>
          <button
            type="submit"
            disabled={!query.trim()}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-600 px-4 text-sm font-semibold text-white transition-all hover:bg-slate-500 sm:px-5",
              !query.trim() && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* ── Row 1: Category pills (All / Companies / Products / Services / Industries / Technology / Locations) ──
          Icon + label, no chevron — matches target image */}
      <div className="mt-1.5 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORY_PILLS.map((cat) => {
          const Icon = cat.icon;
          const isActive = filters.type === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectCategory(cat.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:text-[13px]",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
              aria-pressed={isActive}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}

        {/* ── "Advanced Search" button — expands to show dropdown filters ── */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:text-[13px]",
            showAdvanced
              ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white",
          )}
          aria-expanded={showAdvanced}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="whitespace-nowrap">Advanced Search</span>
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {activeAdvancedCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-cyan-950">
              {activeAdvancedCount}
            </span>
          )}
        </button>

        {/* Clear button when advanced filters are active */}
        {activeAdvancedCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/25"
          >
            <X className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Clear</span>
          </button>
        )}
      </div>

      {/* ── Row 2: Advanced dropdown filters (hidden by default, shown when "Advanced Search" is clicked) ── */}
      {showAdvanced && (
        <div
          className="mt-1 flex flex-wrap items-center gap-1 overflow-x-auto rounded-lg border border-white/10 bg-[#131826]/80 p-2 scrollbar-thin"
          style={{ animation: "fadeIn .2s ease-out" }}
        >
          {/* Ecosystem */}
          <FilterDropdown
            icon={Globe}
            value={filters.ecosystem}
            placeholder="All Ecosystems"
            options={ecosystems.map((e) => ({ value: e.id, label: e.shortName }))}
            onChange={(v) => updateFilter("ecosystem", v)}
          />

          {/* Business Type */}
          <FilterDropdown
            icon={Building2}
            value={filters.business_type}
            placeholder="Business Type"
            options={BUSINESS_TYPES.map((b) => ({ value: b, label: b }))}
            onChange={(v) => updateFilter("business_type", v)}
          />

          {/* Nature of Business */}
          <FilterDropdown
            icon={Briefcase}
            value={filters.nature_of_business}
            placeholder="Nature of Business"
            options={NATURE_OF_BUSINESS.map((b) => ({ value: b, label: b }))}
            onChange={(v) => updateFilter("nature_of_business", v)}
          />

          {/* Core Sector (cascading) */}
          <FilterDropdown
            icon={Factory}
            value={filters.sector}
            placeholder="Core Sector"
            options={sectorOptions}
            onChange={(v) => updateFilter("sector", v)}
          />

          {/* Categories (cascading) */}
          <FilterDropdown
            icon={Package}
            value={filters.category}
            placeholder="Categories"
            options={categoryOptions}
            onChange={(v) => updateFilter("category", v)}
          />

          {/* Business Size */}
          <FilterDropdown
            icon={Users}
            value={filters.business_size}
            placeholder="Business Size"
            options={BUSINESS_SIZES.map((b) => ({ value: b, label: b }))}
            onChange={(v) => updateFilter("business_size", v)}
          />

          {/* Country */}
          <FilterDropdown
            icon={Globe}
            value={filters.country}
            placeholder="Country"
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            onChange={(v) => updateFilter("country", v)}
          />

          {/* City */}
          <FilterDropdown
            icon={MapPin}
            value={filters.city}
            placeholder="City"
            options={CITIES.map((c) => ({ value: c, label: c }))}
            onChange={(v) => updateFilter("city", v)}
          />

          {/* Sort By */}
          <FilterDropdown
            icon={TrendingUp}
            value={filters.sort === "relevance" ? "" : filters.sort}
            placeholder="Sort By"
            options={SORT_OPTIONS.filter((s) => s.key !== "relevance").map((s) => ({ value: s.key, label: s.label }))}
            onChange={(v) => updateFilter("sort", (v || "relevance") as SearchSort)}
          />

          {/* Digital & AI quick toggle */}
          <button
            type="button"
            onClick={() => updateFilter("digital_ai", !filters.digital_ai)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all",
              filters.digital_ai
                ? "bg-cyan-500/20 text-cyan-300 shadow-sm ring-1 ring-cyan-400/40"
                : "bg-transparent text-slate-300 hover:bg-white/10 hover:text-white",
            )}
            aria-pressed={filters.digital_ai}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Digital &amp; AI</span>
          </button>
        </div>
      )}
    </div>
  );
}
