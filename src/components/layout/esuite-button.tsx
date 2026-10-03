"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LayoutGrid, Search, X, Pencil, ArrowRight,
  Building2, Users, Layers, Wallet, Calculator, TrendingUp, Megaphone,
  ShoppingCart, Package, ListChecks, FileText, MessageSquare, Video,
  Headphones, BarChart3, Brain, Workflow, Zap, ShieldCheck, Settings,
  UserSquare, Truck, Handshake, Globe, Plug, FileBarChart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Premium Apps Launcher — glassmorphic dropdown with search,
// categories, animations, and hover glow effects
// ============================================================

interface AppDef {
  name: string;
  icon: LucideIcon;
  gradient: string;
  href: string;
  category: string;
}

const APPS: AppDef[] = [
  // Core Business
  { name: "Business", icon: Building2, gradient: "from-blue-500 to-blue-600", href: "/dashboard", category: "Core" },
  { name: "CRM", icon: Users, gradient: "from-cyan-400 to-blue-500", href: "/dashboard", category: "Core" },
  { name: "ERP", icon: Layers, gradient: "from-blue-500 to-purple-500", href: "/dashboard", category: "Core" },
  { name: "HR", icon: Users, gradient: "from-emerald-400 to-teal-500", href: "/dashboard", category: "Core" },
  // Finance
  { name: "Finance", icon: Wallet, gradient: "from-amber-400 to-orange-500", href: "/dashboard", category: "Finance" },
  { name: "Accounting", icon: Calculator, gradient: "from-emerald-400 to-green-500", href: "/dashboard", category: "Finance" },
  { name: "Sales", icon: TrendingUp, gradient: "from-blue-400 to-indigo-500", href: "/dashboard", category: "Finance" },
  { name: "Marketing", icon: Megaphone, gradient: "from-purple-400 to-pink-500", href: "/dashboard", category: "Finance" },
  // Commerce
  { name: "Marketplace", icon: ShoppingCart, gradient: "from-orange-400 to-red-500", href: "/dashboard", category: "Commerce" },
  { name: "Procurement", icon: ShoppingCart, gradient: "from-cyan-400 to-blue-500", href: "/dashboard", category: "Commerce" },
  { name: "Inventory", icon: Package, gradient: "from-amber-400 to-yellow-500", href: "/dashboard", category: "Commerce" },
  { name: "Suppliers", icon: Truck, gradient: "from-orange-400 to-red-500", href: "/dashboard", category: "Commerce" },
  // Productivity
  { name: "Projects", icon: ListChecks, gradient: "from-violet-400 to-purple-500", href: "/dashboard", category: "Productivity" },
  { name: "Tasks", icon: ListChecks, gradient: "from-teal-400 to-cyan-500", href: "/dashboard", category: "Productivity" },
  { name: "Documents", icon: FileText, gradient: "from-blue-400 to-cyan-500", href: "/dashboard", category: "Productivity" },
  { name: "Reports", icon: FileBarChart, gradient: "from-purple-400 to-indigo-500", href: "/dashboard", category: "Productivity" },
  // Communication
  { name: "Communication", icon: MessageSquare, gradient: "from-cyan-400 to-blue-500", href: "/dashboard", category: "Communication" },
  { name: "Meetings", icon: Video, gradient: "from-purple-400 to-violet-500", href: "/dashboard", category: "Communication" },
  { name: "Support", icon: Headphones, gradient: "from-green-400 to-emerald-500", href: "/dashboard", category: "Communication" },
  { name: "Customers", icon: UserSquare, gradient: "from-amber-400 to-orange-500", href: "/dashboard", category: "Communication" },
  // Intelligence
  { name: "Analytics", icon: BarChart3, gradient: "from-blue-400 to-cyan-500", href: "/dashboard", category: "Intelligence" },
  { name: "AI", icon: Brain, gradient: "from-cyan-400 to-blue-600", href: "/dashboard", category: "Intelligence" },
  { name: "Search", icon: Search, gradient: "from-indigo-400 to-blue-500", href: "/search", category: "Intelligence" },
  { name: "Workflow", icon: Workflow, gradient: "from-violet-400 to-purple-500", href: "/dashboard", category: "Intelligence" },
  // System
  { name: "Automation", icon: Zap, gradient: "from-amber-400 to-orange-500", href: "/dashboard", category: "System" },
  { name: "Security", icon: ShieldCheck, gradient: "from-red-400 to-rose-500", href: "/dashboard", category: "System" },
  { name: "Admin", icon: Settings, gradient: "from-slate-400 to-slate-500", href: "/dashboard", category: "System" },
  { name: "Settings", icon: Settings, gradient: "from-slate-400 to-slate-500", href: "/dashboard", category: "System" },
  // Network
  { name: "Partners", icon: Handshake, gradient: "from-amber-400 to-orange-500", href: "/dashboard", category: "Network" },
  { name: "Ecosystem", icon: Globe, gradient: "from-cyan-400 to-blue-500", href: "/business-taxonomy", category: "Network" },
  { name: "Integrations", icon: Plug, gradient: "from-blue-400 to-indigo-500", href: "/dashboard", category: "Network" },
  { name: "Employees", icon: Users, gradient: "from-teal-400 to-green-500", href: "/dashboard", category: "Network" },
];

