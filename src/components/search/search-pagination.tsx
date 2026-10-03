"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function SearchPagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Search results pagination" className="flex items-center justify-center gap-1 py-6">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-slate-300"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-slate-500"
            aria-hidden
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Go to page ${p}`}
            aria-current={page === p ? "page" : undefined}
            className={cn(
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-all",
              page === p
                ? "bg-cyan-500 text-cyan-950 shadow-lg shadow-cyan-500/20"
                : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-slate-300"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
