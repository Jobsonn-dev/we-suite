"use client";

import Link from "next/link";
import { ArrowRight, SlidersHorizontal, Compass } from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { SearchBar } from "./search-bar";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pb-12 pt-12 sm:pt-16 lg:pt-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="mb-3 flex justify-center"><WebuosLogo size="xl" /></div>
        <h1 className="sr-only">WEBUOS - Global Business Discovery Platform</h1>
        <p className="mb-8 max-w-3xl text-center text-base font-medium text-foreground/80 sm:text-lg">
          World Enterprises Business Unified Operating System —{" "}
          <span className="font-semibold text-foreground">Connecting &amp; Powering the Ecosystem.</span>
        </p>
        <SearchBar />
        <div className="mt-5 flex w-full max-w-[620px] flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link href="/business-taxonomy" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft backdrop-blur-sm transition-all hover:bg-card hover:shadow-soft-lg sm:w-auto">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />Advanced Search
          </Link>
          <Link href="/business-taxonomy" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow sm:w-auto">
            <Compass className="h-4 w-4" />Browse Ecosystems
          </Link>
        </div>
        <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {ecosystems.map(seg => {
            const color = getColor(seg.categories[0]?.color ?? "blue");
            return (
              <Link key={seg.id} href={`/business-taxonomy/${seg.id}`} className={cn("group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-md transition-all hover:bg-card/80 hover:shadow-soft hover:-translate-y-0.5", color.border)}>
                <span className={cn("absolute left-0 top-0 h-full w-1 transition-all group-hover:w-1.5", color.dot)} />
                <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110", color.iconBg, color.iconText)}>
                  <DynamicIcon name={seg.icon} className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", accentText(seg.accent))}>{seg.number}</p>
                  <p className="text-xs font-semibold leading-tight text-foreground sm:text-[13px]">{seg.name}</p>
                </div>
                <ArrowRight className={cn("h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100", accentText(seg.accent))} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
