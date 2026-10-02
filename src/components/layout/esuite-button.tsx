"use client";

import { useState, useRef, useEffect } from "react";
import {
  Layers, ChevronDown, X, Search,
  MessageSquare, StickyNote, Bot, KanbanSquare, Contact, Briefcase,
  MapPin, Video, ShoppingCart, FolderOpen, Globe, UserPlus,
  Mail, Calendar, BarChart3, FileText, Wallet, CreditCard,
  Truck, Package, Users, Settings, Shield, Bell, Star, CheckSquare,
  Database, Cloud, Cpu, Code2, PenTool,
  LogOut, ArrowRight, LayoutGrid, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// ESuite Ecosystem App Launcher
// Small icon-over-name tiles in a responsive grid
// "ESUITE ECOSYSTEM" header in cyan, dark navy background
// ============================================================

interface AppDef {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
  // Solid background color for the icon tile (tailwind class)
  iconBg: string;
  href: string;
}

const apps: AppDef[] = [
  // Communication & Collaboration
  { id: "chat", name: "Chat", icon: MessageSquare, desc: "Real-time messaging", iconBg: "bg-[#00B4D8]", href: "/dashboard" },
  { id: "meets", name: "Meets", icon: Video, desc: "Video meetings & calls", iconBg: "bg-[#A855F7]", href: "/dashboard" },
  { id: "mail", name: "Mail", icon: Mail, desc: "Business email", iconBg: "bg-[#3B82F6]", href: "/dashboard" },
  { id: "notes", name: "Notes", icon: StickyNote, desc: "Capture ideas & knowledge", iconBg: "bg-[#8B5CF6]", href: "/dashboard" },
  // AI & Automation
  { id: "ai-bot", name: "AI Bot", icon: Bot, desc: "AI assistant for business", iconBg: "bg-[#14B8A6]", href: "/dashboard" },
  { id: "ai-flow", name: "AI Flow", icon: Cpu, desc: "AI workflow builder", iconBg: "bg-[#06B6D4]", href: "/dashboard" },
  // Productivity & Projects
  { id: "boards", name: "Boards", icon: KanbanSquare, desc: "Kanban project boards", iconBg: "bg-[#F97316]", href: "/dashboard" },
  { id: "calendar", name: "Calendar", icon: Calendar, desc: "Schedule & events", iconBg: "bg-[#EF4444]", href: "/dashboard" },
  { id: "tasks", name: "Tasks", icon: CheckSquare, desc: "Task management", iconBg: "bg-[#22D3EE]", href: "/dashboard" },
  { id: "docs", name: "Docs", icon: FileText, desc: "Document editor", iconBg: "bg-[#0EA5E9]", href: "/dashboard" },
  // CRM & Sales
  { id: "crm", name: "CRM", icon: Contact, desc: "Customer relationships", iconBg: "bg-[#3B82F6]", href: "/dashboard" },
  { id: "visit", name: "Visit & Leads", icon: MapPin, desc: "Discovery & lead tracking", iconBg: "bg-[#10B981]", href: "/dashboard" },
  { id: "pipeline", name: "Pipeline", icon: BarChart3, desc: "Sales pipeline & deals", iconBg: "bg-[#F59E0B]", href: "/dashboard" },
  // Finance & Commerce
  { id: "wallet", name: "Wallet", icon: Wallet, desc: "Business wallet & payments", iconBg: "bg-[#10B981]", href: "/dashboard" },
  { id: "invoices", name: "Invoices", icon: CreditCard, desc: "Billing & invoicing", iconBg: "bg-[#6366F1]", href: "/dashboard" },
  { id: "purchases", name: "Purchases", icon: ShoppingCart, desc: "Procurement & orders", iconBg: "bg-[#0EA5E9]", href: "/dashboard" },
  { id: "logistics", name: "Logistics", icon: Truck, desc: "Shipments & delivery", iconBg: "bg-[#F97316]", href: "/dashboard" },
  { id: "inventory", name: "Inventory", icon: Package, desc: "Stock & warehouse", iconBg: "bg-[#14B8A6]", href: "/dashboard" },
  // Workspace & People
  { id: "workspace", name: "Workspace", icon: Briefcase, desc: "Your business workspace", iconBg: "bg-[#EC4899]", href: "/dashboard" },
  { id: "files", name: "Files", icon: FolderOpen, desc: "Document storage & sharing", iconBg: "bg-[#22D3EE]", href: "/dashboard" },
  { id: "network", name: "Network", icon: Globe, desc: "Business connections", iconBg: "bg-[#D946EF]", href: "/dashboard" },
  { id: "hiring", name: "Hiring", icon: UserPlus, desc: "Recruitment & talent", iconBg: "bg-[#F43F5E]", href: "/dashboard" },
  { id: "team", name: "Team", icon: Users, desc: "Team & directory", iconBg: "bg-[#8B5CF6]", href: "/dashboard" },
  // Insights & Tools
  { id: "analytics", name: "Analytics", icon: BarChart3, desc: "Reports & insights", iconBg: "bg-[#06B6D4]", href: "/dashboard" },
  { id: "database", name: "Database", icon: Database, desc: "Data & records", iconBg: "bg-[#6366F1]", href: "/dashboard" },
  { id: "cloud", name: "Cloud", icon: Cloud, desc: "Cloud storage & apps", iconBg: "bg-[#0EA5E9]", href: "/dashboard" },
  { id: "devtools", name: "DevTools", icon: Code2, desc: "Developer tools", iconBg: "bg-[#14B8A6]", href: "/dashboard" },
  { id: "design", name: "Design", icon: PenTool, desc: "Brand & creative assets", iconBg: "bg-[#EC4899]", href: "/dashboard" },
  { id: "security", name: "Security", icon: Shield, desc: "Security & compliance", iconBg: "bg-[#EF4444]", href: "/dashboard" },
  { id: "alerts", name: "Alerts", icon: Bell, desc: "Notifications & alerts", iconBg: "bg-[#F59E0B]", href: "/dashboard" },
  { id: "favorites", name: "Favorites", icon: Star, desc: "Saved & starred items", iconBg: "bg-[#FACC15]", href: "/dashboard" },
  { id: "settings", name: "Settings", icon: Settings, desc: "Account & preferences", iconBg: "bg-[#64748B]", href: "/dashboard" },
];

export const esuiteApps = apps;

export function ESuiteButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSelected(null);
      }
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setSelected(null));
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const filtered = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase()),
  );
  const activeApp = apps.find((a) => a.id === selected);

  function openApp(app: AppDef) {
    setOpen(false);
    setSelected(null);
    window.location.href = app.href;
  }

  return (
    <>
      {/* Trigger button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setSelected(null);
        }}
        aria-label={variant === "icon" ? "Open ESuite applications" : "Open ESuite"}
        title={variant === "icon" ? "Applications" : "ESuite"}
        className={cn(
          "inline-flex items-center justify-center transition-all",
          variant === "icon"
            ? "h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            : "h-9 gap-1.5 rounded-full border px-3 text-xs font-bold uppercase tracking-wider",
          variant === "pill" &&
            (open
              ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
              : "border-cyan-400/60 bg-cyan-50/50 text-cyan-700 hover:border-cyan-500 hover:bg-cyan-50 dark:bg-cyan-500/5 dark:text-cyan-400 dark:hover:bg-cyan-500/10"),
        )}
      >
        {variant === "icon" ? (
          <LayoutGrid className="h-4 w-4" />
        ) : (
          <>
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ESuite</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>

      {/* Fullscreen modal */}
      {open && (
        <div
          ref={panelRef}
          className="fixed inset-0 z-[60] flex h-screen w-screen flex-col overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(139,92,246,0.08) 0%, transparent 60%), #0B0F19",
            animation: "fadeIn .2s ease-out",
          }}
        >
          {/* Subtle starfield */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(1.5px 1.5px at 10% 15%, #fff, transparent), radial-gradient(1px 1px at 25% 60%, #67e8f9, transparent), radial-gradient(1.5px 1.5px at 45% 25%, #fff, transparent), radial-gradient(1px 1px at 65% 80%, #c4b5fd, transparent), radial-gradient(1.5px 1.5px at 80% 35%, #fff, transparent), radial-gradient(1px 1px at 90% 70%, #67e8f9, transparent)",
              backgroundSize: "350px 350px",
            }}
          />
          {/* Bottom glow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
            style={{
              background: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(34,211,238,0.15), transparent 70%)",
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-10 sm:py-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/40">
                <Layers className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-cyan-400 sm:text-xl">
                  ESuite Ecosystem
                </h2>
                <p className="text-[11px] text-white/50 sm:text-xs">
                  Your business application suite · {apps.length} apps
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSelected(null);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close ESuite"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-thin sm:px-10 sm:py-8">
              <div className="mx-auto max-w-5xl">
                {/* Search */}
                <div className="mb-6 relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search applications..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    autoFocus
                  />
                </div>

                {/* Section label */}
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80">
                  {activeApp ? "Selected application" : "All applications"}
                </p>

                {/* Small icon-over-name tile grid */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8">
                  {filtered.map((app) => {
                    const Icon = app.icon;
                    const isActive = selected === app.id;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelected(isActive ? null : app.id)}
                        title={app.desc}
                        className={cn(
                          "group flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition-all duration-200",
                          isActive
                            ? "bg-white/[0.08] ring-1 ring-cyan-500/40"
                            : "hover:bg-white/[0.05]",
                        )}
                      >
                        {/* Small colored rounded-square icon */}
                        <span
                          className={cn(
                            "inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-200 group-hover:scale-110 sm:h-12 sm:w-12",
                            app.iconBg,
                          )}
                        >
                          <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                        </span>
                        {/* App name */}
                        <span
                          className={cn(
                            "block truncate text-[11px] font-medium sm:text-xs",
                            isActive ? "text-white" : "text-white/70 group-hover:text-white",
                          )}
                        >
                          {app.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* No results */}
                {filtered.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] py-10 text-center">
                    <p className="text-sm text-white/60">
                      No applications found for &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}

                {/* Active app detail panel */}
                {activeApp && (
                  <div
                    className="mt-6 rounded-2xl border border-cyan-500/20 bg-white/[0.04] p-5 sm:p-6"
                    style={{ animation: "fadeIn .2s ease-out" }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            "inline-flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg",
                            activeApp.iconBg,
                          )}
                        >
                          <activeApp.icon className="h-7 w-7" />
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-white sm:text-xl">
                            {activeApp.name}
                          </h3>
                          <p className="text-sm text-white/60">{activeApp.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(null)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Exit
                        </button>
                        <button
                          type="button"
                          onClick={() => openApp(activeApp)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold text-cyan-950 transition-colors hover:bg-cyan-400"
                        >
                          Open
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Helper text */}
                {!activeApp && filtered.length > 0 && (
                  <p className="mt-6 text-center text-xs text-white/40">
                    Click an application to view details · {filtered.length} of {apps.length} apps
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 bg-black/30 px-5 py-3 sm:px-10">
              <p className="text-[11px] text-white/40">
                WEBUOS ESuite Ecosystem · {apps.length} apps
              </p>
              <a
                href="/dashboard"
                onClick={() => {
                  setOpen(false);
                  setSelected(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Open Dashboard
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
