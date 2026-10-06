"use client";

import { useState } from "react";
import { ShieldCheck, Download, Trash2, Eye, Database, Lock, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

export function PrivacyScreen() {
  const [searchIndexable, setSearchIndexable] = useState(true);
  const [aiAgentsIndexable, setAiAgentsIndexable] = useState(true);
  const [showDirectContact, setShowDirectContact] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Account data archive compiled! Download starting...");
    }, 1200);
  };

  const handleDeleteRequest = () => {
    toast.error("Account deletion request logged. Security verification email sent.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Data & Privacy Governance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Control how your company data is shared across WEBUOS discovery indexes, AI matching engines, and external marketplaces.
        </p>
      </div>

      {/* Discovery & Indexing Preferences */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Marketplace & Search Indexing</h3>
        <p className="text-xs text-slate-400">Configure your visibility on WEBUOS and external partner search engines.</p>

        <div className="mt-6 space-y-4">
          {[
            {
              title: "Index Company in WEBUOS Global Search",
              desc: "Allow verified enterprise buyers to discover your products and services via keyword & filter search",
              state: searchIndexable,
              setState: setSearchIndexable,
            },
            {
              title: "Allow AI Agents & Procurement Bots to Match RFQs",
              desc: "Enable WEBUOS AI procurement agents to automatically suggest your company for matching industrial purchase orders",
              state: aiAgentsIndexable,
              setState: setAiAgentsIndexable,
            },
            {
              title: "Display Direct Executive Contact Info",
              desc: "Show phone number and email to verified buyers on your profile page",
              state: showDirectContact,
              setState: setShowDirectContact,
            },
            {
              title: "Anonymous Market Analytics & Benchmarking",
              desc: "Contribute aggregated sector trend data to receive industry pricing benchmarks",
              state: analyticsConsent,
              setState: setAnalyticsConsent,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 p-4 transition-all hover:border-white/10"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  item.setState(!item.state);
                  toast.success("Privacy preference updated.");
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  item.state ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.state ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Data Export Center */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Export Your Account Data</h3>
              <p className="text-xs text-slate-400">
                Download a complete portable archive (JSON + CSV) of your catalog, products, RFQs, invoices, and analytics history.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/15 disabled:opacity-50"
          >
            {isExporting ? "Generating ZIP..." : "Download Full Archive"}
            <Download className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Danger Zone: Account Deletion */}
      <section className="rounded-3xl border border-rose-500/30 bg-rose-500/[0.04] p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-rose-400">Delete Account & Purge Data</h3>
            <p className="mt-1 text-xs text-slate-400">
              Permanently remove your business profile, product listings, verification badges, and buyer inquiry logs from WEBUOS. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDeleteRequest}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20"
            >
              <Trash2 className="h-4 w-4" /> Request Account Deletion
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
