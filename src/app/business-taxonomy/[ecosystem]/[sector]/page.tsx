"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, ChevronRight, Home, Boxes, Building2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { getCoreSector } from "@/data/taxonomy";
import { getColor } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function SectorPage() {
  const params = useParams<{ ecosystem: string; sector: string }>();
  const result = getCoreSector(params.ecosystem, params.sector);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"number" | "name">("number");

  const filtered = useMemo(() => {
    if (!result) return [];
    const q = search.toLowerCase().trim();
    let cats = result.sector.categories;
    if (q) cats = cats.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    if (sort === "name") cats = [...cats].sort((a, b) => a.name.localeCompare(b.name));
    return cats;
  }, [result, search, sort]);

  if (!result) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Core sector not found</h1>
          <Link href="/business-taxonomy" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Back to taxonomy</Link>
        </div>
      </PageShell>
    );
  }

  const { ecosystem: eco, sector } = result;
  const color = getColor(sector.color);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="inline-flex items-center gap-1 hover:text-foreground"><Home className="h-3 w-3" />Home</Link></li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li><Link href="/business-taxonomy" className="hover:text-foreground">Taxonomy</Link></li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li><Link href={`/business-taxonomy/${eco.id}`} className="hover:text-foreground">{eco.shortName}</Link></li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="font-medium text-foreground">{sector.name}</li>
          </ol>
        </nav>

        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className={cn("inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", color.iconBg, color.iconText)}><DynamicIcon name={sector.icon} className="h-7 w-7" /></span>
              <div>
                <p className={cn("text-xs font-bold uppercase tracking-wider", color.text)}>{eco.shortName} · {sector.code}</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{sector.name}</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{sector.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Boxes className="h-3.5 w-3.5" />{sector.categories.length} categories</span>
                  <span className="text-border">·</span>
                  <span>Ecosystem {eco.number}</span>
                </div>
              </div>
            </div>
            <Link href="/business/create" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">Use for business<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">Categories</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} of {sector.categories.length} categories — each with products, services, and business profiles</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value as "number" | "name")} className="h-10 rounded-full border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15">
              <option value="number">Sort by #</option>
              <option value="name">Sort A–Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((cat, idx) => (
            <div key={cat.id} className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-soft">
              <div className="flex items-start gap-3">
                <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold", color.iconBg, color.iconText)}>{String(idx + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{cat.name}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{cat.description}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">{cat.code}</p>
                </div>
              </div>

              {cat.products.length > 0 && (
                <div className="mt-3 border-t border-border/60 pt-2">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Related Products</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.products.map(p => <span key={p.name} className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">{p.name}</span>)}
                  </div>
                </div>
              )}

              {cat.services.length > 0 && (
                <div className="mt-2 border-t border-border/60 pt-2">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Related Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.services.map(s => <span key={s.name} className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">{s.name}</span>)}
                  </div>
                </div>
              )}

              {cat.businessProfiles.length > 0 && (
                <div className="mt-2 border-t border-border/60 pt-2">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Business Profiles</p>
                  <div className="space-y-1">
                    {cat.businessProfiles.map(bp => (
                      <div key={bp.name} className="flex items-center gap-2 text-[11px]">
                        <Building2 className="h-3 w-3 shrink-0 text-indigo-500" />
                        <span className="font-medium text-foreground">{bp.name}</span>
                        <span className="text-muted-foreground">· {bp.type}</span>
                        <span className="text-muted-foreground/60">· {bp.location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center"><p className="text-sm text-muted-foreground">No categories match &ldquo;{search}&rdquo;.</p></div>}

        <div className="mt-10 flex items-center justify-between">
          <Link href={`/business-taxonomy/${eco.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"><ArrowLeft className="h-4 w-4" />{eco.shortName} core sectors</Link>
          <Link href="/business/create" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">Create business with this<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </PageShell>
  );
}
