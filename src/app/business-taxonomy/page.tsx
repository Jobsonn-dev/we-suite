"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, LayoutGrid, Table as TableIcon, ArrowRight, Layers, Network, Boxes, ShoppingCart, Briefcase, Building2, Filter } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ecosystems, taxonomyStats } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function BusinessTaxonomyPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [ecoFilter, setEcoFilter] = useState("all");

  const allSectors = useMemo(() => ecosystems.flatMap(e => e.categories.map(s => ({ eco: e, sector: s }))), []);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allSectors.filter(({ eco, sector }) => {
      if (ecoFilter !== "all" && eco.id !== ecoFilter) return false;
      if (!q) return true;
      return sector.name.toLowerCase().includes(q) || sector.description.toLowerCase().includes(q) || sector.categories.some(c => c.name.toLowerCase().includes(q));
    });
  }, [allSectors, search, ecoFilter]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-3 text-xs text-muted-foreground"><Link href="/" className="hover:text-foreground">Home</Link> / <span className="font-medium text-foreground">Business Taxonomy</span></nav>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Business Taxonomy</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">The WEBUOS global business classification system — {taxonomyStats.ecosystems} ecosystems, {taxonomyStats.coreSectors} core sectors, {taxonomyStats.categories} categories, {taxonomyStats.products + taxonomyStats.services} products &amp; services, and {taxonomyStats.businessProfiles} business profiles.</p>

        <div className="mb-8 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Stat icon={Network} label="Ecosystems" value={taxonomyStats.ecosystems} color="text-blue-600" bg="bg-blue-100 dark:bg-blue-500/15" />
          <Stat icon={Boxes} label="Core Sectors" value={taxonomyStats.coreSectors} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-500/15" />
          <Stat icon={Layers} label="Categories" value={taxonomyStats.categories} color="text-purple-600" bg="bg-purple-100 dark:bg-purple-500/15" />
          <Stat icon={ShoppingCart} label="Products" value={taxonomyStats.products} color="text-green-600" bg="bg-green-100 dark:bg-green-500/15" />
          <Stat icon={Briefcase} label="Services" value={taxonomyStats.services} color="text-orange-600" bg="bg-orange-100 dark:bg-orange-500/15" />
          <Stat icon={Building2} label="Profiles" value={taxonomyStats.businessProfiles} color="text-indigo-600" bg="bg-indigo-100 dark:bg-indigo-500/15" />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ecosystems.map(eco => {
            const color = getColor(eco.categories[0]?.color ?? "blue");
            return (
              <Link key={eco.id} href={`/business-taxonomy/${eco.id}`} className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", color.iconBg, color.iconText)}><DynamicIcon name={eco.icon} className="h-5 w-5" /></span>
                  <span className="font-mono text-sm font-bold text-muted-foreground">{eco.code}</span>
                </div>
                <p className={cn("mt-3 text-xs font-bold uppercase tracking-wider", accentText(eco.accent))}>{eco.number}</p>
                <h3 className="text-base font-bold tracking-tight">{eco.name}</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{eco.tagline}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs font-medium text-muted-foreground">{eco.categories.length} core sectors · {eco.categories.reduce((s, c) => s + c.categories.length, 0)} categories</span>
                  <ArrowRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", accentText(eco.accent))} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search core sectors or categories..." className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={ecoFilter} onChange={e => setEcoFilter(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15">
              <option value="all">All Ecosystems</option>
              {ecosystems.map(e => <option key={e.id} value={e.id}>{e.shortName}</option>)}
            </select>
            <div className="flex items-center rounded-lg border border-border p-0.5">
              <button onClick={() => setView("table")} className={cn("inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium", view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}><TableIcon className="h-3.5 w-3.5" />Table</button>
              <button onClick={() => setView("grid")} className={cn("inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}><LayoutGrid className="h-3.5 w-3.5" />Grid</button>
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {allSectors.length} core sectors</p>

        {view === "table" ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">#</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Icon</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Ecosystem</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Core Sector</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Code</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Categories</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map(({ eco, sector }, idx) => {
                    const color = getColor(sector.color);
                    return (
                      <tr key={`${eco.id}-${sector.id}`} className="hover:bg-muted/40">
                        <td className="px-4 py-3 text-muted-foreground">{String(idx + 1).padStart(2, "0")}</td>
                        <td className="px-4 py-3"><span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", color.iconBg, color.iconText)}><DynamicIcon name={sector.icon} className="h-4 w-4" /></span></td>
                        <td className="px-4 py-3 text-xs font-medium text-muted-foreground">{eco.shortName}</td>
                        <td className="px-4 py-3"><Link href={`/business-taxonomy/${eco.id}/${sector.id}`} className="font-semibold text-foreground hover:text-primary hover:underline">{sector.name}</Link></td>
                        <td className="px-4 py-3"><span className="font-mono text-xs text-muted-foreground">{sector.code}</span></td>
                        <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{sector.categories.length}</span></td>
                        <td className="px-4 py-3 text-right"><Link href={`/business-taxonomy/${eco.id}/${sector.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View<ArrowRight className="h-3 w-3" /></Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ eco, sector }) => {
              const color = getColor(sector.color);
              return (
                <Link key={`${eco.id}-${sector.id}`} href={`/business-taxonomy/${eco.id}/${sector.id}`} className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                  <div className="flex items-center justify-between">
                    <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", color.iconBg, color.iconText)}><DynamicIcon name={sector.icon} className="h-5 w-5" /></span>
                    <span className="font-mono text-xs font-bold text-muted-foreground">{sector.code}</span>
                  </div>
                  <p className={cn("mt-3 text-xs font-bold uppercase tracking-wider", color.text)}>{eco.shortName}</p>
                  <h3 className="text-base font-bold tracking-tight">{sector.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{sector.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-xs font-medium text-muted-foreground">{sector.categories.length} categories</span>
                    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", color.text)}>Explore<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-border bg-primary p-6 text-center text-white sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Create a classified business</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">Every business on WEBUOS must be classified through the taxonomy. Start by selecting an ecosystem, core sector, and category.</p>
          <Link href="/business/create" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]">Create a Business<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value, color, bg }: { icon: typeof Layers; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", bg, color)}><Icon className="h-5 w-5" /></span>
      <div><p className="text-xl font-bold sm:text-2xl">{value}</p><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p></div>
    </div>
  );
}
