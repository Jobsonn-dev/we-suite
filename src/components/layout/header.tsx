"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, Menu, X, Search, ArrowRight } from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { ESuiteButton } from "@/components/layout/esuite-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

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
          <form onSubmit={submit} className={cn("relative hidden w-full max-w-md items-center md:flex", showSearch ? "flex" : "hidden")}>
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search companies, products, services..." className="h-9 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15" />
          </form>
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
          <Link href="/login" className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Sign In</Link>
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
          <Link href="/register" className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Register</Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground" onClick={() => setMobileOpen(false)}>Sign In</Link>
        </nav>
      </div>
    </header>
  );
}
