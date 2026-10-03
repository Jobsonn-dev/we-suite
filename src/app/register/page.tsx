"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2,
  Check, Search, Sparkles, UserPlus, Phone, Globe,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type");
  const [accountType, setAccountType] = useState<"employee" | "employer">(
    urlType === "employee" ? "employee" : "employer"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo: navigate to dashboard
    window.location.href = "/dashboard";
  }

  return (
    <PageShell>
      <div className="flex min-h-[calc(100vh-60px)] flex-col lg:flex-row">
        {/* Left brand panel — always dark */}
        <aside className="relative hidden overflow-hidden bg-[#0a0e1a] lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to WEBUOS
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Account type cards — matching the attached image design */}
            <div>
              <p className="mb-3 text-sm text-slate-400">
                Choose your account type to register
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* PEOPLE • ROLES card */}
                <button
                  type="button"
                  onClick={() => setAccountType("employee")}
                  className={cn(
                    "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all duration-200",
                    accountType === "employee"
                      ? "border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06]"
                  )}
                >
                  <span className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    accountType === "employee" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                  )}>
                    <User className="h-6 w-6" />
                  </span>
                  <div className="text-left space-y-1">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.15em]",
                      accountType === "employee" ? "text-cyan-400" : "text-slate-500"
                    )}>
                      People • Roles
                    </p>
                    <p className="text-base font-bold text-white">
                      Employee / Employer
                    </p>
                    <p className="text-xs text-slate-400">
                      For individuals and people-centric roles.
                    </p>
                  </div>
                  {accountType === "employee" && (
                    <span className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-cyan-950">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>

                {/* COMPANY • COMMERCE card */}
                <button
                  type="button"
                  onClick={() => setAccountType("employer")}
                  className={cn(
                    "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all duration-200",
                    accountType === "employer"
                      ? "border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06]"
                  )}
                >
                  <span className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    accountType === "employer" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                  )}>
                    <Building2 className="h-6 w-6" />
                  </span>
                  <div className="text-left space-y-1">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.15em]",
                      accountType === "employer" ? "text-cyan-400" : "text-slate-500"
                    )}>
                      Company • Commerce
                    </p>
                    <p className="text-base font-bold text-white">
                      Business
                    </p>
                    <p className="text-xs text-slate-400">
                      For companies, brands and commerce.
                    </p>
                  </div>
                  {accountType === "employer" && (
                    <span className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-cyan-950">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join the WEBUOS business ecosystem.
            </h1>
            <p className="max-w-md text-base text-slate-400">
              {accountType === "employee"
                ? "Create your account to discover companies, products, and services worldwide. Save businesses, track searches, and connect with employers across the global WEBUOS ecosystem."
                : "Register your company to showcase products and services, connect with buyers and suppliers, and manage your business profile across the WEBUOS global discovery platform."}
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ecosystems.map(seg => {
                const color = getColor(seg.categories[0]?.color ?? "blue");
                return (
                  <Link key={seg.id} href={`/business-taxonomy/${seg.id}`} className={cn("group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md transition-all hover:bg-white/[0.07]", color.border)}>
                    <span className={cn("absolute left-0 top-0 h-full w-1 transition-all group-hover:w-1.5", color.dot)} />
                    <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110", color.iconBg, color.iconText)}>
                      <DynamicIcon name={seg.icon} className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", accentText(seg.accent))}>{seg.number}</p>
                      <p className="text-xs font-semibold leading-tight text-white sm:text-[13px]">{seg.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Search className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">117+ companies indexed</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">AI-powered discovery</span>
              </div>
            </div>
          </div>

          {/* Return to login — same card style */}
          <div className="relative z-10">
            <Link
              href="/login"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-cyan-500/30 hover:bg-white/[0.06]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-500/15 group-hover:text-cyan-400">
                <ArrowLeft className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Return
                </p>
                <p className="text-sm font-bold text-white">Back to Login</p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Right form panel */}
        <main className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Mobile back link + account type */}
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden">
                <ArrowLeft className="h-4 w-4" /> Back to WEBUOS
              </Link>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType("employee")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                    accountType === "employee"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <User className="h-3.5 w-3.5" /> Employee
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("employer")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                    accountType === "employer"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" /> Employer
                </button>
              </div>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Create your {accountType === "employee" ? "Employee" : "Employer"} account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {accountType === "employee"
                  ? "Register to discover businesses, save searches, and connect with employers."
                  : "Register your company to list products, connect with buyers, and manage your business profile."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  {accountType === "employee" ? "Full Name" : "Contact Person Name"}
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={accountType === "employee" ? "John Doe" : "Jane Smith"}
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Company name — only for employer */}
              {accountType === "employer" && (
                <div className="space-y-1.5">
                  <label htmlFor="companyName" className="text-sm font-medium text-foreground">Company Name</label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ABC Technologies Pvt Ltd"
                      className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone number</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 0100"
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Website — only for employer */}
              {accountType === "employer" && (
                <div className="space-y-1.5">
                  <label htmlFor="website" className="text-sm font-medium text-foreground">Company Website (optional)</label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-10 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <span className="font-medium text-primary hover:underline cursor-pointer">Terms of Service</span>
                  {" "}and{" "}
                  <span className="font-medium text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
              >
                <UserPlus className="h-4 w-4" />
                Register as {accountType === "employee" ? "Employee" : "Employer"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Already have an account */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in →
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
