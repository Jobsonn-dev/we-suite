"use client";

import Link from "next/link";
import { Layers, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// ESuite Button + Apps Button — clean, modern, professional
//
// ESuite: minimal text + icon, subtle hover, no heavy border
// Apps: clean Lucide icon (LayoutGrid) with subtle hover
// ============================================================

export function ESuiteButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  if (variant === "icon") {
    // Apps icon — clean, modern Lucide icon linking to /apps
    return (
      <Link
        href="/apps"
        aria-label="WEBUOS Apps"
        title="All Apps"
        className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
      >
        <LayoutGrid className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
        {/* Subtle dot indicator for "new" feel */}
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    );
  }

  // ESuite — clean, professional, minimal
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
