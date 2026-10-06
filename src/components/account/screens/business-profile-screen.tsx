"use client";

import { useState } from "react";
import {
  Building2, Globe, MapPin, Users, DollarSign, Calendar,
  Share2, Eye, Save, Upload, Sparkles, Check, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function BusinessProfileScreen() {
  const [companyName, setCompanyName] = useState("WEBUOS Tech & AI Services");
  const [tradeName, setTradeName] = useState("WEBUOS Enterprise Solutions");
  const [tagline, setTagline] = useState("Accelerating Enterprise Digital Transformation & Industrial AI");
  const [businessType, setBusinessType] = useState("Technology & AI Provider");
  const [employeeRange, setEmployeeRange] = useState("50 - 200 Employees");
  const [annualRevenue, setAnnualRevenue] = useState("₹10 Cr - ₹50 Cr ($1.2M - $6M)");
  const [establishedYear, setEstablishedYear] = useState("2018");
  const [website, setWebsite] = useState("https://webuos.com");
  const [headquarters, setHeadquarters] = useState("Brigade Tech Gardens, Whitefield, Bengaluru 560066");
  const [marketsServed, setMarketsServed] = useState("India, North America, Southeast Asia, Middle East");
  const [operatingHours, setOperatingHours] = useState("Mon - Fri: 09:00 AM - 07:00 PM IST");
  const [isExporting, setIsExporting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Business profile details updated and synced to directory!");
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Company Business Profile</h2>
          <p className="mt-1 text-sm text-slate-400">
            Define how your company, capabilities, and industrial offerings appear to prospective enterprise clients.
          </p>
        </div>

        <Link
          href="/business/generative-ai-labs-bengaluru-53"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
        >
          <Eye className="h-4 w-4 text-cyan-400" /> Preview Live Profile
        </Link>
      </div>

      {/* Brand Assets */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Brand Assets & Imagery</h3>
        <p className="text-xs text-slate-400">High-resolution logo and header cover will boost profile credibility by 40%.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Logo Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white shadow-md">
              WT
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-xs font-bold text-white">Official Logo</p>
              <p className="text-[11px] text-slate-400">Square 512x512px PNG or SVG</p>
              <button
                type="button"
                onClick={() => toast.success("Logo uploaded!")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
              >
                <Upload className="h-3.5 w-3.5" /> Replace Logo
              </button>
            </div>
          </div>

          {/* Banner Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-slate-900 p-5">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-white">Cover Banner</p>
              <p className="text-[11px] text-slate-400">Panoramic 1200x300px header banner</p>
              <button
                type="button"
                onClick={() => toast.success("Cover banner updated!")}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
              >
                <Upload className="h-3.5 w-3.5" /> Upload Cover Banner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Company Details Form */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Company Identity</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">Registered Business Name</label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Trade Name / Brand Name</label>
            <input
              type="text"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Manufacturer">Contract Manufacturer</option>
              <option value="OEM / ODM">OEM / ODM Producer</option>
              <option value="Technology & AI Provider">Technology & AI Provider</option>
              <option value="Wholesale Supplier">Wholesale Supplier & Distributor</option>
              <option value="Engineering Services">Engineering & Technical Services</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">Company Tagline / Value Proposition</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Employee Range</label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={employeeRange}
                onChange={(e) => setEmployeeRange(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Annual Revenue Bracket</label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Year Established</label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Official Website URL</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Operations */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Facilities, Location & Markets</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">Headquarters / Plant Address</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <textarea
                rows={2}
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 pt-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Geographical Markets Served</label>
            <input
              type="text"
              value={marketsServed}
              onChange={(e) => setMarketsServed(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Operating Hours</label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <input
              type="checkbox"
              id="exporting"
              checked={isExporting}
              onChange={(e) => setIsExporting(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="exporting" className="text-xs font-medium text-slate-300">
              We are an active exporter capable of international shipping & global contracts
            </label>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
        >
          {isSaving ? "Saving profile..." : "Save Business Profile"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
