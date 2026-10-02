"use client";

import { useState, useRef, useEffect } from "react";
import {
  Layers, ChevronDown, X, Search, MessageSquare, StickyNote, Bot,
  KanbanSquare, Contact, Briefcase, MapPin, Video, ShoppingCart,
  FolderOpen, Globe, UserPlus, LogOut, ArrowRight, LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const apps = [
  { id: "chat", name: "Chat", icon: MessageSquare, desc: "Real-time messaging", color: "cyan" },
  { id: "notes", name: "Notes", icon: StickyNote, desc: "Capture ideas", color: "amber" },
  { id: "ai-bot", name: "AI Bot", icon: Bot, desc: "AI assistant", color: "violet" },
  { id: "boards", name: "Boards", icon: KanbanSquare, desc: "Project boards", color: "blue" },
  { id: "crm", name: "CRM", icon: Contact, desc: "Customer relations", color: "emerald" },
  { id: "workspace", name: "Workspace", icon: Briefcase, desc: "Your workspace", color: "indigo" },
  { id: "visit", name: "Visit & Leads", icon: MapPin, desc: "Discovery & leads", color: "rose" },
  { id: "meets", name: "Meets", icon: Video, desc: "Video meetings", color: "purple" },
  { id: "purchases", name: "Purchases", icon: ShoppingCart, desc: "Procurement", color: "orange" },
  { id: "files", name: "Files", icon: FolderOpen, desc: "Document storage", color: "teal" },
  { id: "network", name: "Network", icon: Globe, desc: "Connections", color: "sky" },
  { id: "hiring", name: "Hiring", icon: UserPlus, desc: "Recruitment", color: "fuchsia" },
];

const colorMap: Record<string, string> = {
  cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  blue: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  indigo: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
  rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  purple: "border-purple-400/30 bg-purple-400/10 text-purple-300",
  orange: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  teal: "border-teal-400/30 bg-teal-400/10 text-teal-300",
  sky: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  fuchsia: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300",
};

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
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const filtered = apps.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase()));
  const activeApp = apps.find(a => a.id === selected);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => { setOpen(v => !v); setSelected(null); }}
        aria-label={variant === "icon" ? "Applications" : "ESuite"}
        title={variant === "icon" ? "Applications" : "ESuite"}
        className={cn(
          "inline-flex items-center justify-center transition-all",
          variant === "icon" ? "h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" : "h-9 gap-1.5 rounded-full border px-3 text-xs font-bold uppercase tracking-wider",
          variant === "pill" && (open ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "border-amber-400/60 bg-amber-50/50 text-amber-700 hover:border-amber-500 hover:bg-amber-50 dark:bg-amber-500/5 dark:text-amber-400 dark:hover:bg-amber-500/10")
        )}
      >
        {variant === "icon" ? <LayoutGrid className="h-4 w-4" /> : (
          <>
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ESuite</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>

      {open && (
        <div ref={panelRef} className="fixed inset-0 z-[60] flex h-screen w-screen flex-col overflow-hidden" style={{ background: "radial-gradient(ellipse 120% 80% at 50% 120%, #1e293b 0%, #0f172a 35%, #020617 70%), #020617", animation: "fadeIn .2s ease-out" }}>
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(1.5px 1.5px at 10% 15%, #fff, transparent), radial-gradient(1px 1px at 25% 60%, #93c5fd, transparent), radial-gradient(1.5px 1.5px at 45% 25%, #fff, transparent), radial-gradient(1px 1px at 65% 80%, #c4b5fd, transparent), radial-gradient(1.5px 1.5px at 80% 35%, #fff, transparent), radial-gradient(1px 1px at 90% 70%, #67e8f9, transparent)", backgroundSize: "350px 350px" }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(56,189,248,0.18), transparent 70%)" }} />

          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/40"><Layers className="h-5 w-5" /></span>
              <div>
                <h2 className="text-base font-bold uppercase tracking-[0.18em] text-amber-400">ESuite</h2>
                <p className="text-[11px] text-white/50">Your business application suite</p>
              </div>
            </div>
            <button type="button" onClick={() => { setOpen(false); setSelected(null); }} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-thin sm:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="mb-4 relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search applications..." className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                </div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">{activeApp ? "Selected application" : "All applications"}</p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {filtered.map(app => {
                    const I = app.icon;
                    const isActive = selected === app.id;
                    return (
                      <button key={app.id} type="button" onClick={() => setSelected(isActive ? null : app.id)} className={cn("group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-200 hover:bg-white/[0.07]", isActive ? cn(colorMap[app.color], "ring-2") : "border-white/10 bg-white/[0.03]")}>
                        <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-transform group-hover:scale-105", isActive ? colorMap[app.color] : "border-white/10 bg-white/5 text-white/70")}><I className="h-5 w-5" /></span>
                        <span className={cn("text-center text-[11px] font-medium sm:text-xs", isActive ? "text-white" : "text-white/70")}>{app.name}</span>
                      </button>
                    );
                  })}
                </div>
                {activeApp && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5" style={{ animation: "fadeIn .2s ease-out" }}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl border", colorMap[activeApp.color])}><activeApp.icon className="h-6 w-6" /></span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{activeApp.name}</h3>
                          <p className="text-sm text-white/60">{activeApp.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"><LogOut className="h-3.5 w-3.5" />Exit App</button>
                        <button type="button" onClick={() => { setOpen(false); setSelected(null); window.location.href = "/dashboard"; }} className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-400">Open<ArrowRight className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                )}
                {!activeApp && <p className="mt-6 text-center text-xs text-white/40">Select an application to view details · {apps.length} apps available</p>}
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 bg-black/30 px-5 py-3 sm:px-8">
              <p className="text-[11px] text-white/40">WEBUOS ESuite · {apps.length} apps</p>
              <a href="/dashboard" onClick={() => { setOpen(false); setSelected(null); }} className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300">Open Dashboard<ArrowRight className="h-3 w-3" /></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
