"use client";

import { Sparkles, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InterpretedQuery, SearchResult } from "@/lib/search/server";

interface Props {
  query: string;
  interpreted: InterpretedQuery;
  results: SearchResult[];
}

function buildSummary(query: string, interpreted: InterpretedQuery, results: SearchResult[]): string {
  const parts: string[] = [];
  const place = interpreted.city ?? interpreted.state ?? interpreted.country;

  if (place) {
    parts.push(`${place} hosts a robust ecosystem of businesses`);
  } else {
    parts.push("We found a range of relevant matches");
  }

  if (interpreted.industry) {
    parts.push(`in the ${interpreted.industry} sector`);
  }

  if (interpreted.business_type) {
    parts.push(`— including ${interpreted.business_type.toLowerCase()}s`);
  }

  if (interpreted.keywords.length > 0) {
    parts.push(`working across ${interpreted.keywords.slice(0, 3).join(", ")}`);
  }

  let sentence = parts.join(" ").replace(/^([a-z])/, (_, c) => c.toUpperCase()) + ".";
  if (results.length > 0) {
    const companies = results.filter((r) => r.type === "company").slice(0, 3).map((r) => r.name);
    if (companies.length > 0) {
      sentence += ` Below are the most relevant matches from the WEBUOS business index, including ${companies.join(", ")}${results.length > 3 ? " and more" : ""}.`;
    } else {
      sentence += ` Below are the most relevant matches from the WEBUOS business index.`;
    }
  }
  return sentence;
}

export function AiAnswerPanel({ query, interpreted, results }: Props) {
  if (interpreted.intent !== "Business Discovery") return null;
  if (results.length < 3) return null;

  const summary = buildSummary(query, interpreted, results);

  return (
    <Card className="gap-0 overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 p-0">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-blue-500/30">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">AI Overview</h2>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              AI-generated
            </span>
            {interpreted.city && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {interpreted.city}
              </span>
            )}
            {interpreted.industry && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {interpreted.industry}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
          <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            <span>AI-generated summary — verify with company profiles for accuracy.</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
