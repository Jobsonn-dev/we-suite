"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Menu, X, Search, ArrowRight, Mic } from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { ESuiteButton, esuiteApps } from "@/components/layout/esuite-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

// ============================================================
// Header Search Bar
// Compact search input + dropdown showing smaller app icons + names
// ============================================================
function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter apps for the dropdown
  const filteredApps = query.trim()
    ? esuiteApps.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.desc.toLowerCase().includes(query.toLowerCase()),
      )
    : esuiteApps.slice(0, 8); // Show first 8 apps by default

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setFocused(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  function openApp(href: string) {
    setFocused(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <form onSubmit={submit} className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search companies, products, services..."
          className="h-9 w-full rounded-full border border-border bg-muted/50 pl-10 pr-10 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
          aria-label="Search"
        />
        <button
          type="submit"
          className="absolute right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label="Submit search"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Dropdown: smaller app icons + names */}
      {focused && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-soft-lg" style={{ animation: "fadeIn .15s ease-out" }}>
          {/* Quick apps section */}
          <div className="border-b border-border p-3">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {query.trim() ? `Matching apps (${filteredApps.length})` : "Quick apps"}
            </p>
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-5">
              {filteredApps.slice(0, 10).map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => openApp(app.href)}
                    title={app.desc}
                    className="group flex flex-col items-center gap-1.5 rounded-lg px-1.5 py-2 transition-colors hover:bg-muted"
                  >
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm transition-transform group-hover:scale-110",
                        app.iconBg,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="block w-full truncate text-center text-[10px] font-medium text-foreground/80 group-hover:text-foreground">
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search action footer */}
          <div className="p-2">
            <button
              type="button"
              onClick={() => {
                setFocused(false);
                if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">
                {query.trim() ? (
                  <>Search WEBUOS for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span></>
                ) : (
                  <>Type to search the WEBUOS ecosystem</>
                )}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
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

  const showSearch = !isHome || scrolled;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="WEBUOS home">
          <WebuosLogo size="md" />
        </Link>

        <div className={cn("flex flex-1 items-center justify-center transition-opacity duration-300", showSearch ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <div className={cn("hidden w-full md:block", showSearch ? "block" : "hidden")}>
            <HeaderSearch />
          </div>
          <button type="button" onClick={() => setSearchOpen(true)} className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground md:hidden", showSearch ? "flex" : "hidden")} aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </div>

        <nav className="hidden shrink-0 items-center gap-1 md:flex">
          <ESuiteButton variant="pill" />
          <ESuiteButton variant="icon" />
          <ThemeToggle />
          <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Language">
            <Globe className="h-4 w-4" /><span>EN</span>
          </button>
        </nav>

        <button type="button" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden" onClick={() => setMobileOpen(v => !v)} aria-label={mobileOpen ? "Close" : "Open menu"} aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {searchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 border-b border-border bg-background p-4 md:hidden">
          <form onSubmit={submit} className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="h-10 flex-1 rounded-full border border-border bg-muted/50 px-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15" autoFocus />
            <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><ArrowRight className="h-4 w-4" /></button>
            <button type="button" onClick={() => setSearchOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
          </form>
        </div>
      )}

      <div className={cn("border-t border-border bg-background md:hidden", mobileOpen ? "block" : "hidden")}>
        <nav className="flex flex-col gap-1 px-4 py-3">
          <div className="flex items-center gap-2 py-1">
            <ESuiteButton variant="pill" />
            <div className="ml-auto"><ThemeToggle /></div>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Globe className="h-4 w-4" /><span>English (EN)</span></button>
          <Link href="/business-taxonomy" className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Browse Ecosystems</Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground" onClick={() => setMobileOpen(false)}>Open Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
