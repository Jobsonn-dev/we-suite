"use client";

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Monitor, Check, ChevronDown } from "lucide-react";
import { useTheme, type Theme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

const options: { mode: Theme; label: string; desc: string; icon: typeof Sun; swatch: string; color: string }[] = [
  { mode: "light", label: "Light", desc: "Bright white", icon: Sun, swatch: "bg-white border-amber-300", color: "text-amber-500" },
  { mode: "dark", label: "Dark", desc: "Dark navy", icon: Moon, swatch: "bg-[#0f172a] border-white/20", color: "text-blue-300" },
  { mode: "system", label: "System Default", desc: "Follow OS", icon: Monitor, swatch: "bg-gradient-to-br from-white to-[#0f172a] border-border", color: "text-slate-500" },
];

export function ThemeToggle() {
  const { theme, resolved, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && btn.current && !btn.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", esc); };
  }, [open]);

  const Icon = mounted ? (resolved === "dark" ? Moon : Sun) : Sun;

  return (
    <div className="relative">
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Icon className="h-4 w-4" />
        <ChevronDown className={cn("ml-0.5 h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div ref={ref} className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-border bg-popover p-1.5 shadow-soft-lg" style={{ animation: "fadeIn .15s ease-out" }}>
          <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Appearance</p>
          {options.map(o => {
            const I = o.icon;
            const active = theme === o.mode;
            return (
              <button key={o.mode} type="button" onClick={() => { setTheme(o.mode); setOpen(false); }} className={cn("flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors", active ? "bg-primary/10" : "hover:bg-muted")}>
                <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg border", o.swatch)}>
                  <I className={cn("h-4 w-4", o.color)} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold", active ? "text-foreground" : "text-foreground/80")}>{o.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{o.desc}{o.mode === "system" && mounted && ` (${resolved})`}</p>
                </div>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
