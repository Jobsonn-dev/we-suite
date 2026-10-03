import Link from "next/link";
import { Cpu, Layers, ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { SearchResult } from "@/lib/search/server";

interface Props {
  query?: string;
  result: SearchResult;
}

export function TechnologyResultCard({ result, query }: Props) {
  // Providers & use cases can be either a comma-separated string (from our own
  // runSearch) OR an array (from the /api/search endpoint). Normalize to array.
  const providers = Array.isArray(result.providers)
    ? result.providers
    : (typeof result.providers === "string"
      ? result.providers.split(",").map((s) => s.trim()).filter(Boolean)
      : []);
  const useCases = Array.isArray(result.use_cases)
    ? result.use_cases
    : (typeof result.use_cases === "string"
      ? result.use_cases.split(",").map((s) => s.trim()).filter(Boolean)
      : []);

  return (
    <Card className="group relative gap-0 overflow-hidden p-0 transition-all hover:border-cyan-500/40 hover:shadow-soft-lg dark:hover:border-cyan-500/40">
      <div className="h-1 w-full bg-cyan-500/70" aria-hidden />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Link
            href={`/search?q=${encodeURIComponent(result.name)}&type=company`}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20 transition-colors hover:bg-cyan-500/20"
            aria-label={`Explore ${result.name} technology`}
          >
            <Cpu className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          </Link>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=company`}>
                  <h3 className="text-base font-semibold leading-tight text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 sm:text-lg">
                    {result.name}
                  </h3>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge className="gap-1 border-transparent bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                    <Cpu className="h-3 w-3" /> Technology
                  </Badge>
                  {result.tech_type && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-medium">
                      <Layers className="h-3 w-3" /> {result.tech_type}
                    </span>
                  )}
                  {(result as { type_field?: string }).type_field && !result.tech_type && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-medium">
                      <Layers className="h-3 w-3" /> {(result as { type_field?: string }).type_field}
                    </span>
                  )}
                </div>
              </div>
              {typeof result.company_count === "number" && result.company_count > 0 && (
                <div className="flex items-center gap-1 text-xs font-medium" title="Providers in index">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{result.company_count}</span>
                  <span className="text-muted-foreground">providers</span>
                </div>
              )}
            </div>

            {result.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
            )}

            {providers.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Providers</div>
                <div className="flex flex-wrap gap-1.5">
                  {providers.slice(0, 5).map((p) => (
                    <span key={p} className="inline-flex items-center rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                      {p}
                    </span>
                  ))}
                  {providers.length > 5 && (
                    <span className="inline-flex items-center text-xs text-muted-foreground">
                      +{providers.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {useCases.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Use Cases</div>
                <div className="flex flex-wrap gap-1.5">
                  {useCases.slice(0, 4).map((u) => (
                    <span key={u} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-foreground/70">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button asChild size="sm" className="gap-1 bg-cyan-500 text-white hover:bg-cyan-600">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=company`}>
                  Explore Technology <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-1">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=product`}>
                  Related Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
