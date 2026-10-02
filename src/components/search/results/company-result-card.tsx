import Link from "next/link";
import {
  Building2, MapPin, BadgeCheck, Star, Package, Wrench,
  ArrowRight, Bookmark, Share2, Phone, Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { accentText } from "@/lib/colors";
import { SearchResult } from "@/lib/search/server";

interface Props {
  result: SearchResult;
  accent?: string;
}

export function CompanyResultCard({ result }: Props) {
  const verified = !!result.verified;
  const initials = result.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Card className="group relative gap-0 overflow-hidden p-0 transition-all hover:border-blue-500/40 hover:shadow-soft-lg dark:hover:border-blue-500/40">
      {/* Accent top border */}
      <div className="h-1 w-full bg-blue-500/70" aria-hidden />

      <div className="grid gap-4 p-4 sm:grid-cols-[auto,1fr] sm:p-5">
        {/* Logo / Avatar */}
        <Link
          href={`/business/${result.slug}`}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl font-bold text-blue-600 ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
          aria-label={`Open ${result.name} company profile`}
        >
          {initials || <Building2 className="h-7 w-7" />}
        </Link>

        <div className="min-w-0 space-y-2">
          {/* Header */}
          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link href={`/business/${result.slug}`} className="block">
                <h3 className="text-base font-semibold leading-tight text-foreground hover:text-blue-600 dark:hover:text-blue-400 sm:text-lg">
                  {result.name}
                </h3>
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {result.business_type && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-medium">
                    <Building2 className="h-3 w-3" />
                    {result.business_type}
                  </span>
                )}
                {verified && (
                  <Badge className="gap-1 border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-3 w-3" /> Verified Business
                  </Badge>
                )}
                {result.claimed && (
                  <span className="inline-flex items-center rounded-md bg-blue-500/10 px-1.5 py-0.5 font-medium text-blue-600 dark:text-blue-400">
                    Claimed
                  </span>
                )}
              </div>
            </div>

            {result.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-foreground" title={`${result.rating} (${result.review_count ?? 0} reviews)`}>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{result.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({result.review_count ?? 0})</span>
              </div>
            )}
          </div>

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {result.industry && (
              <span className="inline-flex items-center gap-1">
                <span className="font-medium text-foreground/70">Industry:</span> {result.industry}
              </span>
            )}
            {result.category && (
              <span className="inline-flex items-center gap-1">
                <span className="font-medium text-foreground/70">Category:</span> {result.category}
              </span>
            )}
            {result.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {result.location}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {result.description}
          </p>

          {/* Counts */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {typeof result.product_count === "number" && result.product_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground/80">{result.product_count}</span> products
              </span>
            )}
            {typeof result.service_count === "number" && result.service_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground/80">{result.service_count}</span> services
              </span>
            )}
            {result.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <span className="truncate max-w-[160px]">{result.website.replace(/^https?:\/\//, "")}</span>
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button asChild size="sm" className="gap-1">
              <Link href={`/business/${result.slug}`}>
                View Company <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link href={`/business/${result.slug}#contact`}>
                <Phone className="h-3.5 w-3.5" /> Contact
              </Link>
            </Button>
            <Button type="button" size="sm" variant="ghost" className="gap-1" aria-label="Save company">
              <Bookmark className="h-3.5 w-3.5" /> Save
            </Button>
            <Button type="button" size="sm" variant="ghost" className="gap-1" aria-label="Share company">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function CompanyAccent({ accent }: { accent?: string }) {
  return <span className={cn("text-xs font-semibold", accentText(accent ?? "blue"))}>COMPANY</span>;
}
