import { PageShell } from "@/components/layout/page-shell";
import { Hero } from "@/components/landing/hero";
import { WebuosAcronym } from "@/components/landing/webuos-acronym";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <WebuosAcronym />

      {/* Ecosystem cards */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Three Core Business Ecosystems</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Discover the global business landscape</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Every company, product and service on WEBUOS belongs to one of three interconnected business ecosystems.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ecosystems.map(eco => {
            const color = getColor(eco.categories[0]?.color ?? "blue");
            return (
              <Link key={eco.id} href={`/business-taxonomy/${eco.id}`} className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg", color.border)}>
                <div className="relative h-36 w-full overflow-hidden sm:h-40">
                  {/* Brand image for ecosystem card */}
                  <img src={eco.image} alt={eco.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-4 top-3 font-mono text-2xl font-bold text-white/95 sm:text-3xl">{eco.number}</span>
                  <span className={cn("absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft", color.iconText)}>
                    <DynamicIcon name={eco.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-tight tracking-tight sm:text-lg">{eco.name}</h3>
                  <p className={cn("mt-1 text-xs font-semibold uppercase tracking-wide", accentText(eco.accent))}>{eco.tagline}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{eco.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {eco.categories.slice(0, 4).map(c => (
                      <span key={c.id} className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", color.chipBg, color.chipText)}>{c.name}</span>
                    ))}
                    {eco.categories.length > 4 && <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">+{eco.categories.length - 4} more</span>}
                  </div>
                  <div className={cn("mt-5 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors", color.chipBg, color.chipText)}>
                    <span>Explore {eco.shortName}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
