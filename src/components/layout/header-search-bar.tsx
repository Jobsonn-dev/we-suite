"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Mic, ArrowRight, X, ChevronDown, ChevronUp,
  Layers, Building2, Briefcase, Package, Cpu, MapPin,
  Globe, Factory, TrendingUp, Users, Sparkles, Wrench, BarChart3,
  SlidersHorizontal, Network, FileText, BadgeCheck, Layers3, ListTree,
  MapPinned, type LucideIcon,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ecosystems, getEcosystem } from "@/data/taxonomy";

// ============================================================
// Header Search Bar + Dropdown Filters
//
// Layout:
//   Row 1 (always visible): Category pills + Business Type + Business Size + Advanced Search
//   Row 2 (expandable): Nature of Business → Eco systems → Industry Sector →
//     Core Category → Categories → Sub Category → Country → Region → City →
//     Verification → Sort By
//
// Cascading validation:
//   Eco system → Industry Sector → Core Category → Categories → Sub Category
// ============================================================

export type SearchCategory = "all" | "company" | "product" | "service" | "industry" | "technology" | "location";
export type SearchSort = "relevance" | "newest" | "recently_updated" | "most_complete" | "nearest" | "az";

interface FilterState {
  q: string;
  type: SearchCategory;
  ecosystem: string;
  business_type: string;
  nature_of_business: string;
  industry_sector: string;     // was "sector" — renamed
  core_category: string;       // NEW — between sector and category
  category: string;
  sub_category: string;         // NEW — after category
  business_size: string;
  country: string;
  region: string;              // NEW — after country
  city: string;
  sort: SearchSort;
  verified: string;
  digital_ai: boolean;
}

const CATEGORY_PILLS: { key: SearchCategory; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "company", label: "Companies", icon: Building2 },
  { key: "product", label: "Products", icon: Package },
  { key: "service", label: "Services", icon: Wrench },
  { key: "industry", label: "Industries", icon: BarChart3 },
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

const VERIFICATION_OPTIONS = [
  { value: "true", label: "Verified" },
  { value: "claimed", label: "Claimed" },
  { value: "registered", label: "Registered" },
];

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

