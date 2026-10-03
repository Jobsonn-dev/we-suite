"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, ArrowRight, X, Building2, Package, Wrench, Factory, Cpu, MapPin, Clock, TrendingUp } from "lucide-react";
import { ecosystems } from "@/data/taxonomy";
import { cn } from "@/lib/utils";

const recentSearches = [
  { label: "AI companies in Bangalore", icon: Cpu },
  { label: "Steel manufacturers", icon: Factory },
  { label: "ERP software", icon: Package },
  { label: "Consulting services", icon: Wrench },
];

const trendingSearches = [
  "Industrial automation Bangalore",
  "AI startups India",
  "CNC machine manufacturers",
  "Cloud computing services",
  "Solar energy companies",
  "Cybersecurity firms",
];

interface Suggestion {
  id: string;
  label: string;
  type: "company" | "product" | "service" | "industry" | "technology" | "location" | "query";
  description?: string;
  icon: typeof Building2;
}

function buildSuggestions(query: string): Suggestion[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const out: Suggestion[] = [];

  for (const eco of ecosystems) {
    for (const sector of eco.categories) {
      if (sector.name.toLowerCase().includes(q)) {
        out.push({ id: `ind-${sector.id}`, label: sector.name, type: "industry", description: sector.description, icon: Factory });
      }
      for (const sub of sector.categories) {
        if (sub.name.toLowerCase().includes(q)) {
          out.push({ id: `sub-${sub.id}`, label: sub.name, type: "industry", description: sub.description, icon: Factory });
        }
        for (const p of sub.products) {
          if (p.name.toLowerCase().includes(q)) {
            out.push({ id: `prod-${p.name}`, label: p.name, type: "product", description: p.description, icon: Package });
          }
        }
        for (const s of sub.services) {
          if (s.name.toLowerCase().includes(q)) {
            out.push({ id: `svc-${s.name}`, label: s.name, type: "service", description: s.description, icon: Wrench });
          }
        }
        for (const b of sub.businessProfiles) {
          if (b.name.toLowerCase().includes(q)) {
            out.push({ id: `biz-${b.name}`, label: b.name, type: "company", description: `${b.type} · ${b.location}`, icon: Building2 });
          }
        }
      }
    }
  }

  // Add query suggestions based on keywords
  const queryTemplates: { keywords: string[]; label: string }[] = [
    { keywords: ["ai", "artificial"], label: "AI companies" },
    { keywords: ["manufactur"], label: "Manufacturers" },
    { keywords: ["supplier", "vendor"], label: "Suppliers" },
    { keywords: ["steel"], label: "Steel manufacturers" },
    { keywords: ["automotive", "car", "vehicle"], label: "Automotive companies" },
    { keywords: ["cnc", "machining"], label: "CNC machine companies" },
    { keywords: ["cloud"], label: "Cloud computing services" },
    { keywords: ["erp"], label: "ERP software companies" },
    { keywords: ["cyber", "security"], label: "Cybersecurity companies" },
    { keywords: ["solar", "energy"], label: "Solar energy companies" },
    { keywords: ["bangalore", "bengaluru"], label: "Companies in Bangalore" },
    { keywords: ["mumbai"], label: "Companies in Mumbai" },
    { keywords: ["india"], label: "Companies in India" },
    { keywords: ["robot", "automation"], label: "Industrial automation companies" },
  ];
  for (const t of queryTemplates) {
    if (t.keywords.some(k => q.includes(k))) {
      out.push({ id: `q-${t.label}`, label: t.label, type: "query", icon: Search });
    }
  }

  return out.slice(0, 8);
}

const typeIconColor: Record<Suggestion["type"], string> = {
  company: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
  product: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  service: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10",
  industry: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10",
  technology: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10",
  location: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  query: "text-foreground bg-muted",
};

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [listening, setListening] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = buildSuggestions(query);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
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

  function go(q?: string) {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery) return;
    setFocused(false);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
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
    const SR = (typeof window !== "undefined" && ((window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition)) || null;
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

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        go(suggestions[activeIndex].label);
      } else {
        go();
      }
    }
  }

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[680px]">
      <form onSubmit={e => { e.preventDefault(); if (activeIndex >= 0 && suggestions[activeIndex]) go(suggestions[activeIndex].label); else go(); }}>
        <div className={cn("relative flex items-center gap-1 rounded-full border bg-card pl-4 pr-1.5 py-1.5 transition-all sm:py-2", focused ? "border-primary/30 shadow-soft-lg ring-4 ring-primary/10" : "border-border shadow-soft hover:border-primary/40 hover:shadow-soft-lg")}>
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            placeholder="Search companies, products, services or industries..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-base"
            aria-label="Search"
            aria-controls="search-suggestions"
          />
          {query && <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="hidden rounded-full p-1.5 text-muted-foreground hover:bg-muted sm:inline-flex" aria-label="Clear"><X className="h-4 w-4" /></button>}
          <button type="button" onClick={startVoice} className={cn("hidden rounded-full p-2 transition-colors sm:inline-flex", listening ? "bg-red-500/15 text-red-500 animate-pulse" : "text-muted-foreground hover:bg-muted hover:text-foreground")} aria-label="Voice search">
            <Mic className="h-4.5 w-4.5" />
          </button>
          <button type="submit" disabled={!query.trim()} className={cn("inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:px-5", !query.trim() && "cursor-not-allowed opacity-50")}>
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {focused && (
        <div id="search-suggestions" className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-border bg-popover shadow-soft-lg">
          {query.trim() && suggestions.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto py-1 scrollbar-thin">
              {suggestions.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <button type="button" onMouseEnter={() => setActiveIndex(idx)} onClick={() => go(s.label)} className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted", activeIndex === idx && "bg-muted")}>
                      <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", typeIconColor[s.type])}><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-foreground">{s.label}</span>
                        {s.description && <span className="block truncate text-xs text-muted-foreground">{s.description}</span>}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.type}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : query.trim() && suggestions.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No suggestions for &ldquo;{query}&rdquo; — press Enter to search the full ecosystem.</p>
            </div>
          ) : (
            <div className="py-2">
              <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent searches</p>
              <ul>
                {recentSearches.map(s => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label}>
                      <button type="button" onMouseEnter={() => setActiveIndex(-1)} onClick={() => go(s.label)} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground/80 hover:bg-muted/60 hover:text-foreground">
                        <Icon className="h-4 w-4 text-muted-foreground" /><span className="flex-1 truncate">{s.label}</span>
                        <Clock className="h-3 w-3 text-muted-foreground/60" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 border-t border-border px-4 pb-1 pt-3">
                <p className="pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"><TrendingUp className="mr-1 inline h-3 w-3" />Trending searches</p>
                <div className="flex flex-wrap gap-1.5 pb-2 pt-1">
                  {trendingSearches.map(t => (
                    <button key={t} type="button" onClick={() => { setQuery(t); go(t); }} className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/70 hover:bg-muted hover:text-foreground">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
