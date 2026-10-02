"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, ChevronRight, Home } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { getEcosystem } from "@/data/taxonomy";
import { getColor } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function SegmentPage({ segment }: { segment: string }) {
  const eco = getEcosystem(segment);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!eco) return [];
    const q = search.toLowerCase().trim();
    if (!q) return eco.categories;
    return eco.categories.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.categories.some(c => c.name.toLowerCase().includes(q)));
  }, [eco, search]);

  if (!eco) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Segment not found</h1>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Back to home</Link>
        </div>
      </PageShell>
    );
  }

  const color = getColor(eco.categories[0]?.color ?? "blue");

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-border">
        <img src={eco.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <nav className="mb-6 text-xs text-white/70">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3 w-3" />Home</Link></li>
              <li><ChevronRight className="h-3 w-3" /></li>
              <li className="font-medium text-white">{eco.shortName}</li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 shadow-soft", color.iconText)}><DynamicIcon name={eco.icon} className="h-6 w-6" /></span>
              <span className="font-mono text-2xl font-bold text-white/90">{eco.number}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{eco.name}</h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-base">{eco.tagline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{eco.description}</p>
            <div className="mt-5 flex items-center gap-4 text-sm text-white/70">
              <span><span className="font-bold text-white">{eco.categories.length}</span> core sectors</span>
              <span className="text-white/30">·</span>
              <span><span className="font-bold text-white">{eco.categories.reduce((s, c) => s + c.categories.length, 0)}</span> categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Browse {eco.shortName} Core Sectors</h2>
            <p className="text-sm text-muted-foreground">Explore the {eco.categories.length} core sectors in this ecosystem.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search core sectors..." className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(sector => {
            const c = getColor(sector.color);
            return (
              <Link key={sector.id} href={`/business-taxonomy/${eco.id}/${sector.id}`} className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", c.iconBg, c.iconText)}><DynamicIcon name={sector.icon} className="h-5 w-5" /></span>
                  <span className="font-mono text-xs font-bold text-muted-foreground">{sector.code}</span>
                </div>
                <p className={cn("mt-3 text-xs font-bold uppercase tracking-wider", c.text)}>Core Sector {sector.number}</p>
                <h3 className="text-base font-bold tracking-tight">{sector.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{sector.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs font-medium text-muted-foreground">{sector.categories.length} categories</span>
                  <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", c.text)}>View<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center"><p className="text-sm text-muted-foreground">No core sectors match &ldquo;{search}&rdquo;.</p></div>}

        <div className="mt-10 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"><ArrowLeft className="h-4 w-4" />Back to home</Link>
        </div>
      </section>
    </PageShell>
  );
}
