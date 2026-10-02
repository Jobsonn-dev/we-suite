import Link from "next/link";
import {
  Wrench, MapPin, Globe, Clock, ArrowRight, Bookmark, Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { SearchResult } from "@/lib/search/server";

interface Props {
  result: SearchResult;
}

export function ServiceResultCard({ result }: Props) {
  return (
    <Card className="group relative gap-0 overflow-hidden p-0 transition-all hover:border-purple-500/40 hover:shadow-soft-lg dark:hover:border-purple-500/40">
      <div className="h-1 w-full bg-purple-500/70" aria-hidden />

      <div className="grid gap-4 p-4 sm:grid-cols-[auto,1fr] sm:p-5">
        <Link
          href={result.company_slug ? `/business/${result.company_slug}` : "#"}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20 transition-colors hover:bg-purple-500/20"
          aria-label={`View ${result.name} service details`}
        >
          <Wrench className="h-7 w-7 text-purple-600 dark:text-purple-400" />
        </Link>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href={result.company_slug ? `/business/${result.company_slug}` : "#"}
                className="block"
              >
                <h3 className="text-base font-semibold leading-tight text-foreground hover:text-purple-600 dark:hover:text-purple-400 sm:text-lg">
                  {result.name}
                </h3>
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <Badge className="gap-1 border-transparent bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <Wrench className="h-3 w-3" /> Service
                </Badge>
                {result.category && (
                  <span className="inline-flex items-center gap-1">
                    <span className="font-medium text-foreground/70">Category:</span> {result.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {result.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
          )}

          {/* Spec grid */}
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {result.coverage && (
              <div className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-foreground/70">Coverage:</span>
                <span className="font-medium text-foreground">{result.coverage}</span>
              </div>
            )}
            {result.pricing_model && (
              <div className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-foreground/70">Pricing:</span>
                <span className="font-medium text-foreground">{result.pricing_model}</span>
              </div>
            )}
            {result.availability && (
              <div className="inline-flex items-center gap-1.5">
                <span className="font-medium text-foreground/70">Availability:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{result.availability}</span>
              </div>
            )}
            {result.location && (
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground/70">Location:</span> {result.location}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button asChild size="sm" className="gap-1 bg-purple-500 text-white hover:bg-purple-600">
              <Link href={result.company_slug ? `/business/${result.company_slug}#contact` : "#"}>
                Contact Provider <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link href={result.company_slug ? `/business/${result.company_slug}` : "#"}>
                <Phone className="h-3.5 w-3.5" /> View Provider
              </Link>
            </Button>
            <Button type="button" size="sm" variant="ghost" className="gap-1" aria-label="Save service">
              <Bookmark className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
