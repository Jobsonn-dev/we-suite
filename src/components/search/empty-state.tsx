"use client";

import Link from "next/link";
import { SearchX, RotateCcw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  query: string;
  relatedSearches?: string[];
  onReset: () => void;
}

const POPULAR_CATEGORIES = [
  { label: "AI & Machine Learning", href: "/search?q=artificial+intelligence&type=company" },
  { label: "Manufacturing", href: "/search?q=manufacturing&type=company" },
  { label: "Steel & Metals", href: "/search?q=steel&type=company" },
  { label: "Cloud Computing", href: "/search?q=cloud+computing&type=service" },
  { label: "ERP Software", href: "/search?q=erp&type=product" },
  { label: "Solar Energy", href: "/search?q=solar+energy&type=company" },
  { label: "Cybersecurity", href: "/search?q=cybersecurity&type=company" },
  { label: "Industrial Automation", href: "/search?q=industrial+automation&type=company" },
];

// Simple typo suggestion heuristic — corrects common single-word typos by suggesting plurals
function maybeSuggest(query: string): string | null {
  const q = query.trim();
  if (!q) return null;
  // If word ends in "machin", "supplier" etc., suggest plural
  const corrections: [RegExp, string][] = [
    [/machin\b/i, "machine"],
    [/supplier\b/i, "suppliers"],
    [/company\b/i, "companies"],
    [/manufatur/i, "manufactur"],
  ];
  for (const [re, rep] of corrections) {
    if (re.test(q) && !q.toLowerCase().includes(rep.toLowerCase())) {
      return q.replace(re, rep);
    }
  }
  return null;
}

export function EmptyState({ query, relatedSearches = [], onReset }: Props) {
  const suggestion = maybeSuggest(query);

  return (
    <Card className="flex flex-col items-center justify-center gap-6 border-dashed bg-muted/20 p-8 text-center sm:p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          No businesses found for &ldquo;{query}&rdquo;
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Try a broader search, remove some filters, or explore popular categories below.
        </p>
      </div>

      {suggestion && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-sm">
          Did you mean:{" "}
          <Link
            href={`/search?q=${encodeURIComponent(suggestion)}`}
            className="font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
          >
            {suggestion}
          </Link>
          ?
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={onReset} variant="outline" className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
        </Button>
      </div>

      {relatedSearches.length > 0 && (
        <div className="w-full space-y-2 border-t border-border pt-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Related searches</p>
          <div className="flex flex-wrap gap-2">
            {relatedSearches.map((r) => (
              <Link
                key={r}
                href={`/search?q=${encodeURIComponent(r)}`}
                className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="w-full space-y-2 border-t border-border pt-6 text-left">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Lightbulb className="h-3 w-3" /> Popular categories
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
