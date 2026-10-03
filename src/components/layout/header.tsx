"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Globe, Menu, X, Search, ArrowRight } from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { ESuiteButton } from "@/components/layout/esuite-button";
import { HeaderSearchInput, HeaderSearchOptions } from "@/components/layout/header-search-bar";
import { cn } from "@/lib/utils";

// ============================================================
// Mobile compact search bar (for home page top, before scroll)
// ============================================================
function MobileSearchBar() {
  const [query, setQuery] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <div className="relative w-full">
      <form onSubmit={submit} className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies, products, services..."
          className="h-9 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
          aria-label="Search"
        />
      </form>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isHome) {
      const fn = () => setScrolled(window.scrollY > 350);
      window.addEventListener("scroll", fn, { passive: true });
      fn();
      return () => window.removeEventListener("scroll", fn);
    }
  }, [isHome]);

  const showHeaderSearch = !isHome || scrolled;
  // Options row only shows when there's an actual search query in the URL
  const hasSearchQuery = !!searchParams.get("q")?.trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/85 backdrop-blur-md",
        showHeaderSearch ? "bg-[#0f1420] border-b border-white/10" : "border-b border-border",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Row 1: Logo | Search bar (wider) | Nav buttons ── */}
        <div className={cn("flex items-center gap-3", showHeaderSearch ? "py-2.5" : "h-[60px]")}>
          <Link href="/" className="flex shrink-0 items-center" aria-label="WEBUOS home">
            <WebuosLogo size="md" />
          </Link>

          {showHeaderSearch ? (
            <>
              {/* Search bar — wider, responsive, centered */}
              <div className="hidden flex-1 items-center justify-center lg:flex">
                <div className="w-full max-w-[640px] xl:max-w-[780px] 2xl:max-w-[860px]">
                  <HeaderSearchInput />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Compact mobile/tablet search on home top */}
              <div className="flex flex-1 items-center justify-center lg:hidden">
                <div className="w-full max-w-xs">
                  <MobileSearchBar />
                </div>
              </div>
              {/* Spacer on desktop */}
              <div className="hidden flex-1 lg:block" />
            </>
          )}

          {/* Nav buttons — right side (ESuite, Apps, Sign In) */}
          <nav className="hidden shrink-0 items-center gap-1 lg:flex">
            <ESuiteButton variant="pill" />
            <ESuiteButton variant="icon" />
            <Link href="/login" className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Sign In</Link>
          </nav>

          <button type="button" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-muted lg:hidden" onClick={() => setMobileOpen(v => !v)} aria-label={mobileOpen ? "Close" : "Open menu"} aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ── Row 2: Options row — ONLY shows when there's a search query ── */}
        {showHeaderSearch && hasSearchQuery && (
          <div className="hidden lg:block pb-2">
            <HeaderSearchOptions />
          </div>
        )}

        {/* Mobile/tablet search input (when header search is shown) */}
        {showHeaderSearch && (
          <div className="pb-3 lg:hidden">
            <form onSubmit={submit} className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search companies, products, services..." className="h-10 flex-1 rounded-full border border-white/10 bg-[#1a1f2e] px-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20" autoFocus />
              <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-white hover:bg-slate-500"><ArrowRight className="h-4 w-4" /></button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile/tablet menu */}
      <div className={cn("border-t border-border bg-background lg:hidden", mobileOpen ? "block" : "hidden")}>
        <nav className="flex flex-col gap-1 px-4 py-3">
          <div className="flex items-center gap-2 py-1">
            <ESuiteButton variant="pill" />
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Globe className="h-4 w-4" /><span>English (EN)</span></button>
          <Link href="/business-taxonomy" className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Browse Ecosystems</Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground" onClick={() => setMobileOpen(false)}>Sign In</Link>
        </nav>
      </div>
    </header>
  );
}
