"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Mic, ArrowRight, X, Building2, Package, Wrench,
  Factory, Cpu, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Suggestion } from "@/lib/search/server";

interface Props {
  initialValue?: string;
  autoFocus?: boolean;
  className?: string;
}

const typeIcon: Record<Suggestion["type"], typeof Building2> = {
  company: Building2,
  product: Package,
  service: Wrench,
  industry: Factory,
  technology: Cpu,
  location: MapPin,
  query: Search,
};

const typeColor: Record<Suggestion["type"], string> = {
  company: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  product: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  service: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  industry: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  technology: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
  location: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  query: "text-foreground bg-muted",
};

export function SearchInput({ initialValue = "", autoFocus = false, className }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSug, setLoadingSug] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut "/" focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const fetchSuggestions = useCallback((q: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (abortRef.current) abortRef.current.abort();
    if (q.trim().length < 1) {
      setSuggestions([]);
      setLoadingSug(false);
      return;
    }
    setLoadingSug(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch {
        /* ignore abort */
      } finally {
        setLoadingSug(false);
      }
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  function go(q?: string) {
    const finalQuery = (q ?? query).trim();
    setFocused(false);
    if (!finalQuery) {
      router.push("/search");
      return;
    }
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

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
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
    <div ref={ref} className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (activeIndex >= 0 && suggestions[activeIndex]) go(suggestions[activeIndex].label);
          else go();
        }}
      >
        <div
          className={cn(
            "relative flex items-center gap-1 rounded-full border bg-card pl-4 pr-1.5 py-1.5 transition-all",
            focused
              ? "border-primary/40 shadow-soft-lg ring-4 ring-primary/10"
              : "border-border shadow-soft hover:border-primary/30 hover:shadow-soft-lg"
          )}
        >
          <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
              fetchSuggestions(e.target.value);
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            placeholder="Search companies, products, services, industries..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-base"
            aria-label="Search"
            aria-controls="search-input-suggestions"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              className="hidden rounded-full p-1.5 text-muted-foreground hover:bg-muted sm:inline-flex"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={startVoice}
            className={cn(
              "hidden rounded-full p-2 transition-colors sm:inline-flex",
              listening
                ? "bg-red-500/15 text-red-500 animate-pulse"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-label="Voice search"
          >
            <Mic className="h-4.5 w-4.5" />
          </button>
          <button
            type="submit"
            disabled={!query.trim()}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:px-5",
              !query.trim() && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {focused && (suggestions.length > 0 || loadingSug) && (
        <div
          id="search-input-suggestions"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-border bg-popover shadow-soft-lg"
        >
          {loadingSug ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">Searching…</div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-1 scrollbar-thin">
              {suggestions.map((s, idx) => {
                const Icon = typeIcon[s.type] ?? Search;
                return (
                  <li key={`${s.type}-${s.label}-${idx}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => go(s.label)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted",
                        activeIndex === idx && "bg-muted"
                      )}
                    >
                      <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", typeColor[s.type])}>
                        <Icon className="h-4 w-4" />
                      </span>
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
          )}
        </div>
      )}
    </div>
  );
}
