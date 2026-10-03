"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Check, Search, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [accountType, setAccountType] = useState<"professional" | "company">("company");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = "/dashboard";
  }

  return (
    <PageShell>
      <div className="flex min-h-[calc(100vh-60px)] flex-col lg:flex-row">
        {/* Left brand panel — always dark, never uses theme tokens */}
        <aside className="relative hidden overflow-hidden bg-[#0a0e1a] lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-10">
          {/* Dark gradient background */}
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
            {/* Account type selection buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("professional")}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all duration-200",
                  accountType === "professional"
                    ? "border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                )}
              >
                <span className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  accountType === "professional" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                )}>
                  <User className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className={cn("text-sm font-semibold", accountType === "professional" ? "text-white" : "text-slate-300")}>
                    Professional
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Individual / Freelancer
                  </p>
                </div>
                {accountType === "professional" && (
                  <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-cyan-950">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAccountType("company")}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all duration-200",
                  accountType === "company"
                    ? "border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                )}
              >
                <span className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  accountType === "company" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                )}>
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className={cn("text-sm font-semibold", accountType === "company" ? "text-white" : "text-slate-300")}>
                    Company
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Organization / Business
                  </p>
                </div>
                {accountType === "company" && (
                  <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-cyan-950">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The global business discovery platform.
            </h1>
            <p className="max-w-md text-base text-slate-400">
              {accountType === "professional"
                ? "Discover companies, products, services and industries worldwide. Sign in to access your saved businesses, search history, and personalized recommendations across the WEBUOS ecosystem."
                : "List your business, showcase products and services, connect with global buyers and suppliers. Sign in to manage your company profile, ESuite applications, and business network."}
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

          <div className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} WEBUOS. Global Business Discovery Platform.
          </div>
        </aside>

        {/* Right form panel */}
        <main className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Mobile back link */}
            <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden">
              <ArrowLeft className="h-4 w-4" /> Back to WEBUOS
            </Link>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back to WEBUOS
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {accountType === "professional"
                  ? "Sign in to discover businesses and manage your saved searches."
                  : "Sign in to manage your company profile and business network."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot password?</button>
                </div>
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

              {/* Keep me signed in */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">Keep me signed in</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
              >
                Sign in as {accountType === "professional" ? "Professional" : "Company"}
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

              {/* SSO */}
              <button
                type="button"
                onClick={() => { window.location.href = "/dashboard"; }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                Continue with Business SSO
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/business/create" className="font-semibold text-primary hover:underline">
                List your business →
              </Link>
            </p>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
