"use client";

import Link from "next/link";
import {
  Building2,
  Package,
  Wrench,
  BarChart3,
  Cpu,
  MapPin,
  ArrowRight,
  BadgeCheck,
  Star,
  Phone,
  Globe,
  Network,
  TrendingUp,
  Sparkles,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DiscoveryData, SearchResult } from "@/lib/search-utils";

interface Props {
  discovery: DiscoveryData;
  query: string;
}

// Map a string icon name to a Lucide icon component.
const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Package,
  Wrench,
  BarChart3,
  Cpu,
  MapPin,
  Network,
  TrendingUp,
  Sparkles,
  Compass,
};

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? ArrowRight;
}

// Build a /search URL from an "explore_more" entry whose `query` field looks
// like "<search-term> type=company" (a small pseudo-format from the backend).
function buildExploreMoreUrl(item: { label: string; query: string; icon: string }): string {
  const raw = item.query ?? "";
  const typeMatch = raw.match(/\s+type=([a-z]+)/i);
  const q = raw.replace(/\s+type=[a-z]+/i, "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (typeMatch) params.set("type", typeMatch[1].toLowerCase());
  const str = params.toString();
  return str ? `/search?${str}` : "/search";
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-cyan-400/60" />
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/60">
        {children}
      </h3>
    </div>
  );
}

function SectionDivider() {
  return <div className="my-4 h-px w-full bg-white/5" />;
}

