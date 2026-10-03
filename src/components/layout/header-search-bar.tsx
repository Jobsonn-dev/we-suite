"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Mic, ArrowRight, X, ChevronDown,
  Layers, Building2, Briefcase, Package, Wrench, BarChart3, Cpu, MapPin,
  Globe, Factory, type LucideIcon,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ecosystems, getEcosystem } from "@/data/taxonomy";

// ============================================================
// Header Search Bar + Dropdown Filters
// Pill-shaped dark search bar with mic + Search button
// Below it: row of dropdown filters (ecosystem, business type,
// nature of business, core sector, categories, entity type,
// country, city) + Digital & AI quick toggle
// ============================================================

export type SearchCategory = "all" | "company" | "product" | "service" | "industry" | "technology" | "location";

interface FilterState {
  q: string;
  type: SearchCategory;
  ecosystem: string;     // "" = all
  business_type: string; // "" = all
  business_size: string; // "" = all (Nature of Business)
  sector: string;        // "" = all (Core Sector)
  category: string;     // "" = all (Categories)
  country: string;      // "" = all
  city: string;         // "" = all
  digital_ai: boolean;  // Digital & AI quick toggle
}

const ENTITY_TYPES: { key: SearchCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "company", label: "Companies" },
  { key: "product", label: "Products" },
  { key: "service", label: "Services" },
  { key: "industry", label: "Industries" },
  { key: "technology", label: "Technology" },
  { key: "location", label: "Locations" },
];

const BUSINESS_TYPES = [
  "Manufacturer", "Supplier", "Distributor", "Wholesaler",
  "Service Provider", "Consultant", "Startup", "Enterprise",
];

const BUSINESS_SIZES = ["Startup", "Small", "Medium", "Large", "Enterprise"];

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

