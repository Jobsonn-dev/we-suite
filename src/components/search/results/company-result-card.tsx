import Link from "next/link";
import {
  Building2, MapPin, BadgeCheck, Star, Package, Wrench,
  ArrowRight, Bookmark, Share2, Phone, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchResult } from "@/lib/search/server";

interface Props {
  result: SearchResult;
  query?: string;
}

// Highlight search query in text
function highlight(text: string, query?: string) {
  if (!query || !query.trim()) return text;
  const tokens = query.trim().split(/\s+/).filter((t) => t.length > 1);
  if (tokens.length === 0) return text;
  const regex = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-cyan-500/20 text-cyan-300 rounded px-0.5">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function CompanyResultCard({ result, query }: Props) {
  const verified = !!result.verified;
  const initials = result.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#131826] p-4 transition-all duration-300 hover:border-cyan-500/20 hover:bg-[#161c2e] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] sm:p-5">
      {/* Accent top border (thin, appears on hover) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex gap-4">
        {/* Logo / Avatar */}
        <Link
          href={`/business/${result.slug}`}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-lg font-bold text-cyan-400 ring-1 ring-cyan-500/20 transition-all group-hover:scale-105 group-hover:ring-cyan-500/40"
          aria-label={`Open ${result.name} company profile`}
        >
          {initials || <Building2 className="h-6 w-6" />}
        </Link>

        <div className="min-w-0 flex-1 space-y-2">
          {/* Header */}
          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link href={`/business/${result.slug}`} className="block">
                <h3 className="text-base font-semibold leading-tight text-white transition-colors hover:text-cyan-400 sm:text-lg">
                  {highlight(result.name, query)}
                </h3>
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                {result.business_type && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 font-medium text-slate-400">
                    <Building2 className="h-3 w-3" />
                    {result.business_type}
                  </span>
                )}
                {verified && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-400">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
                {result.claimed && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-1.5 py-0.5 font-medium text-blue-400">
                    Claimed
                  </span>
                )}
              </div>
            </div>

            {result.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-slate-300" title={`${result.rating} (${result.review_count ?? 0} reviews)`}>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{result.rating.toFixed(1)}</span>
                <span className="text-slate-500">({result.review_count ?? 0})</span>
              </div>
            )}
          </div>

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {result.industry && (
              <span className="inline-flex items-center gap-1">
                <span className="font-medium text-slate-400">Industry:</span> {result.industry}
              </span>
            )}
            {result.category && (
              <span className="inline-flex items-center gap-1">
                <span className="font-medium text-slate-400">Category:</span> {result.category}
              </span>
            )}
            {result.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {result.location}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
            {highlight(result.description ?? "", query)}
          </p>

          {/* Counts */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {typeof result.product_count === "number" && result.product_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                <span className="font-medium text-slate-400">{result.product_count}</span> products
              </span>
            )}
            {typeof result.service_count === "number" && result.service_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5" />
                <span className="font-medium text-slate-400">{result.service_count}</span> services
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
            <Link
              href={`/business/${result.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              View Company <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/business/${result.slug}#contact`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-white/20 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" /> Contact
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
              aria-label="Save company"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
              aria-label="Share company"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyAccent({ accent }: { accent?: string }) {
  return <span className={cn("text-xs font-semibold", accent ?? "text-cyan-400")}>COMPANY</span>;
}
