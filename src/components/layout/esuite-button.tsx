"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// ESuite Button — simple link to esuite.webuos.com (no dropdown)
// Apps Button — uses custom icon, links to /apps
// ============================================================

export function ESuiteButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  if (variant === "icon") {
    // Apps icon — uses the custom uploaded icon, links to /apps
    return (
      <Link
        href="/apps"
        aria-label="WEBUOS Apps"
        title="WEBUOS Apps"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-muted"
      >
        <Image
          src="/apps-icon.png"
          alt="WEBUOS Apps"
          width={24}
          height={24}
          className="h-7 w-7 rounded-lg"
          unoptimized
        />
      </Link>
    );
  }

  // ESuite pill — simple external link to esuite.webuos.com
  return (
    <a
      href="https://esuite.webuos.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ESuite"
      title="Open ESuite"
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-cyan-400/60 bg-cyan-50/50 px-3 text-xs font-bold uppercase tracking-wider text-cyan-700 transition-all hover:border-cyan-500 hover:bg-cyan-50 dark:bg-cyan-500/5 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
    >
      <span className="hidden sm:inline">ESuite</span>
    </a>
  );
}