// Region options — based on selected country
const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  "India": ["North India", "South India", "East India", "West India", "Central India"],
  "USA": ["West Coast", "East Coast", "Midwest", "South", "Southwest", "Pacific Northwest"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
  "Singapore": ["Central Region", "East Region", "North Region", "West Region", "North-East Region"],
  "Germany": ["Bavaria", "Berlin", "Hamburg", "Hesse", "Saxony", "North Rhine-Westphalia"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  "Japan": ["Kanto", "Kansai", "Chubu", "Tohoku", "Kyushu"],
  "China": ["Beijing", "Shanghai", "Guangdong", "Zhejiang", "Jiangsu"],
};

const CITIES = [
  "Bengaluru", "Mumbai", "Pune", "Chennai", "Hyderabad", "Delhi",
  "Gurugram", "Ahmedabad", "Jaipur",
  "San Francisco", "Austin", "Detroit", "New York",
  "Hamburg", "Munich", "London", "Singapore", "Tokyo", "Dubai", "Shanghai",
];

// ── Shared state hook (so both components share the same filters) ──
function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialType = (searchParams.get("type") as SearchCategory | null) ?? "all";
  const initialSort = (searchParams.get("sort") as SearchSort | null) ?? "relevance";

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    q: initialQuery,
    type: initialType,
    ecosystem: searchParams.get("ecosystem") ?? "",
    business_type: searchParams.get("business_type") ?? "",
    nature_of_business: searchParams.get("nature_of_business") ?? "",
    industry_sector: searchParams.get("sector") ?? "",
    core_category: searchParams.get("core_category") ?? "",
    category: searchParams.get("category") ?? "",
    sub_category: searchParams.get("sub_category") ?? "",
    business_size: searchParams.get("business_size") ?? "",
    country: searchParams.get("country") ?? "",
    region: searchParams.get("region") ?? "",
    city: searchParams.get("city") ?? "",
    sort: initialSort,
    verified: searchParams.get("verified") ?? "",
    digital_ai: searchParams.get("ecosystem") === "technology-ai",
  });

  const [showAdvanced, setShowAdvanced] = useState<boolean>(() => {
    const sp = searchParams;
    return !!(sp.get("ecosystem") || sp.get("business_type") || sp.get("nature_of_business") ||
      sp.get("sector") || sp.get("core_category") || sp.get("category") || sp.get("sub_category") ||
      sp.get("business_size") || sp.get("country") || sp.get("region") || sp.get("city") ||
      (sp.get("sort") && sp.get("sort") !== "relevance") || sp.get("verified"));
  });

  // ── Cascading options ──

  // Industry Sector options — based on Eco system selection
  const industrySectorOptions = useMemo(() => {
    if (!filters.ecosystem) return [];
    const eco = getEcosystem(filters.ecosystem);
    return (eco?.categories ?? []).map((s) => ({ value: s.id, label: s.name }));
  }, [filters.ecosystem]);

  // Core Category options — based on Industry Sector selection
  const coreCategoryOptions = useMemo(() => {
    if (!filters.ecosystem || !filters.industry_sector) return [];
    const eco = getEcosystem(filters.ecosystem);
    const sector = eco?.categories.find((s) => s.id === filters.industry_sector);
    return (sector?.categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  }, [filters.ecosystem, filters.industry_sector]);

  // Categories options — based on Core Category (uses products from taxonomy)
  const categoryOptions = useMemo(() => {
    if (!filters.ecosystem || !filters.industry_sector || !filters.core_category) return [];
    const eco = getEcosystem(filters.ecosystem);
    const sector = eco?.categories.find((s) => s.id === filters.industry_sector);
    const coreCat = sector?.categories.find((c) => c.id === filters.core_category);
    if (!coreCat) return [];
    // Use products as Categories
    return coreCat.products.map((p) => ({ value: p.name, label: p.name }));
  }, [filters.ecosystem, filters.industry_sector, filters.core_category]);

  // Sub Category options — based on Category (uses services from taxonomy)
  const subCategoryOptions = useMemo(() => {
    if (!filters.ecosystem || !filters.industry_sector || !filters.core_category || !filters.category) return [];
    const eco = getEcosystem(filters.ecosystem);
    const sector = eco?.categories.find((s) => s.id === filters.industry_sector);
    const coreCat = sector?.categories.find((c) => c.id === filters.core_category);
    if (!coreCat) return [];
    // Use services as Sub Categories
    return coreCat.services.map((s) => ({ value: s.name, label: s.name }));
  }, [filters.ecosystem, filters.industry_sector, filters.core_category, filters.category]);

  // Region options — based on Country
  const regionOptions = useMemo(() => {
    if (!filters.country) return [];
    return (REGIONS_BY_COUNTRY[filters.country] ?? []).map((r) => ({ value: r, label: r }));
  }, [filters.country]);

  function go(overrides?: Partial<FilterState>) {
    const next = { ...filters, ...overrides, q: query.trim() };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.type && next.type !== "all") params.set("type", next.type);
    if (next.ecosystem) params.set("ecosystem", next.ecosystem);
    if (next.industry_sector) params.set("sector", next.industry_sector);
    if (next.core_category) params.set("core_category", next.core_category);
    if (next.category) params.set("category", next.category);
    if (next.sub_category) params.set("sub_category", next.sub_category);
    if (next.business_type) params.set("business_type", next.business_type);
    if (next.nature_of_business) params.set("nature_of_business", next.nature_of_business);
    if (next.business_size) params.set("business_size", next.business_size);
    if (next.country) params.set("country", next.country);
    if (next.region) params.set("region", next.region);
    if (next.city) params.set("city", next.city);
    if (next.sort && next.sort !== "relevance") params.set("sort", next.sort);
    if (next.verified) params.set("verified", next.verified);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function selectCategory(cat: SearchCategory) {
    setFilters((prev) => ({ ...prev, type: cat }));
    go({ type: cat });
  }

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const overrides: Partial<FilterState> = { [key]: value };

    // ── Cascading reset logic ──
    // Eco system → resets Industry Sector, Core Category, Categories, Sub Category
    if (key === "ecosystem") {
      overrides.industry_sector = "";
      overrides.core_category = "";
      overrides.category = "";
      overrides.sub_category = "";
      overrides.digital_ai = value === "technology-ai";
    }
    // Industry Sector → resets Core Category, Categories, Sub Category
    if (key === "industry_sector") {
      overrides.core_category = "";
      overrides.category = "";
      overrides.sub_category = "";
    }
    // Core Category → resets Categories, Sub Category
    if (key === "core_category") {
      overrides.category = "";
      overrides.sub_category = "";
    }
    // Category → resets Sub Category
    if (key === "category") {
      overrides.sub_category = "";
    }
    // Country → resets Region
    if (key === "country") {
      overrides.region = "";
    }
    // Digital & AI toggle
    if (key === "digital_ai") {
      if (value) {
        overrides.ecosystem = "technology-ai";
        overrides.industry_sector = "";
        overrides.core_category = "";
        overrides.category = "";
        overrides.sub_category = "";
      } else {
        overrides.ecosystem = "";
      }
    }
    setFilters((prev) => ({ ...prev, ...overrides }));
    go(overrides);
  }

  function resetFilters() {
    const cleared: FilterState = {
      q: query,
      type: "all",
      ecosystem: "",
      business_type: "",
      nature_of_business: "",
      industry_sector: "",
      core_category: "",
      category: "",
      sub_category: "",
      business_size: "",
      country: "",
      region: "",
      city: "",
      sort: "relevance",
      verified: "",
      digital_ai: false,
    };
    setFilters(cleared);
    go(cleared);
  }

  const activeAdvancedCount = [
    filters.ecosystem, filters.business_type, filters.nature_of_business,
    filters.business_size, filters.industry_sector, filters.core_category,
    filters.category, filters.sub_category,
    filters.country, filters.region, filters.city, filters.verified,
  ].filter(Boolean).length
    + (filters.sort !== "relevance" ? 1 : 0)
    + (filters.digital_ai ? 1 : 0);

  return {
    query, setQuery, filters, setFilters, showAdvanced, setShowAdvanced,
    go, selectCategory, updateFilter, resetFilters,
    industrySectorOptions, coreCategoryOptions, categoryOptions, subCategoryOptions,
    regionOptions, activeAdvancedCount,
  };
}

