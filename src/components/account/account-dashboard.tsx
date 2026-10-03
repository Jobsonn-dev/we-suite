"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Home, Mail, Phone, Building2, FileText, Landmark, Network,
  ShieldCheck, Database, Users, CreditCard, FolderCheck, Search,
  Bell, HelpCircle, Grid3x3, ChevronRight, Check, AlertTriangle,
  ArrowRight, Settings, Lock, User, Smartphone,
  FileImage, Clock, Sparkles, ExternalLink, LogOut,
} from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================
type NavId =
  | "home"
  | "personal"
  | "communication"
  | "business"
  | "gstn"
  | "industry"
  | "bank"
  | "documents"
  | "security"
  | "privacy"
  | "sharing"
  | "storage";

interface NavItem {
  id: NavId;
  label: string;
  icon: typeof Home;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home, color: "bg-blue-500/15 text-blue-400" },
  { id: "personal", label: "Personal info", icon: User, color: "bg-emerald-500/15 text-emerald-400" },
  { id: "communication", label: "Communication", icon: Mail, color: "bg-emerald-500/15 text-emerald-400" },
  { id: "business", label: "Business profile", icon: Building2, color: "bg-amber-500/15 text-amber-400" },
  { id: "gstn", label: "GSTN & Company", icon: FileText, color: "bg-amber-500/15 text-amber-400" },
  { id: "industry", label: "Industry hierarchy", icon: Network, color: "bg-amber-500/15 text-amber-400" },
  { id: "bank", label: "Bank details", icon: Landmark, color: "bg-amber-500/15 text-amber-400" },
  { id: "documents", label: "Legal documents", icon: FolderCheck, color: "bg-amber-500/15 text-amber-400" },
  { id: "security", label: "Security & sign-in", icon: Lock, color: "bg-blue-500/15 text-blue-400" },
  { id: "privacy", label: "Data & privacy", icon: ShieldCheck, color: "bg-orange-500/15 text-orange-400" },
  { id: "sharing", label: "People & sharing", icon: Users, color: "bg-pink-500/15 text-pink-400" },
  { id: "storage", label: "Account storage", icon: Database, color: "bg-purple-500/15 text-purple-400" },
];

// Verification steps based on the Registration Manual PPT (Steps 8-15)
interface VerifyStep {
  id: string;
  stepNo: string;
  title: string;
  subtitle: string;
  status: "verified" | "pending" | "not-started";
  icon: typeof FileText;
  fields: string[];
  cta: string;
}

const VERIFY_STEPS: VerifyStep[] = [
  {
    id: "communication",
    stepNo: "Step 7",
    title: "Communication details",
    subtitle: "Email & phone OTP verification",
    status: "verified",
    icon: Mail,
    fields: ["Email address", "Phone number"],
    cta: "View details",
  },
  {
    id: "gstn",
    stepNo: "Step 8-9",
    title: "GSTN & Company info",
    subtitle: "Auto-fetch company details from GSTN",
    status: "not-started",
    icon: FileText,
    fields: ["GST Number", "Company name", "PAN", "Tax payer type", "Company address"],
    cta: "Start GSTN verification",
  },
  {
    id: "business",
    stepNo: "Step 10",
    title: "Company business details",
    subtitle: "Nature of business, service area, supply capabilities, industries",
    status: "not-started",
    icon: Building2,
    fields: ["Nature of business", "Geographical service area", "Supply capabilities", "Industries sector"],
    cta: "Add business details",
  },
  {
    id: "industry",
    stepNo: "Step 11-12",
    title: "Industry hierarchy",
    subtitle: "Select main-core, category & sub-category",
    status: "not-started",
    icon: Network,
    fields: ["Main-core", "Category", "Sub-category"],
    cta: "Select hierarchy",
  },
  {
    id: "bank",
    stepNo: "Step 13",
    title: "Bank details",
    subtitle: "Bank account information for payouts",
    status: "not-started",
    icon: Landmark,
    fields: ["IFSC code", "Account number", "Bank name", "Branch", "Account type"],
    cta: "Add bank details",
  },
  {
    id: "documents",
    stepNo: "Step 14-15",
    title: "Legal documents & vendor validation",
    subtitle: "Upload certificates & submit for admin approval",
    status: "not-started",
    icon: FolderCheck,
    fields: ["MSME certificate", "IEC registration", "Cancelled cheque", "PAN card", "GST certificate"],
    cta: "Upload documents",
  },
];

