import Link from "next/link";
import {
  Package, MapPin, Tag, Boxes, ArrowRight, Bookmark, Share2, DollarSign, Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { SearchResult } from "@/lib/search/server";

interface Props {
  query?: string;
  result: SearchResult;
}

export function ProductResultCard({ result, query }: Props) {
  return (
    <Card className="group relative gap-0 overflow-hidden p-0 transition-all hover:border-amber-500/40 hover:shadow-soft-lg dark:hover:border-amber-500/40">
      <div className="h-1 w-full bg-amber-500/70" aria-hidden />

      <div className="grid gap-4 p-4 sm:grid-cols-[88px,1fr] sm:p-5">
        {/* Thumbnail / icon placeholder */}
        <Link
          href={result.company_slug ? `/business/${result.company_slug}` : "#"}
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 transition-colors hover:bg-amber-500/20"
          aria-label={`View ${result.name} product details`}
        >
          <Package className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </Link>

        <div className="min-w-0 space-y-2">
          {/* Header */}
          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href={result.company_slug ? `/business/${result.company_slug}` : "#"}
                className="block"
              >
                <h3 className="text-base font-semibold leading-tight text-foreground hover:text-amber-600 dark:hover:text-amber-400 sm:text-lg">
                  {result.name}
                </h3>
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <Badge className="gap-1 border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Package className="h-3 w-3" /> Product
                </Badge>
                {result.brand && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-medium">
                    <Tag className="h-3 w-3" /> {result.brand}
                  </span>
                )}
                {result.category && (
                  <span className="inline-flex items-center gap-1">
                    <span className="font-medium text-foreground/70">Category:</span> {result.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {result.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
          )}

          {/* Spec / Price / Availability */}
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {result.price_range && (
              <div className="inline-flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-foreground/70">Price:</span>
                <span className="font-semibold text-foreground">{result.price_range}</span>
              </div>
            )}
            {result.availability && (
              <div className="inline-flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-foreground/70">Availability:</span>
                <span className="font-medium text-foreground">{result.availability}</span>
              </div>
            )}
            {result.location && (
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground/70">Location:</span> {result.location}
              </div>
            )}
            <div className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground/70">Listed on:</span> WEBUOS Index
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button asChild size="sm" className="gap-1 bg-amber-500 text-white hover:bg-amber-600">
              <Link href={result.company_slug ? `/business/${result.company_slug}?inquire=${result.slug}` : "#"}>
                Request Quote <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button type="button" size="sm" variant="ghost" className="gap-1" aria-label="Save product">
              <Bookmark className="h-3.5 w-3.5" /> Save
            </Button>
            <Button type="button" size="sm" variant="ghost" className="gap-1" aria-label="Share product">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