// ── Pill dropdown — plain text + icon, NO chevron, NO button styling ──
function PillDropdown({
  value,
  placeholder,
  options,
  onChange,
  icon: Icon,
  disabled,
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon: LucideIcon;
  disabled?: boolean;
}) {
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;
  const isActive = !!value;

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : v)} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-auto w-auto gap-1.5 border-0 bg-transparent px-1 py-1 shadow-none",
          "dark:bg-transparent dark:hover:bg-transparent dark:border-0 dark:shadow-none",
          "rounded-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-0",
          "dark:focus:ring-0 dark:focus-visible:ring-0 dark:focus-visible:outline-none dark:focus-visible:border-0",
          "text-xs font-medium transition-colors sm:text-[13px]",
          "[&_[data-slot=select-icon]]:hidden [&_.lucide-chevron-down]:hidden",
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-white",
          disabled && "opacity-40 cursor-not-allowed",
        )}
        aria-label={placeholder}
      >
        <Icon className={cn("size-3.5 shrink-0", isActive && "text-cyan-400", disabled && !isActive && "text-slate-600")} />
        <span className="whitespace-nowrap">{displayLabel}</span>
      </SelectTrigger>
      <SelectContent className="max-h-72 border-white/10 bg-[#1a1f2e] text-white">
        <SelectItem value="all" className="text-xs text-slate-400 focus:bg-white/10 focus:text-white">
          All {placeholder}
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

