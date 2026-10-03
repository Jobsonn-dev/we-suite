import Link from "next/link";
import { MapPin, Building2, ArrowRight, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { SearchResult } from "@/lib/search/server";

interface Props {
  query?: string;
  result: SearchResult;
}

export function LocationResultCard({ result, query }: Props) {
  return (
    <Card className="group relative gap-0 overflow-hidden p-0 transition-all hover:border-emerald-500/40 hover:shadow-soft-lg dark:hover:border-emerald-500/40">
      <div className="h-1 w-full bg-emerald-500/70" aria-hidden />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Link
            href={`/search?q=${encodeURIComponent(result.name)}&type=company`}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/20"
            aria-label={`Explore ${result.name} location`}
          >
            <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </Link>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=company`}>
                  <h3 className="text-base font-semibold leading-tight text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 sm:text-lg">
                    {result.name}
                  </h3>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge className="gap-1 border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Globe2 className="h-3 w-3" /> {result.location_type ?? (result as { type_field?: string }).type_field ?? "Location"}
                  </Badge>
                  {result.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {result.city}{result.country ? `, ${result.country}` : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {result.description && (
              <p className="text-sm text-muted-foreground">{result.description}</p>
            )}

            {typeof result.business_count === "number" && result.business_count > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm">
                  <span className="font-semibold text-foreground">{result.business_count}</span>{" "}
                  <span className="text-muted-foreground">registered businesses</span>
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button asChild size="sm" className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=company`}>
                  Explore Location <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-1">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=product`}>
                  Local Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