// Compact dropdown wrapper for the filter row
function FilterDropdown({
  label,
  value,
  placeholder,
  options,
  required,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange: (v: string) => void;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-0.5">
      <label className="flex items-center gap-0.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {Icon && <Icon className="h-2.5 w-2.5" />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : v)}>
        <SelectTrigger className="h-8 w-auto min-w-[120px] gap-1 rounded-lg border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/10 [&>svg]:text-slate-400">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-64 border-white/10 bg-[#1a1f2e] text-white">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-xs text-slate-300 focus:bg-white/10 focus:text-white"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialQuery = searchParams.get("q") ?? "";
  const initialType = (searchParams.get("type") as SearchCategory | null) ?? "all";
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
    business_size: searchParams.get("business_size") ?? "",
    sector: searchParams.get("sector") ?? "",
    category: searchParams.get("category") ?? "",
    country: searchParams.get("country") ?? "",
    city: searchParams.get("city") ?? "",
    digital_ai: searchParams.get("ecosystem") === "technology-ai",
  });

  // Cascading: compute sector options based on selected ecosystem
  const sectorOptions = useMemo(() => {
    if (!filters.ecosystem) {
      // All sectors from all ecosystems
      return ecosystems.flatMap((e) => e.categories).map((s) => ({ value: s.id, label: s.name }));
    }
    const eco = getEcosystem(filters.ecosystem);
    return (eco?.categories ?? []).map((s) => ({ value: s.id, label: s.name }));
  }, [filters.ecosystem]);

  // Cascading: compute category options based on selected ecosystem + sector
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
    if (next.business_size) params.set("business_size", next.business_size);
    if (next.country) params.set("country", next.country);
    if (next.city) params.set("city", next.city);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go();
  }

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const overrides: Partial<FilterState> = { [key]: value };
    // Cascading reset: if ecosystem changes, reset sector + category
    if (key === "ecosystem") {
      overrides.sector = "";
      overrides.category = "";
      // Digital & AI toggle sync
      overrides.digital_ai = value === "technology-ai";
    }
    // If sector changes, reset category
    if (key === "sector") {
      overrides.category = "";
    }
    // Digital & AI toggle: sets ecosystem to technology-ai or clears it
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
      business_size: "",
      sector: "",
      category: "",
      country: "",
      city: "",
      digital_ai: false,
    };
    setFilters(cleared);
    go(cleared);
  }

  const activeFilterCount = [
    filters.ecosystem, filters.business_type, filters.business_size,
    filters.sector, filters.category, filters.country, filters.city,
  ].filter(Boolean).length + (filters.type !== "all" ? 1 : 0);

  return (
    <div ref={ref} className="w-full">
      {/* Search bar (pill-shaped, dark) */}
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

      {/* Dropdown filters row — replaces the old category pills */}
      <div className="mt-1.5 flex items-end gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {/* Entity Type (Companies / Products / Services / Industries / Technology / Locations) */}
        <FilterDropdown
          label="Type"
          icon={Layers}
          value={filters.type}
          placeholder="All Types"
          required
          options={ENTITY_TYPES.map((t) => ({ value: t.key, label: t.label }))}
          onChange={(v) => updateFilter("type", v as SearchCategory)}
        />

        {/* Ecosystem (All / Industrial / Technology & AI / Business Services) */}
        <FilterDropdown
          label="Ecosystem"
          icon={Globe}
          value={filters.ecosystem}
          placeholder="All Ecosystems"
          required
          options={ecosystems.map((e) => ({ value: e.id, label: e.shortName }))}
          onChange={(v) => updateFilter("ecosystem", v)}
        />

        {/* Business Type (Manufacturer / Supplier / etc.) */}
        <FilterDropdown
          label="Business Type"
          icon={Building2}
          value={filters.business_type}
          placeholder="All Types"
          options={BUSINESS_TYPES.map((b) => ({ value: b, label: b }))}
          onChange={(v) => updateFilter("business_type", v)}
        />

        {/* Nature of Business (Business Size) */}
        <FilterDropdown
          label="Nature of Business"
          icon={Briefcase}
          value={filters.business_size}
          placeholder="All Sizes"
          options={BUSINESS_SIZES.map((b) => ({ value: b, label: b }))}
          onChange={(v) => updateFilter("business_size", v)}
        />

        {/* Core Sector (cascading from ecosystem) */}
        <FilterDropdown
          label="Core Sector"
          icon={Factory}
          value={filters.sector}
          placeholder="All Sectors"
          options={sectorOptions}
          onChange={(v) => updateFilter("sector", v)}
        />

        {/* Categories (cascading from sector) */}
        <FilterDropdown
          label="Categories"
          icon={Package}
          value={filters.category}
          placeholder="All Categories"
          options={categoryOptions}
          onChange={(v) => updateFilter("category", v)}
        />

        {/* Country */}
        <FilterDropdown
          label="Country"
          icon={Globe}
          value={filters.country}
          placeholder="All Countries"
          options={COUNTRIES.map((c) => ({ value: c, label: c }))}
          onChange={(v) => updateFilter("country", v)}
        />

        {/* City */}
        <FilterDropdown
          label="City"
          icon={MapPin}
          value={filters.city}
          placeholder="All Cities"
          options={CITIES.map((c) => ({ value: c, label: c }))}
          onChange={(v) => updateFilter("city", v)}
        />

        {/* Digital & AI quick toggle */}
        <div className="flex shrink-0 flex-col gap-0.5">
          <label className="flex items-center gap-0.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <Cpu className="h-2.5 w-2.5" />
            Quick Filter
          </label>
          <button
            type="button"
            onClick={() => updateFilter("digital_ai", !filters.digital_ai)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all",
              filters.digital_ai
                ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-sm"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
            )}
            aria-pressed={filters.digital_ai}
          >
            <Cpu className="h-3.5 w-3.5" />
            Digital &amp; AI
          </button>
        </div>

        {/* Reset button (only shown when filters are active) */}
        {activeFilterCount > 0 && (
          <div className="flex shrink-0 flex-col gap-0.5">
            <label className="px-1 text-[10px] font-semibold uppercase tracking-wider text-transparent">.</label>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-400/30 bg-red-500/10 px-3 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20"
            >
              <X className="h-3.5 w-3.5" />
              Clear ({activeFilterCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
