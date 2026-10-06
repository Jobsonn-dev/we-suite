"use client";

import { useState } from "react";
import { Database, HardDrive, FileText, Image, FolderArchive, Sparkles, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function StorageQuotaScreen() {
  const [cleaning, setCleaning] = useState(false);

  const categories = [
    {
      label: "Product Catalogs & 3D Specs",
      size: "3.2 GB",
      pct: 43,
      color: "bg-cyan-500",
      textColor: "text-cyan-400",
      icon: FolderArchive,
    },
    {
      label: "High-Resolution Images & Media",
      size: "2.1 GB",
      pct: 28,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      icon: Image,
    },
    {
      label: "Legal Compliance & Licenses",
      size: "1.8 GB",
      pct: 24,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      icon: FileText,
    },
    {
      label: "Inquiry Attachments & History",
      size: "0.3 GB",
      pct: 5,
      color: "bg-purple-500",
      textColor: "text-purple-400",
      icon: Database,
    },
  ];

  const handleCleanStorage = () => {
    setCleaning(true);
    setTimeout(() => {
      setCleaning(false);
      toast.success("Storage optimizer cleaned 420 MB of temporary thumbnail caches!");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Account Storage & Quotas</h2>
        <p className="mt-1 text-sm text-slate-400">
          Monitor your WEBUOS cloud storage usage for product catalogs, high-res spec sheets, compliance PDFs, and buyer media.
        </p>
      </div>

      {/* Storage Meter Card */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 shadow-md">
              <HardDrive className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Cloud Usage</p>
              <h3 className="text-2xl font-extrabold text-white">7.4 GB <span className="text-sm font-normal text-slate-400">of 15.0 GB used (49%)</span></h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCleanStorage}
            disabled={cleaning}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            {cleaning ? "Optimizing..." : "Clean Temporary Caches"}
          </button>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-800 p-0.5">
            <div style={{ width: "21%" }} className="h-full rounded-l-full bg-cyan-500" title="Catalogs: 3.2 GB" />
            <div style={{ width: "14%" }} className="h-full bg-blue-500" title="Media: 2.1 GB" />
            <div style={{ width: "12%" }} className="h-full bg-emerald-500" title="Compliance: 1.8 GB" />
            <div style={{ width: "2%" }} className="h-full rounded-r-full bg-purple-500" title="Inquiries: 0.3 GB" />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>0 GB</span>
            <span className="text-slate-300">7.6 GB Available</span>
            <span>15 GB Total</span>
          </div>
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.label}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3.5">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${cat.textColor}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">{cat.label}</p>
                  <p className="text-[11px] text-slate-400">{cat.size} ({cat.pct}% of used storage)</p>
                </div>
              </div>
              <div className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
            </div>
          );
        })}
      </section>

      {/* Upgrade Storage Card */}
      <section className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" /> High-Capacity Enterprise Cloud
            </span>
            <h3 className="text-lg font-bold text-white">Need unlimited 3D CAD & video asset hosting?</h3>
            <p className="text-xs text-slate-300">
              Upgrade to the WEBUOS Enterprise Storage Pack for 100 GB dedicated high-speed global CDN bandwidth.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Storage expansion request submitted to account manager.")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Expand to 100 GB <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