// Favorite apps shown in the top card
const FAVORITE_NAMES = ["Business", "CRM", "ERP", "HR", "Finance", "AI", "Analytics", "Search", "Communication"];

const CATEGORY_LABELS: Record<string, string> = {
  "Core": "Core Business",
  "Finance": "Finance & Sales",
  "Commerce": "Commerce",
  "Productivity": "Productivity",
  "Communication": "Communication",
  "Intelligence": "Intelligence",
  "System": "System",
  "Network": "Network",
};

export function ESuiteButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(FAVORITE_NAMES);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditMode(false);
        setSearch("");
      }
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setEditMode(false), setSearch(""));
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Filter apps by search
  const filteredApps = useMemo(() => {
    if (!search.trim()) return APPS;
    const q = search.toLowerCase();
    return APPS.filter(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [search]);

  // Group filtered apps by category
  const groupedApps = useMemo(() => {
    const groups: Record<string, AppDef[]> = {};
    for (const app of filteredApps) {
      if (!groups[app.category]) groups[app.category] = [];
      groups[app.category].push(app);
    }
    return groups;
  }, [filteredApps]);

  // Favorite apps data
  const favoriteApps = useMemo(() => {
    return favorites.map(name => APPS.find(a => a.name === name)).filter(Boolean) as AppDef[];
  }, [favorites]);

  function toggleFavorite(name: string) {
    setFavorites(prev => {
      if (prev.includes(name)) {
        if (prev.length <= 3) return prev; // Keep at least 3
        return prev.filter(n => n !== name);
      }
      if (prev.length >= 9) return prev; // Max 9
      return [...prev, name];
    });
  }

  // ── ESuite link (pill variant) ──
  if (variant === "pill") {
    return (
      <a
        href="https://esuite.webuos.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open ESuite"
        title="Open ESuite"
        className="group inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
      >
        <Layers className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 group-hover:text-cyan-400" />
        <span className="hidden text-xs font-semibold tracking-wide text-slate-400 transition-colors duration-200 group-hover:text-white sm:inline">
          ESuite
        </span>
      </a>
    );
  }

  // ── Apps launcher (icon variant) ──
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="WEBUOS Apps"
        title="All Apps"
        className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
      >
        <LayoutGrid className={cn("h-[18px] w-[18px] transition-transform duration-200", open ? "scale-90 text-cyan-400" : "group-hover:scale-110")} />
        {/* Active indicator dot */}
        <span className={cn(
          "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 transition-all duration-300",
          open ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
        )} />
      </button>

      {/* ── Premium dropdown panel ── */}
      {open && (
        <div
          ref={panelRef}
          className="fixed right-0 top-0 z-[70] flex h-screen w-screen flex-col overflow-hidden"
          style={{
            background: "rgba(10, 14, 26, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            animation: "fadeIn .2s ease-out",
          }}
        >
          {/* Animated background glow */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]" />
            <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />
          </div>

          {/* Starfield particles */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(1px 1px at 10% 15%, #fff, transparent), radial-gradient(1.5px 1.5px at 25% 60%, #67e8f9, transparent), radial-gradient(1px 1px at 45% 25%, #fff, transparent), radial-gradient(1px 1px at 65% 80%, #c4b5fd, transparent), radial-gradient(1.5px 1.5px at 80% 35%, #fff, transparent), radial-gradient(1px 1px at 90% 70%, #67e8f9, transparent)",
              backgroundSize: "300px 300px",
            }}
          />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                <LayoutGrid className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-cyan-400 sm:text-xl">
                  WEBUOS Apps
                </h2>
                <p className="text-[11px] text-white/50 sm:text-xs">
                  {APPS.length} applications · {favorites.length} favorites
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); setEditMode(false); setSearch(""); }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative z-10 px-6 py-4 sm:px-10">
            <div className="relative mx-auto max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps..."
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin sm:px-10">
            <div className="mx-auto max-w-3xl">
              {/* ── Favorites card (only when not searching and not editing) ── */}
              {!search.trim() && (
                <div
                  className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-2xl"
                  style={{ animation: "fadeInUp .3s ease-out" }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">Your Favorites</h3>
                    <button
                      type="button"
                      onClick={() => setEditMode(!editMode)}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                        editMode
                          ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-400/40"
                          : "text-white/40 hover:bg-white/5 hover:text-white"
                      )}
                      aria-label="Edit favorites"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
                    {favoriteApps.map((app, idx) => {
                      const Icon = app.icon;
                      return (
                        <Link
                          key={app.name}
                          href={editMode ? "#" : app.href}
                          onClick={(e) => { if (editMode) e.preventDefault(); else { setOpen(false); } }}
                          className="group flex flex-col items-center gap-2"
                          style={{ animation: `fadeInUp .3s ease-out ${idx * 0.05}s both` }}
                        >
                          <span
                            className={cn(
                              "relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/30",
                              app.gradient,
                              editMode && "ring-2 ring-white/20"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {editMode && (
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(app.name); }}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </span>
                          <span className="text-center text-[11px] font-medium text-white/70 group-hover:text-white">
                            {app.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  {editMode && (
                    <p className="mt-3 text-center text-xs text-white/40">
                      Tap the ✕ to remove a favorite. Tap an app below to add it.
                    </p>
                  )}
                </div>
              )}

              {/* ── All apps grouped by category ── */}
              {search.trim() ? (
                // Search results — flat grid
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {filteredApps.map((app, idx) => {
                    const Icon = app.icon;
                    return (
                      <Link
                        key={app.name}
                        href={app.href}
                        onClick={() => setOpen(false)}
                        className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-white/5"
                        style={{ animation: `fadeInUp .2s ease-out ${idx * 0.03}s both` }}
                      >
                        <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110", app.gradient)}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-center text-[11px] font-medium text-white/70 group-hover:text-white">{app.name}</span>
                      </Link>
                    );
                  })}
                  {filteredApps.length === 0 && (
                    <div className="col-span-full py-10 text-center text-sm text-white/40">
                      No apps found for &ldquo;{search}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                // All apps grouped by category
                Object.entries(groupedApps).map(([category, apps], catIdx) => {
                  // In edit mode, show add buttons for non-favorites
                  const displayApps = editMode
                    ? apps.filter(a => !favorites.includes(a.name))
                    : apps;
                  if (editMode && displayApps.length === 0) return null;

                  return (
                    <div key={category} className="mb-5">
                      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-cyan-400/60">
                        {CATEGORY_LABELS[category] || category}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                        {displayApps.map((app, idx) => {
                          const Icon = app.icon;
                          return (
                            <Link
                              key={app.name}
                              href={editMode ? "#" : app.href}
                              onClick={(e) => {
                                if (editMode) { e.preventDefault(); toggleFavorite(app.name); }
                                else { setOpen(false); }
                              }}
                              className="group flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all hover:bg-white/5"
                              style={{ animation: `fadeInUp .2s ease-out ${idx * 0.03}s both` }}
                            >
                              <span
                                className={cn(
                                  "relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all duration-300 group-hover:scale-110",
                                  app.gradient,
                                  editMode && favorites.includes(app.name) && "opacity-30",
                                  editMode && !favorites.includes(app.name) && "ring-2 ring-cyan-400/30"
                                )}
                              >
                                <Icon className="h-5 w-5" />
                                {editMode && !favorites.includes(app.name) && (
                                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-cyan-950">+</span>
                                )}
                              </span>
                              <span className="text-center text-[10px] font-medium text-white/60 group-hover:text-white sm:text-[11px]">{app.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}

              {/* ESuite CTA */}
              {!search.trim() && !editMode && (
                <div className="mt-6 flex items-center justify-center">
                  <a
                    href="https://esuite.webuos.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-2.5 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
                  >
                    Open ESuite
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
