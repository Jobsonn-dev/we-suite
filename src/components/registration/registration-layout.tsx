"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/"><WebuosLogo size="md" /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />Back to WEBUOS
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">The global business discovery platform.</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70 xl:text-base">Join thousands of companies, professionals and buyers searching, selling and trading across three core business ecosystems.</p>
          <ul className="mt-8 space-y-4">
            {[
              { t: "Global search", d: "Find any company, product or service in one place." },
              { t: "Verified ecosystem", d: "Buy, sell and trade with confidence." },
              { t: "Built for the modern economy", d: "Industrial · Technology & AI · Business Services." },
            ].map(i => (
              <li key={i.t} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white"><span className="h-2 w-2 rounded-full bg-amber-400" /></span>
                <div><p className="text-sm font-semibold text-white">{i.t}</p><p className="text-xs text-white/60">{i.d}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Three business ecosystems</p>
          <div className="grid grid-cols-3 gap-2">
            {ecosystems.map(seg => {
              const color = getColor(seg.categories[0]?.color ?? "blue");
              return (
                <Link key={seg.id} href={`/business-taxonomy/${seg.id}`} className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.08]">
                  <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", color.iconBg, color.iconText)}><DynamicIcon name={seg.icon} className="h-4 w-4" /></span>
                  <div>
                    <p className={cn("text-[10px] font-bold", accentText(seg.accent))}>{seg.number}</p>
                    <p className="text-[11px] font-semibold leading-tight text-white/90">{seg.shortName}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Link href="/"><WebuosLogo size="sm" /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-3.5 w-3.5" />Back
          </Link>
        </div>
        <div className="hidden items-center justify-end gap-2 px-8 pt-6 lg:flex">
          <span className="text-xs font-medium text-muted-foreground">EN</span>
          <span className="text-muted-foreground/40">·</span>
          <Link href="/login" className="text-xs font-semibold text-foreground hover:underline">Sign in</Link>
        </div>
        <div className="flex flex-1 items-start justify-center px-4 py-6 sm:px-6 lg:items-center lg:overflow-y-auto lg:py-8">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
