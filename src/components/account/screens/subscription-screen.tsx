"use client";

import { useState } from "react";
import { Sparkles, Check, Download, ShieldCheck, CreditCard, ArrowRight, Zap, Building } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionScreen() {
  const invoices = [
    { id: "INV-2025-001", date: "01-Jan-2025", desc: "Annual Enterprise Verified Membership", amount: "₹49,999", status: "Paid" },
    { id: "INV-2024-089", date: "01-Jan-2024", desc: "Annual Enterprise Verified Membership", amount: "₹49,999", status: "Paid" },
    { id: "INV-2023-042", date: "15-Aug-2023", desc: "B2B Global Trade Catalog Extension", amount: "₹14,999", status: "Paid" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Membership & Subscription Plan</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your WEBUOS platform tier, vendor verification level, and view historical billing invoices.
        </p>
      </div>

      {/* Active Plan Card */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-blue-950/40 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-400">
                Active Tier
              </span>
              <span className="text-xs text-slate-400">Next renewal: Nov 15, 2026</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Enterprise Verified Vendor</h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Unlimited product & service catalog indexing, automated AI procurement matching, and top priority in WEBUOS global discovery algorithms.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-right sm:min-w-[200px]">
            <p className="text-xs font-semibold text-slate-400">Annual Subscription</p>
            <p className="mt-1 text-2xl font-bold text-white">₹49,999 <span className="text-xs font-normal text-slate-400">/ yr</span></p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Auto-renew Active
            </span>
          </div>
        </div>

        {/* Plan Features Pill Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-white/10 pt-6">
          {[
            "Unlimited Catalog Listings",
            "Level 3 Verified Badge",
            "Direct Global RFQ Access",
            "AI Agent Search Priority",
            "Dedicated Account Manager",
            "24/7 Priority Support",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-2 text-xs text-slate-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Invoice History */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Billing & Invoices</h3>
        <p className="text-xs text-slate-400">Download official tax invoices and payment receipts for your accounting records.</p>

        <div className="mt-6 space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{inv.desc}</p>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    {inv.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">Invoice: {inv.id} · Date: {inv.date}</p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-sm font-bold text-white">{inv.amount}</span>
                <button
                  type="button"
                  onClick={() => toast.success(`Downloading tax invoice ${inv.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" /> Receipt PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
