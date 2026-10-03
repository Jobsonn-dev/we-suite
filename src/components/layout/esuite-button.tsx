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
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
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

      {/* ── Dropdown panel (positioned below the button, NOT full-screen) ── */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-[calc(100%+8px)] z-[70] flex max-h-[calc(100vh-80px)] w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          style={{
            background: "rgba(15, 20, 32, 0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            animation: "fadeIn .2s ease-out",
            transformOrigin: "top right",
          }}
        >
          {/* Subtle top border glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          {/* Top bar — compact */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                <LayoutGrid className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-cyan-400">
                  WEBUOS Apps
                </h2>
                <p className="text-[10px] text-white/50">
                  {APPS.length} apps · {favorites.length} favorites
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); setEditMode(false); setSearch(""); }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search bar — compact */}
          <div className="relative z-10 px-3 py-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps..."
                className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-8 text-xs text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="relative z-10 flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
            <div className="w-full">
              {/* ── Favorites card (only when not searching and not editing) ── */}
              {!search.trim() && (
                <div
                  className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-3"
                  style={{ animation: "fadeInUp .3s ease-out" }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/80">Your Favorites</h3>
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
                  <div className="grid grid-cols-3 gap-2">
                    {favoriteApps.map((app, idx) => {
                      const Icon = app.icon;
                      return (
                        <Link
                          key={app.name}
                          href={editMode ? "#" : app.href}
                          onClick={(e) => { if (editMode) e.preventDefault(); else { setOpen(false); } }}
                          className="group flex flex-col items-center gap-1.5"
                          style={{ animation: `fadeInUp .3s ease-out ${idx * 0.05}s both` }}
                        >
                          <span
                            className={cn(
                              "relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md transition-all duration-300 group-hover:scale-110",
                              app.gradient,
                              editMode && "ring-2 ring-white/20"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {editMode && (
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(app.name); }}
                                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </span>
                          <span className="text-center text-[10px] font-medium text-white/60 group-hover:text-white">
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
                // Search results — compact grid
                <div className="grid grid-cols-3 gap-2">
                  {filteredApps.map((app, idx) => {
                    const Icon = app.icon;
                    return (
                      <Link
                        key={app.name}
                        href={app.href}
                        onClick={() => setOpen(false)}
                        className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all hover:bg-white/5"
                        style={{ animation: `fadeInUp .2s ease-out ${idx * 0.03}s both` }}
                      >
                        <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:scale-110", app.gradient)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-center text-[10px] font-medium text-white/60 group-hover:text-white">{app.name}</span>
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
                    <div key={category} className="mb-3">
                      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400/60">
                        {CATEGORY_LABELS[category] || category}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
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
                              className="group flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-all hover:bg-white/5"
                              style={{ animation: `fadeInUp .2s ease-out ${idx * 0.03}s both` }}
                            >
                              <span
                                className={cn(
                                  "relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md transition-all duration-300 group-hover:scale-110",
                                  app.gradient,
                                  editMode && favorites.includes(app.name) && "opacity-30",
                                  editMode && !favorites.includes(app.name) && "ring-2 ring-cyan-400/30"
                                )}
                              >
                                <Icon className="h-4 w-4" />
                                {editMode && !favorites.includes(app.name) && (
                                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-500 text-[8px] font-bold text-cyan-950">+</span>
                                )}
                              </span>
                              <span className="text-center text-[9px] font-medium text-white/60 group-hover:text-white sm:text-[10px]">{app.name}</span>
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
                <div className="mt-4 flex items-center justify-center border-t border-white/10 pt-3">
                  <a
                    href="https://esuite.webuos.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
                  >
                    Open ESuite
                    <ArrowRight className="h-3 w-3" />
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