// ── Compact dropdown for advanced section ──
function FilterDropdown({
  value,
  placeholder,
  options,
  onChange,
  icon: Icon,
  disabled,
  hint,
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon?: LucideIcon;
  disabled?: boolean;
  hint?: string;
}) {
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;
  const isActive = !!value;

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : v)} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-auto w-auto gap-1.5 border-0 bg-transparent px-1 py-1 shadow-none",
          "dark:bg-transparent dark:hover:bg-transparent dark:border-0 dark:shadow-none",
          "rounded-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-0",
          "dark:focus:ring-0 dark:focus-visible:ring-0 dark:focus-visible:outline-none dark:focus-visible:border-0",
          "text-xs font-medium transition-colors sm:text-[13px]",
          "[&_[data-slot=select-icon]]:hidden [&_.lucide-chevron-down]:hidden",
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-white",
          disabled && "opacity-40 cursor-not-allowed",
        )}
        aria-label={placeholder}
        title={hint}
      >
        {Icon && <Icon className={cn("size-3.5 shrink-0", isActive && "text-cyan-400", disabled && !isActive && "text-slate-600")} />}
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

// ════════════════════════════════════════════════════════════
// PART 1: HeaderSearchInput — the pill-shaped search bar
// ════════════════════════════════════════════════════════════
export function HeaderSearchInput() {
  const { query, setQuery, go } = useSearchFilters();
  const [listening, setListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go();
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
      go({ q: transcript } as Partial<FilterState>);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  return (
    <form onSubmit={submit} className="w-full">
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
  );
}

// ════════════════════════════════════════════════════════════
// PART 2: HeaderSearchOptions — the options rows
//
// Row 1: All | Companies | Products | Services | Industries | Locations |
//        Business Type | Business Size | Advanced Search
// Row 2: Nature of Business | Eco systems | Industry Sector | Core Category |
//        Categories | Sub Category | Country | Region | City | Verification | Sort By
//
// Cascading: Eco system → Industry Sector → Core Category → Categories → Sub Category
// ════════════════════════════════════════════════════════════
export function HeaderSearchOptions() {
  const {
    filters, setFilters, go, selectCategory, updateFilter, resetFilters,
    showAdvanced, setShowAdvanced,
    industrySectorOptions, coreCategoryOptions, categoryOptions, subCategoryOptions,
    regionOptions, activeAdvancedCount,
  } = useSearchFilters();

  return (
    <div className="w-full">
      {/* ── Row 1: Category pills + Business Type + Business Size + Advanced Search ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {/* Category pills */}
        {CATEGORY_PILLS.map((cat) => {
          const Icon = cat.icon;
          const isActive = filters.type === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectCategory(cat.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 px-1 py-1 text-xs font-medium transition-colors sm:text-[13px]",
                isActive ? "text-white" : "text-slate-400 hover:text-white",
              )}
              aria-pressed={isActive}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive && "text-cyan-400")} />
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}

        {/* Business Type */}
        <PillDropdown
          icon={FileText}
          value={filters.business_type}
          placeholder="Business Type"
          options={BUSINESS_TYPES.map((b) => ({ value: b, label: b }))}
          onChange={(v) => updateFilter("business_type", v)}
        />

        {/* Business Size */}
        <PillDropdown
          icon={Users}
          value={filters.business_size}
          placeholder="Business Size"
          options={BUSINESS_SIZES.map((b) => ({ value: b, label: b }))}
          onChange={(v) => updateFilter("business_size", v)}
        />

        {/* Advanced Search button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 px-1 py-1 text-xs font-medium transition-colors sm:text-[13px]",
            showAdvanced ? "text-cyan-400" : "text-slate-400 hover:text-white",
          )}
          aria-expanded={showAdvanced}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="whitespace-nowrap">Advanced Search</span>
          {activeAdvancedCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-cyan-950">
              {activeAdvancedCount}
            </span>
          )}
        </button>

        {/* Clear button */}
        {activeAdvancedCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex shrink-0 items-center gap-1.5 px-1 py-1 text-xs font-medium text-red-400 transition-colors hover:text-red-300 sm:text-[13px]"
          >
            <X className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Clear</span>
          </button>
        )}
      </div>

      {/* ── Row 2: Advanced dropdown filters ──
          Cascading: Eco system → Industry Sector → Core Category → Categories → Sub Category */}
      {showAdvanced && (
        <div
          className="mt-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin"
          style={{ animation: "fadeIn .15s ease-out" }}
        >
          {/* Nature of Business */}
          <FilterDropdown
            icon={Briefcase}
            value={filters.nature_of_business}
            placeholder="Nature of Business"
            options={NATURE_OF_BUSINESS.map((b) => ({ value: b, label: b }))}
            onChange={(v) => updateFilter("nature_of_business", v)}
          />

          {/* Eco systems — must be selected first for cascading */}
          <FilterDropdown
            icon={Network}
            value={filters.ecosystem}
            placeholder="Eco systems"
            options={ecosystems.map((e) => ({ value: e.id, label: e.shortName }))}
            onChange={(v) => updateFilter("ecosystem", v)}
            hint="Select Eco system first"
          />

          {/* Industry Sector — cascading from Eco system */}
          <FilterDropdown
            icon={Factory}
            value={filters.industry_sector}
            placeholder="Industry Sector"
            options={industrySectorOptions}
            onChange={(v) => updateFilter("industry_sector", v)}
            disabled={!filters.ecosystem}
            hint={filters.ecosystem ? undefined : "Select Eco system first"}
          />

          {/* Core Category — cascading from Industry Sector */}
          <FilterDropdown
            icon={Layers3}
            value={filters.core_category}
            placeholder="Core Category"
            options={coreCategoryOptions}
            onChange={(v) => updateFilter("core_category", v)}
            disabled={!filters.industry_sector}
            hint={filters.industry_sector ? undefined : "Select Industry Sector first"}
          />

          {/* Categories — cascading from Core Category */}
          <FilterDropdown
            icon={Package}
            value={filters.category}
            placeholder="Categories"
            options={categoryOptions}
            onChange={(v) => updateFilter("category", v)}
            disabled={!filters.core_category}
            hint={filters.core_category ? undefined : "Select Core Category first"}
          />

          {/* Sub Category — cascading from Categories */}
          <FilterDropdown
            icon={ListTree}
            value={filters.sub_category}
            placeholder="Sub Category"
            options={subCategoryOptions}
            onChange={(v) => updateFilter("sub_category", v)}
            disabled={!filters.category}
            hint={filters.category ? undefined : "Select Categories first"}
          />

          {/* Country */}
          <FilterDropdown
            icon={Globe}
            value={filters.country}
            placeholder="Country"
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            onChange={(v) => updateFilter("country", v)}
          />

          {/* Region — cascading from Country */}
          <FilterDropdown
            icon={MapPinned}
            value={filters.region}
            placeholder="Region"
            options={regionOptions}
            onChange={(v) => updateFilter("region", v)}
            disabled={!filters.country}
            hint={filters.country ? undefined : "Select Country first"}
          />

          {/* City */}
          <FilterDropdown
            icon={MapPin}
            value={filters.city}
            placeholder="City"
            options={CITIES.map((c) => ({ value: c, label: c }))}
            onChange={(v) => updateFilter("city", v)}
          />

          {/* Verification */}
          <FilterDropdown
            icon={BadgeCheck}
            value={filters.verified}
            placeholder="Verification"
            options={VERIFICATION_OPTIONS}
            onChange={(v) => updateFilter("verified", v)}
          />

          {/* Sort By */}
          <FilterDropdown
            icon={TrendingUp}
            value={filters.sort === "relevance" ? "" : filters.sort}
            placeholder="Sort By"
            options={SORT_OPTIONS.filter((s) => s.key !== "relevance").map((s) => ({ value: s.key, label: s.label }))}
            onChange={(v) => updateFilter("sort", (v || "relevance") as SearchSort)}
          />
        </div>
      )}
    </div>
  );
}
