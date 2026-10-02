"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function SearchPagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  // Build a compact list of page numbers with ellipses
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
    <nav aria-label="Search results pagination" className="flex items-center justify-center gap-1 py-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
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
              "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
              page === p
                ? "border border-primary bg-primary text-primary-foreground shadow-soft"
                : "border border-transparent text-foreground hover:bg-muted"
            )}
          >
            {p}
          </button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
