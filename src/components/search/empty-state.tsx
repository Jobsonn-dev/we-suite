"use client";

import Link from "next/link";
import { SearchX, RotateCcw, Lightbulb } from "lucide-react";

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

function maybeSuggest(query: string): string | null {
  const q = query.trim();
  if (!q) return null;
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
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-white/10 bg-[#131826] p-8 text-center sm:p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
        <SearchX className="h-8 w-8 text-slate-500" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          No businesses found for &ldquo;{query}&rdquo;
        </h2>
        <p className="max-w-md text-sm text-slate-400">
          Try a broader search, remove some filters, or explore popular categories below.
        </p>
      </div>

      {suggestion && (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm text-slate-300">
          Did you mean:{" "}
          <Link
            href={`/search?q=${encodeURIComponent(suggestion)}`}
            className="font-semibold text-cyan-400 underline-offset-4 hover:underline"
          >
            {suggestion}
          </Link>
          ?
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
        </button>
      </div>

      {relatedSearches.length > 0 && (
        <div className="w-full space-y-2 border-t border-white/10 pt-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Related searches</p>
          <div className="flex flex-wrap gap-2">
            {relatedSearches.map((r) => (
              <Link
                key={r}
                href={`/search?q=${encodeURIComponent(r)}`}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 transition-all hover:border-cyan-400/30 hover:text-cyan-400"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="w-full space-y-2 border-t border-white/10 pt-6 text-left">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Lightbulb className="h-3 w-3" /> Popular categories
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 transition-all hover:border-cyan-400/30 hover:text-cyan-400"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
