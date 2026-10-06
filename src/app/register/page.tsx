"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2,
  Check, Search, Sparkles, UserPlus, Phone, Store, ShoppingCart, ArrowLeftRight, Info,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

function RegisterContent() {
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
  const [businessIntent, setBusinessIntent] = useState<"sell" | "buy" | "both">("both");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Route to verification page
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (phone) params.set("phone", phone);
    window.location.href = `/register/verify${params.toString() ? `?${params.toString()}` : ""}`;
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
            <Link href="/login" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 transition-all duration-200 hover:border-cyan-500/30 hover:bg-white/[0.06]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-500/15 group-hover:text-cyan-400">
                <ArrowLeft className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Return
                </p>
                <p className="text-sm font-bold text-white">Back to Sign In</p>
              </div>
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
                      Organizations / Business
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

            {/* Buy / Sell / Both cards — only for Organizations / Business */}
            {accountType === "employer" && (
              <div style={{ animation: "fadeIn .2s ease-out" }}>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-400/60">
                  What will you do on WEBUOS?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Sell */}
                  <button
                    type="button"
                    onClick={() => setBusinessIntent("sell")}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200",
                      businessIntent === "sell"
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06]"
                    )}
                  >
                    <span className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      businessIntent === "sell" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                    )}>
                      <Store className="h-5 w-5" />
                    </span>
                    <div>
                      <p className={cn("text-xs font-bold", businessIntent === "sell" ? "text-white" : "text-slate-300")}>
                        Sell
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        List products & services to buyers
                      </p>
                    </div>
                  </button>

                  {/* Buy */}
                  <button
                    type="button"
                    onClick={() => setBusinessIntent("buy")}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200",
                      businessIntent === "buy"
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06]"
                    )}
                  >
                    <span className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      businessIntent === "buy" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                    )}>
                      <ShoppingCart className="h-5 w-5" />
                    </span>
                    <div>
                      <p className={cn("text-xs font-bold", businessIntent === "buy" ? "text-white" : "text-slate-300")}>
                        Buy
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Discover suppliers & partners
                      </p>
                    </div>
                  </button>

                  {/* Both */}
                  <button
                    type="button"
                    onClick={() => setBusinessIntent("both")}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200",
                      businessIntent === "both"
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06]"
                    )}
                  >
                    <span className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      businessIntent === "both" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                    )}>
                      <ArrowLeftRight className="h-5 w-5" />
                    </span>
                    <div>
                      <p className={cn("text-xs font-bold", businessIntent === "both" ? "text-white" : "text-slate-300")}>
                        Both
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Trade on both sides
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

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

          {/* No duplicate Back to Login here — it's at the top now */}
        </aside>

        {/* Right form panel — top-aligned, wider, full width */}
        <main className="flex flex-1 flex-col bg-background px-4 pt-8 sm:px-8 lg:px-12 lg:pt-12">
          <div className="w-full">

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Account details
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in your information to create your WEBUOS account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Full Name (full width) */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Row 2: Email + Phone No (2 columns) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
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

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone No</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Company / Organization Name (full width) */}
              <div className="space-y-1.5">
                <label htmlFor="companyName" className="text-sm font-medium text-foreground">Company / Organization Name</label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Industries"
                    className="h-11 w-full rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Row 4: Password + Confirm Password (2 columns) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
              </div>

              {/* Info alert */}
              <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-xs text-muted-foreground">
                  After registration you'll verify your email and phone with a one-time code.
                </p>
              </div>

              {/* Terms & Conditions checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <span className="font-medium text-primary hover:underline cursor-pointer">Terms &amp; Conditions</span>
                  {" "}and{" "}
                  <span className="font-medium text-primary hover:underline cursor-pointer">Privacy Policy</span>
                  {" "}of WEBUOS. I understand that my business information will be indexed in the global business discovery platform and may be visible to buyers, suppliers, and partners worldwide.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-slate-400">
          <div className="text-sm">Loading registration…</div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

