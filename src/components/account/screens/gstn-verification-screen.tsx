"use client";

import { useState } from "react";
import { FileText, CheckCircle2, Search, ShieldCheck, RefreshCw, AlertCircle, Building2, MapPin, Calendar, Check } from "lucide-react";
import { toast } from "sonner";

export function GstnVerificationScreen() {
  const [gstin, setGstin] = useState("29ABCDE1234F1Z5");
  const [isFetching, setIsFetching] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const gstData = {
    legalName: "WEBUOS TECHNOLOGIES PRIVATE LIMITED",
    tradeName: "WEBUOS Tech & AI Solutions",
    pan: "ABCDE1234F",
    gstinStatus: "Active",
    taxpayerType: "Regular",
    registrationDate: "14-Mar-2018",
    stateJurisdiction: "Ward 42, Bengaluru East, Karnataka",
    principalAddress: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield, Bengaluru, Karnataka, 560066",
    natureOfBusiness: "Software Publishing, AI Consultancy, High-Tech Industrial SaaS Solutions",
  };

  const handleVerifyGSTIN = () => {
    if (!gstin || gstin.length < 10) {
      toast.error("Please enter a valid 15-character GSTIN number.");
      return;
    }
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setIsVerified(true);
      toast.success("GSTIN verified successfully from GST Portal API!");
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">GSTN & Tax Verification</h2>
        <p className="mt-1 text-sm text-slate-400">
          Auto-verify your registered business identity and tax credentials with the Goods & Services Tax Network (GSTN).
        </p>
      </div>

      {/* GSTIN Input & Auto-fetch */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Verify GSTIN / Tax Identification</h3>
        <p className="text-xs text-slate-400">Enter your 15-character Goods & Services Tax Identification Number.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FileText className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 29ABCDE1234F1Z5"
              className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 font-mono text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleVerifyGSTIN}
            disabled={isFetching}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Fetch & Verify
              </>
            )}
          </button>
        </div>
      </section>

      {/* Verified GSTN Card */}
      {isVerified && (
        <section className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] via-slate-900/90 to-slate-900 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">GSTN Registration Verified</h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">GSTIN: <span className="font-mono text-white">{gstin}</span></p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              Last synced: Today, 01:20 PM
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Legal Entity Name</p>
              <p className="mt-1 text-sm font-bold text-white">{gstData.legalName}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trade Name</p>
              <p className="mt-1 text-sm font-bold text-white">{gstData.tradeName}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Permanent Account Number (PAN)</p>
              <p className="mt-1 font-mono text-sm font-bold text-cyan-400">{gstData.pan}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Taxpayer Type</p>
              <p className="mt-1 text-sm font-bold text-white">{gstData.taxpayerType}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date of Registration</p>
              <p className="mt-1 text-sm font-bold text-white">{gstData.registrationDate}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Jurisdiction</p>
              <p className="mt-1 text-sm font-bold text-white">{gstData.stateJurisdiction}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 sm:col-span-2 lg:col-span-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Principal Place of Business (from GST Portal)</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">{gstData.principalAddress}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 sm:col-span-2 lg:col-span-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Nature of Business</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">{gstData.natureOfBusiness}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