const QUICK_ACCESS = [
  { label: "Email", icon: Mail, color: "text-emerald-400" },
  { label: "Phone", icon: Smartphone, color: "text-emerald-400" },
  { label: "Business profile", icon: Building2, color: "text-amber-400" },
  { label: "GSTN details", icon: FileText, color: "text-amber-400" },
  { label: "Bank details", icon: CreditCard, color: "text-amber-400" },
  { label: "Documents", icon: FileImage, color: "text-amber-400" },
  { label: "Activity", icon: Clock, color: "text-blue-400" },
  { label: "Security", icon: Lock, color: "text-blue-400" },
];

// ============================================================
// Main component
// ============================================================
export function AccountDashboard() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "webuostech@gmail.com";
  const phone = searchParams.get("phone") ?? "+91 78295 23537";
  const companyName = "WEBUOS Tech & AI Services";

  const [activeNav, setActiveNav] = useState<NavId>("home");
  const [searchQuery, setSearchQuery] = useState("");

  const verificationStats = useMemo(() => {
    const verified = VERIFY_STEPS.filter((s) => s.status === "verified").length;
    const total = VERIFY_STEPS.length;
    const pending = VERIFY_STEPS.filter((s) => s.status === "not-started").length;
    return { verified, total, pending, pct: Math.round((verified / total) * 100) };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* ───────────────────────────────────────────────
          Top header bar (Google Account style)
      ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0e1a]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center" aria-label="WEBUOS home">
              <WebuosLogo size="sm" />
            </Link>
            <span className="hidden text-sm font-semibold text-slate-300 sm:inline">Profile Account</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Help"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Apps"
            >
              <Grid3x3 className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400" />
            </button>

            {/* Profile avatar */}
            <button
              type="button"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white ring-2 ring-white/20 transition-all hover:ring-cyan-400/50"
              aria-label="Profile"
            >
              WT
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* ───────────────────────────────────────────────
            Left sidebar nav (Google Account style)
        ─────────────────────────────────────────────── */}
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-64 shrink-0 border-r border-white/10 bg-[#0a0e1a] py-4 lg:block">
          <nav className="flex flex-col gap-0.5 px-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              const isBusinessPending =
                ["business", "gstn", "industry", "bank", "documents"].includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                    active
                      ? "bg-cyan-500/10 font-semibold text-white ring-1 ring-cyan-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active ? item.color : "bg-white/5 text-slate-500 group-hover:text-slate-300",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {isBusinessPending && (
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" title="Pending verification" />
                  )}
                  {item.id === "communication" && (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-white/10 px-4 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              <LogOut className="h-3.5 w-3.5" /> Back to WEBUOS
            </Link>
          </div>
        </aside>

        {/* ───────────────────────────────────────────────
            Main content
        ─────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1 bg-background">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
            {/* Profile header */}
            <section className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/30 ring-4 ring-white/10">
                  WT
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0a0e1a] bg-white text-slate-700 hover:bg-slate-100"
                  aria-label="Edit profile picture"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {companyName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-500">
                  <Check className="h-3 w-3" /> Communication verified
                </div>
              </div>
            </section>

            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Profile Account"
                className="h-12 w-full rounded-full border border-border bg-muted/40 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Quick access buttons */}
            <div className="mb-8 flex flex-wrap gap-2.5">
              {QUICK_ACCESS.map((qa) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={qa.label}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-muted/40"
                  >
                    <Icon className={cn("h-3.5 w-3.5", qa.color)} />
                    {qa.label}
                  </button>
                );
              })}
            </div>

            {/* ── Critical verification alert banner ── */}
            <section
              className="mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent"
              style={{ animation: "alertFadeIn 0.5s ease-out 0.1s both" }}
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      Complete your business verification
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your communication details are verified, but your business profile is incomplete.
                      Complete the remaining {verificationStats.pending} steps to unlock the vendor dashboard
                      and start listing on WEBUOS.
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">
                        Verification progress
                      </span>
                      <span className="font-bold text-amber-500">
                        {verificationStats.verified} / {verificationStats.total} steps
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${verificationStats.pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveNav("gstn")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-amber-950 transition-all hover:bg-amber-400"
                    >
                      Start verification <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNav("documents")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted/40"
                    >
                      View requirements
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Communication Details (VERIFIED) ── */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04]">
              <div className="border-b border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-3 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Communication details
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-px bg-emerald-500/10 sm:grid-cols-2">
                {/* Email */}
                <div className="bg-background p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Email address
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">{email}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Verified via OTP at sign-up
                        </p>
                      </div>
                    </div>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  </div>
                </div>
                {/* Phone */}
                <div className="bg-background p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                        <Phone className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Phone number
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">{phone}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Verified via OTP at sign-up
                        </p>
                      </div>
                    </div>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Business Verification Steps (PENDING) ── */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    Business verification
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete these steps to activate your vendor dashboard
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500">
                  <Clock className="h-3.5 w-3.5" /> {verificationStats.pending} pending
                </span>
              </div>

              <div className="space-y-3">
                {VERIFY_STEPS.map((step, idx) => (
                  <StepCard key={step.id} step={step} index={idx} onActivate={() => setActiveNav(step.id as NavId)} />
                ))}
              </div>
            </section>

            {/* ── Help / Resources strip ── */}
            <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <HelpCard
                icon={HelpCircle}
                title="Registration guide"
                subtitle="Step-by-step manual"
                color="text-blue-400 bg-blue-500/15"
              />
              <HelpCard
                icon={ShieldCheck}
                title="Privacy policy"
                subtitle="How we handle your data"
                color="text-orange-400 bg-orange-500/15"
              />
              <HelpCard
                icon={Sparkles}
                title="WEBUOS ecosystem"
                subtitle="Browse 3 ecosystems"
                color="text-cyan-400 bg-cyan-500/15"
                href="/business-taxonomy"
              />
            </section>

            {/* Footer note */}
            <p className="pb-6 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} WEBUOS · Global Business Discovery Platform
            </p>
          </div>
        </main>
      </div>

      {/* Mobile bottom-nav for sections */}
      <MobileSectionNav activeNav={activeNav} setNav={setActiveNav} />

      <style jsx global>{`
        @keyframes alertFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes stepFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Step Card sub-component
// ============================================================
function StepCard({ step, index, onActivate }: { step: VerifyStep; index: number; onActivate: () => void }) {
  const Icon = step.icon;
  const isVerified = step.status === "verified";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-lg sm:p-6",
        isVerified
          ? "border-emerald-500/30 bg-emerald-500/[0.04]"
          : "border-border hover:border-amber-500/40 hover:bg-amber-500/[0.02]",
      )}
      style={{ animation: `stepFadeIn 0.5s ease-out ${0.1 + index * 0.08}s both` }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* Icon + step number */}
        <div className="flex items-start gap-3 sm:w-auto">
          <span
            className={cn(
              "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              isVerified
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-amber-500/15 text-amber-500",
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {step.stepNo}
            </span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                <Check className="h-3 w-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                <Clock className="h-3 w-3" /> Not started
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-foreground">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.subtitle}</p>

          {/* Fields list */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {step.fields.map((field) => (
              <span
                key={field}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                  isVerified
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-muted/30 text-muted-foreground",
                )}
              >
                {isVerified ? <Check className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {field}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="sm:ml-auto sm:shrink-0">
          {isVerified ? (
            <button
              type="button"
              onClick={onActivate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              {step.cta} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onActivate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-amber-950 transition-all hover:bg-amber-400"
            >
              {step.cta} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Help Card
// ============================================================
function HelpCard({
  icon: Icon,
  title,
  subtitle,
  color,
  href,
}: {
  icon: typeof HelpCircle;
  title: string;
  subtitle: string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/30">
      <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", color)}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {href && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    <button type="button" className="block w-full text-left">
      {inner}
    </button>
  );
}

// ============================================================
// Mobile Section Nav (bottom sheet style)
// ============================================================
function MobileSectionNav({
  activeNav,
  setNav,
}: {
  activeNav: NavId;
  setNav: (id: NavId) => void;
}) {
  const [open, setOpen] = useState(false);

  const active = NAV_ITEMS.find((n) => n.id === activeNav);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md lg:hidden"
      >
        <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-md", active?.color ?? "bg-white/5")}>
          {active && <active.icon className="h-3 w-3" />}
        </span>
        {active?.label ?? "Sections"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-[#0a0e1a] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-sm font-bold text-white">Account sections</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setNav(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      isActive ? "bg-cyan-500/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg", item.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
