"use client";

import { Sparkles, Info } from "lucide-react";
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
    <div className="mb-4 overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.03] via-blue-500/[0.02] to-purple-500/[0.03] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/20">
          <Sparkles className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-white">AI Overview</h2>
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-400">
              AI-generated
            </span>
            {interpreted.city && (
              <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                {interpreted.city}
              </span>
            )}
            {interpreted.industry && (
              <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                {interpreted.industry}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
          <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            <span>AI-generated summary — verify with company profiles for accuracy.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
