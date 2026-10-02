"use client";

import { useState, useRef, useEffect } from "react";
import {
  Layers, ChevronDown, X, Search, MessageSquare, StickyNote, Bot,
  KanbanSquare, Contact, Briefcase, MapPin, Video, ShoppingCart,
  FolderOpen, Globe, UserPlus, LogOut, ArrowRight, LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// ESuite Ecosystem App Launcher
// 2-column horizontal list with circular colored icons
// "ESUITE ECOSYSTEM" header in cyan, dark navy background
// ============================================================

interface AppDef {
  id: string;
  name: string;
  icon: typeof MessageSquare;
  desc: string;
  // Solid background color for the circular icon (hex or tailwind class)
  iconBg: string;
  // App page route (relative)
  href: string;
}

const apps: AppDef[] = [
  { id: "chat", name: "Chat", icon: MessageSquare, desc: "Real-time messaging", iconBg: "bg-[#00B4D8]", href: "/dashboard" },
  { id: "notes", name: "Notes", icon: StickyNote, desc: "Capture ideas & knowledge", iconBg: "bg-[#8B5CF6]", href: "/dashboard" },
  { id: "ai-bot", name: "AI Bot", icon: Bot, desc: "AI assistant for business", iconBg: "bg-[#14B8A6]", href: "/dashboard" },
  { id: "boards", name: "Boards", icon: KanbanSquare, desc: "Kanban project boards", iconBg: "bg-[#F97316]", href: "/dashboard" },
  { id: "crm", name: "CRM", icon: Contact, desc: "Customer relationships", iconBg: "bg-[#3B82F6]", href: "/dashboard" },
  { id: "workspace", name: "Workspace", icon: Briefcase, desc: "Your business workspace", iconBg: "bg-[#EC4899]", href: "/dashboard" },
  { id: "visit", name: "Visit & Leads", icon: MapPin, desc: "Discovery & lead tracking", iconBg: "bg-[#10B981]", href: "/dashboard" },
  { id: "meets", name: "Meets", icon: Video, desc: "Video meetings & calls", iconBg: "bg-[#A855F7]", href: "/dashboard" },
  { id: "purchases", name: "Purchases", icon: ShoppingCart, desc: "Procurement & orders", iconBg: "bg-[#0EA5E9]", href: "/dashboard" },
  { id: "files", name: "Files", icon: FolderOpen, desc: "Document storage & sharing", iconBg: "bg-[#22D3EE]", href: "/dashboard" },
  { id: "network", name: "Network", icon: Globe, desc: "Business connections", iconBg: "bg-[#D946EF]", href: "/dashboard" },
  { id: "hiring", name: "Hiring", icon: UserPlus, desc: "Recruitment & talent", iconBg: "bg-[#F43F5E]", href: "/dashboard" },
];

export function ESuiteButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) {
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
              background:
                "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(34,211,238,0.15), transparent 70%)",
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
              <div className="mx-auto max-w-3xl">
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

                {/* 2-column horizontal app list */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {filtered.map((app) => {
                    const Icon = app.icon;
                    const isActive = selected === app.id;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelected(isActive ? null : app.id)}
                        className={cn(
                          "group flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200 sm:px-5 sm:py-4",
                          isActive
                            ? "bg-white/[0.08] ring-1 ring-cyan-500/40"
                            : "hover:bg-white/[0.05]",
                        )}
                      >
                        {/* Circular colored icon */}
                        <span
                          className={cn(
                            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14",
                            app.iconBg,
                          )}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                        {/* App name + description */}
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-semibold text-white sm:text-lg">
                            {app.name}
                          </span>
                          <span className="block truncate text-xs text-white/50 sm:text-[13px]">
                            {app.desc}
                          </span>
                        </span>
                        {/* Hover arrow */}
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 shrink-0 text-cyan-400 transition-all",
                            isActive
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                          )}
                        />
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
                            "inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg",
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
