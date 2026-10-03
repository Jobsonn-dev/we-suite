import Link from "next/link";
import {
  Factory, Building2, Package, Wrench, Cpu, ArrowRight, Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getEcosystem } from "@/data/taxonomy";
import { accentText } from "@/lib/colors";

import { SearchResult } from "@/lib/search/server";

interface Props {
  result: SearchResult;
}

export function IndustryResultCard({ result }: Props) {
  const eco = result.ecosystem ? getEcosystem(result.ecosystem) : undefined;
  const accent = eco?.accent ?? "blue";

  return (
    <Card className="group relative gap-0 overflow-hidden p-0 transition-all hover:border-orange-500/40 hover:shadow-soft-lg dark:hover:border-orange-500/40">
      <div className="h-1 w-full bg-orange-500/70" aria-hidden />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Link
            href="/business-taxonomy"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20 transition-colors hover:bg-orange-500/20"
            aria-label={`Explore ${result.name} industry`}
          >
            <Factory className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </Link>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                <Link href="/business-taxonomy">
                  <h3 className="text-base font-semibold leading-tight text-foreground hover:text-orange-600 dark:hover:text-orange-400 sm:text-lg">
                    {result.name}
                  </h3>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge className="gap-1 border-transparent bg-orange-500/15 text-orange-600 dark:text-orange-400">
                    <Layers className="h-3 w-3" /> Industry
                  </Badge>
                  {eco && (
                    <span className={accentText(accent)}>{eco.shortName} Ecosystem</span>
                  )}
                </div>
              </div>
            </div>

            {result.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat icon={<Building2 className="h-3.5 w-3.5" />} label="Companies" value={result.company_count} />
              <Stat icon={<Package className="h-3.5 w-3.5" />} label="Products" value={result.product_count} />
              <Stat icon={<Wrench className="h-3.5 w-3.5" />} label="Services" value={result.service_count} />
              <Stat icon={<Cpu className="h-3.5 w-3.5" />} label="Technologies" value={result.company_count ? Math.floor(result.company_count / 4) : 0} />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button asChild size="sm" className="gap-1 bg-orange-500 text-white hover:bg-orange-600">
                <Link href="/business-taxonomy">
                  Explore Industry <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-1">
                <Link href={`/search?q=${encodeURIComponent(result.name)}&type=company`}>
                  View Companies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-foreground">{value ?? 0}</div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
