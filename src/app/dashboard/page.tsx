"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  Building2,
  Store,
  Network,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ArrowRight,
  Plus,
  Users,
  Package,
  Sparkles,
  TrendingUp,
  FileText,
  MessageSquare,
  Briefcase,
  ChevronRight,
  Globe,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "network", label: "Network", icon: Network },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const stats = [
  { label: "Companies", icon: Building2, hint: "Verified businesses" },
  { label: "Products", icon: Package, hint: "Listed items" },
  { label: "Network", icon: Users, hint: "Connected members" },
  { label: "Insights", icon: TrendingUp, hint: "Trending signals" },
];

const quickActions = [
  { label: "New search", icon: Search, desc: "Find any company, product or service" },
  { label: "Create listing", icon: Plus, desc: "List a new product or service" },
  { label: "Send inquiry", icon: MessageSquare, desc: "Reach out to a supplier" },
  { label: "Build profile", icon: Briefcase, desc: "Complete your business profile" },
  { label: "Browse reports", icon: FileText, desc: "Read market insights" },
  { label: "Explore taxonomy", icon: Sparkles, desc: "Three core ecosystems" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Link href="/" className="flex items-center px-1 py-1" onClick={onNavigate}>
        <WebuosLogo size="sm" />
      </Link>

      <nav className="space-y-0.5">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href="#"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.active && (
                <span className="ml-auto inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Ecosystems
        </p>
        {ecosystems.map((eco) => {
          const color = getColor(eco.categories[0]?.color ?? "blue");
          return (
            <Link
              key={eco.id}
              href={`/business-taxonomy/${eco.id}`}
              onClick={onNavigate}
              className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md",
                  color.iconBg,
                  color.iconText
                )}
              >
                <DynamicIcon name={eco.icon} className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">{eco.shortName}</span>
              <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>

      <div className="mt-auto space-y-0.5 border-t border-border pt-3">
        <Link
          href="#"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <PageShell className="bg-muted/20">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:sticky lg:top-[60px] lg:block lg:h-[calc(100vh-60px)]">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-64 border-r border-border bg-card shadow-soft-lg">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Dashboard top bar */}
          <div className="sticky top-[60px] z-40 border-b border-border bg-background/95 backdrop-blur-md">
            <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative hidden flex-1 max-w-md items-center sm:flex">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search companies, products, services..."
                  className="h-9 rounded-full border-border bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-primary/15"
                />
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Language"
                >
                  <Globe className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </button>
                <div className="ml-1 flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[11px] font-bold text-white">
                    WU
                  </span>
                  <span className="hidden text-xs font-semibold sm:inline">
                    WEBUOS User
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Welcome banner */}
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e1b4b] p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
                    Dashboard
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Hello, WEBUOS User
                  </h1>
                  <p className="text-sm text-white/70">
                    Welcome back. Discover, connect and trade across three
                    business ecosystems.
                  </p>
                </div>
                <Link
                  href="/business-taxonomy"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90"
                >
                  Start a new search <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Stat cards */}
            <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-card p-4 shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Soon
                      </span>
                    </div>
                    <p className="mt-3 text-3xl font-bold tracking-tight">—</p>
                    <p className="mt-0.5 text-xs font-medium text-foreground">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.hint}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Ecosystem cards */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold tracking-tight sm:text-lg">
                    Three core ecosystems
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Explore companies, products and services by ecosystem.
                  </p>
                </div>
                <Link
                  href="/business-taxonomy"
                  className="hidden text-xs font-semibold text-foreground hover:underline sm:inline-flex sm:items-center sm:gap-1"
                >
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ecosystems.map((eco) => {
                  const color = getColor(eco.categories[0]?.color ?? "blue");
                  return (
                    <Link
                      key={eco.id}
                      href={`/business-taxonomy/${eco.id}`}
                      className={cn(
                        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg",
                        color.border
                      )}
                    >
                      <div className="relative h-24 w-full overflow-hidden">
                        <img
                          src={eco.image}
                          alt={eco.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="absolute left-3 top-2 font-mono text-xl font-bold text-white/95">
                          {eco.number}
                        </span>
                        <span
                          className={cn(
                            "absolute right-3 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-soft",
                            color.iconText
                          )}
                        >
                          <DynamicIcon name={eco.icon} className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-sm font-bold leading-tight">
                          {eco.name}
                        </h3>
                        <p
                          className={cn(
                            "mt-1 text-[11px] font-semibold uppercase tracking-wide",
                            accentText(eco.accent)
                          )}
                        >
                          {eco.tagline}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {eco.description}
                        </p>
                        <div
                          className={cn(
                            "mt-3 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                            color.chipBg,
                            color.chipText
                          )}
                        >
                          <span>Explore {eco.shortName}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Quick actions + Recent activity */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Quick actions */}
              <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-tight">
                    Quick actions
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    View-only
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {quickActions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.label}
                        type="button"
                        className="group flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-soft"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="text-xs font-semibold leading-tight">
                          {a.label}
                        </p>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {a.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent activity */}
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-tight">
                    Recent activity
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Loading
                  </span>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-muted" />
                        <div className="h-2 w-1/2 animate-pulse rounded-full bg-muted/70" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* View-only footer note */}
            <p className="text-center text-[11px] text-muted-foreground">
              view-only prototype — no data is persisted
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
