"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Mic, ArrowRight, X, Sparkles,
  Building2, Package, Wrench, BarChart3, Cpu, MapPin,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Header Search Bar + Category Filter Bar
// Pill-shaped dark search bar with mic + Search button (image 2)
// Below it: horizontal category tabs (image 1)
// ============================================================

export type SearchCategory = "all" | "company" | "product" | "service" | "industry" | "technology" | "location";

interface CategoryDef {
  key: SearchCategory;
  label: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryDef[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "company", label: "Companies", icon: Building2 },
  { key: "product", label: "Products", icon: Package },
  { key: "service", label: "Services", icon: Wrench },
  { key: "industry", label: "Industries", icon: BarChart3 },
  { key: "technology", label: "Technology", icon: Cpu },
  { key: "location", label: "Locations", icon: MapPin },
];

export function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as SearchCategory | null) ?? "all";
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>(
    initialType && CATEGORIES.some((c) => c.key === initialType) ? initialType : "all",
  );
  const [listening, setListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function go(q?: string, cat?: SearchCategory) {
    const finalQuery = (q ?? query).trim();
    const finalCat = cat ?? category;
    setFocused(false);
    const params = new URLSearchParams();
    if (finalQuery) params.set("q", finalQuery);
    if (finalCat && finalCat !== "all") params.set("type", finalCat);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go();
  }

  function selectCategory(cat: SearchCategory) {
    setCategory(cat);
    // If there's a query, immediately re-search with the new category
    if (query.trim()) {
      go(query, cat);
    }
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
      go(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  return (
    <div ref={ref} className="w-full">
      {/* Search bar (pill-shaped, dark) — matches target image */}
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
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
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

      {/* Category filter bar — matches target image */}
      <div className="mt-1.5 flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#1a1f2e] p-1 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectCategory(cat.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:text-[13px]",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:bg-white/10 hover:text-white",
              )}
              aria-pressed={isActive}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