// ---------------------------------------------------------------------------
// Knowledge Panel (only shown when knowledge_panel exists)
// ---------------------------------------------------------------------------
function KnowledgePanel({ result }: { result: Extract<SearchResult, { type: "company" }> }) {
  const initials = initialsOf(result.name);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#131826] to-[#0f1422] p-4 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      {/* Subtle glow accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-base font-bold text-cyan-300 ring-1 ring-cyan-500/30">
            {initials || <Building2 className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-base font-semibold text-white">
                {result.name}
              </h2>
              {result.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-400" />
              )}
            </div>
            {result.business_type && (
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-cyan-400/70">
                {result.business_type}
              </p>
            )}
          </div>
        </div>

        {/* Rating row */}
        {result.rating > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white">{result.rating.toFixed(1)}</span>
            <span className="text-slate-500">
              ({result.review_count.toLocaleString()} reviews)
            </span>
          </div>
        )}

        {/* Meta rows */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-400">
          {result.industry && (
            <div className="flex items-center gap-1.5">
              <Network className="h-3 w-3 shrink-0 text-slate-500" />
              <span className="text-slate-500">Industry:</span>
              <span className="font-medium text-slate-300">{result.industry}</span>
            </div>
          )}
          {result.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
              <span className="font-medium text-slate-300">{result.location}</span>
            </div>
          )}
          {result.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 shrink-0 text-slate-500" />
              <a
                href={result.website}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium text-cyan-400/90 transition-colors hover:text-cyan-300"
              >
                {result.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {/* CTA row */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/business/${result.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/25 hover:text-cyan-200"
          >
            View Company <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/business/${result.slug}#contact`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white"
          >
            <Phone className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact business row (used for related/similar/nearby lists)
// ---------------------------------------------------------------------------
function BusinessRow({
  result,
  variant = "default",
}: {
  result: Extract<SearchResult, { type: "company" }>;
  variant?: "default" | "nearby";
}) {
  const initials = initialsOf(result.name);
  const place = result.city || result.country || result.location;

  return (
    <Link
      href={`/business/${result.slug}`}
      className="group flex items-center gap-2.5 rounded-lg p-2 transition-all hover:bg-white/5"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-[11px] font-bold text-cyan-300 ring-1 ring-white/5">
        {initials || <Building2 className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="truncate text-xs font-medium text-slate-200 transition-colors group-hover:text-cyan-300">
            {result.name}
          </p>
          {result.verified && (
            <BadgeCheck className="h-3 w-3 shrink-0 text-cyan-400/80" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          {variant === "nearby" && place ? (
            <>
              <MapPin className="h-2.5 w-2.5 text-cyan-400/60" />
              <span className="font-medium text-cyan-400/80">{place}</span>
              {result.business_type && (
                <span className="truncate text-slate-600">· {result.business_type}</span>
              )}
            </>
          ) : (
            <>
              {result.business_type && (
                <span className="truncate">{result.business_type}</span>
              )}
              {place && (
                <>
                  {result.business_type && <span className="text-slate-700">·</span>}
                  <span className="truncate">{place}</span>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <ArrowRight className="h-3 w-3 shrink-0 text-slate-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-cyan-400 group-hover:opacity-100" />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------
export function DiscoveryPanel({ discovery, query }: Props) {
  const {
    knowledge_panel,
    related_companies,
    similar_businesses,
    nearby_businesses,
    trending_searches,
    related_industries,
    explore_more,
  } = discovery;

  const knowledgeCompany =
    knowledge_panel && knowledge_panel.type === "company" ? knowledge_panel : null;

  const related = related_companies
    .filter((r): r is Extract<SearchResult, { type: "company" }> => r.type === "company")
    .slice(0, 5);
  const similar = similar_businesses
    .filter((r): r is Extract<SearchResult, { type: "company" }> => r.type === "company")
    .slice(0, 5);
  const nearby = nearby_businesses
    .filter((r): r is Extract<SearchResult, { type: "company" }> => r.type === "company")
    .slice(0, 5);

  const hasContent =
    knowledgeCompany ||
    related.length > 0 ||
    similar.length > 0 ||
    nearby.length > 0 ||
    trending_searches.length > 0 ||
    related_industries.length > 0 ||
    explore_more.length > 0;

  if (!hasContent) return null;

  // Stagger animation delay counter
  let stagger = 0;
  const nextDelay = () => `${(stagger++ * 60).toFixed(0)}ms`;

  return (
    <div className="space-y-0">
      {/* Knowledge panel — top of the discovery panel */}
      {knowledgeCompany && (
        <div style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}>
          <KnowledgePanel result={knowledgeCompany} />
        </div>
      )}

      {/* Related companies */}
      {related.length > 0 && (
        <section
          className={cn(knowledgeCompany && "pt-4")}
          style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}
        >
          {knowledgeCompany && <SectionDivider />}
          <SectionHeader icon={Network}>Related Companies</SectionHeader>
          <div className="space-y-0.5">
            {related.map((r) => (
              <BusinessRow key={`related-${r.id}`} result={r} />
            ))}
          </div>
        </section>
      )}

      {/* Similar businesses */}
      {similar.length > 0 && (
        <section style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}>
          <SectionDivider />
          <SectionHeader icon={Building2}>Similar Businesses</SectionHeader>
          <div className="space-y-0.5">
            {similar.map((r) => (
              <BusinessRow key={`similar-${r.id}`} result={r} />
            ))}
          </div>
        </section>
      )}

      {/* Nearby businesses */}
      {nearby.length > 0 && (
        <section style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}>
          <SectionDivider />
          <SectionHeader icon={MapPin}>Nearby Businesses</SectionHeader>
          <div className="space-y-0.5">
            {nearby.map((r) => (
              <BusinessRow key={`nearby-${r.id}`} result={r} variant="nearby" />
            ))}
          </div>
        </section>
      )}

      {/* Trending searches */}
      {trending_searches.length > 0 && (
        <section style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}>
          <SectionDivider />
          <SectionHeader icon={TrendingUp}>Trending Searches</SectionHeader>
          <div className="flex flex-wrap gap-1.5">
            {trending_searches.map((s) => (
              <Link
                key={`trending-${s}`}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-all hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <TrendingUp className="h-2.5 w-2.5 text-cyan-400/60" />
                {s}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related industries */}
      {related_industries.length > 0 && (
        <section style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}>
          <SectionDivider />
          <SectionHeader icon={BarChart3}>Related Industries</SectionHeader>
          <div className="flex flex-wrap gap-1.5">
            {related_industries.map((ind) => (
              <Link
                key={`ind-${ind.name}`}
                href={`/search?q=${encodeURIComponent(ind.name)}&type=industry`}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-all hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                {ind.name}
                <span className="rounded-full bg-white/10 px-1.5 text-[9px] font-semibold text-slate-400">
                  {ind.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Explore more */}
      {explore_more.length > 0 && (
        <section style={{ animation: `discoveryFadeIn .45s ease-out ${nextDelay()} both` }}>
          <SectionDivider />
          <SectionHeader icon={Compass}>Explore More</SectionHeader>
          <div className="grid grid-cols-2 gap-1.5">
            {explore_more.map((item) => {
              const Icon = getIcon(item.icon);
              const href = buildExploreMoreUrl(item);
              return (
                <Link
                  key={`explore-${item.label}`}
                  href={href}
                  className="group flex items-center gap-2 rounded-lg border border-white/5 bg-[#131826] p-2.5 transition-all hover:border-cyan-400/30 hover:bg-[#161c2e]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-[11px] font-medium text-slate-300 transition-colors group-hover:text-cyan-300">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          {query && (
            <p className="mt-2 px-1 text-[10px] text-slate-600">
              Filtered for &ldquo;<span className="text-slate-400">{query}</span>&rdquo;
            </p>
          )}
        </section>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes discoveryFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
