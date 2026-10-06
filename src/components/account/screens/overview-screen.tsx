"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Mail, Phone, Building2, FileText, Network, FolderCheck,
  ShieldCheck, ArrowRight, Check, AlertTriangle, Clock,
  Eye, MessageSquare, Package, TrendingUp, Sparkles, ExternalLink,
  ChevronRight, Lock, Users, Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OverviewScreenProps {
  email: string;
  phone: string;
  companyName: string;
  onNavigate: (sectionId: string) => void;
}

export function OverviewScreen({
  email,
  phone,
  companyName,
  onNavigate,
}: OverviewScreenProps) {
  const steps = [
    {
      id: "communication",
      title: "Communication details",
      desc: "Email & phone OTP verification",
      status: "verified",
      icon: Mail,
      tag: "Verified",
    },
    {
      id: "gstn",
      title: "GSTN & Company identity",
      desc: "Auto-fetch & verify registration with GST portal",
      status: "pending",
      icon: FileText,
      tag: "Action required",
    },
    {
      id: "business",
      title: "Business profile details",
      desc: "Nature of business, service areas & capabilities",
      status: "pending",
      icon: Building2,
      tag: "Incomplete",
    },
    {
      id: "industry",
      title: "Industry & taxonomy hierarchy",
      desc: "Select core ecosystem, categories & products",
      status: "pending",
      icon: Network,
      tag: "Action required",
    },
    {
      id: "documents",
      title: "Legal documents & certifications",
      desc: "Upload MSME, PAN, and business licenses",
      status: "pending",
      icon: FolderCheck,
      tag: "Pending upload",
    },
  ];

  const quickStats = [
    {
      label: "Monthly Profile Views",
      value: "1,248",
      change: "+24.5%",
      icon: Eye,
      color: "text-cyan-400 bg-cyan-500/10",
    },
    {
      label: "Buyer Inquiries",
      value: "38",
      change: "+12 new",
      icon: MessageSquare,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Catalog Items Listed",
      value: "24",
      change: "4 Drafts",
      icon: Package,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Profile Strength",
      value: "82%",
      change: "Very Good",
      icon: TrendingUp,
      color: "text-purple-400 bg-purple-500/10",
    },
  ];

  const recentActivities = [
    {
      title: "Phone & Email OTP Verified",
      time: "Today, 02:45 PM",
      desc: "Completed primary authentication protocol",
      icon: Check,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "New Sign-in from Chrome (Windows)",
      time: "Today, 01:15 PM",
      desc: "IP 103.21.244.12 · Bengaluru, India",
      icon: Lock,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      title: "Ecosystem Selected: Technology & AI",
      time: "Yesterday, 06:30 PM",
      desc: "Configured primary category to Enterprise Software",
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-6 sm:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-cyan-500/20 ring-4 ring-white/10">
                WT
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-slate-900">
                <Check className="h-3.5 w-3.5" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  {companyName}
                </h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  Verified Account
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{email} · {phone}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1">
                  <Building2 className="h-3.5 w-3.5 text-cyan-400" /> B2B Tech Provider
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Enterprise Tier
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("business")}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Edit Business Profile <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <Link
              href="/business-taxonomy"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
            >
              Browse Taxonomy <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{st.label}</span>
                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", st.color)}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">{st.value}</span>
                <span className="text-xs font-semibold text-emerald-400">{st.change}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Verification Alert & Next Steps */}
      <section className="overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-900 p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2 lg:max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" /> Verification in Progress (1 of 5 Complete)
            </div>
            <h2 className="text-xl font-bold text-white">Complete your vendor listing requirements</h2>
            <p className="text-sm text-slate-300">
              To appear in search rankings and receive direct RFQs from verified buyers, please complete your GSTN identity, company details, and compliance documents.
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Progress: 20% Completed</span>
                <span className="text-amber-400">4 Steps Remaining</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-1/5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("gstn")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
          >
            Start GSTN Verification <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Steps Cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((st) => {
            const Icon = st.icon;
            const isDone = st.status === "verified";
            return (
              <div
                key={st.id}
                onClick={() => onNavigate(st.id)}
                className={cn(
                  "group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                  isDone
                    ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                    : "border-white/10 bg-slate-950/40 hover:border-amber-500/40 hover:bg-white/5",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    isDone ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400",
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-xs font-bold text-white group-hover:text-cyan-400">{st.title}</p>
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{st.desc}</p>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      isDone
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400",
                    )}
                  >
                    {st.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Column Grid: Communication & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Communication Channels */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Verified Communication</h3>
              <p className="text-xs text-slate-400">Authenticated contact methods for account recovery</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("communication")}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Primary Email</p>
                  <p className="text-sm font-bold text-white">{email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <Check className="h-3 w-3" /> OTP Verified
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Phone Number</p>
                  <p className="text-sm font-bold text-white">{phone}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <Check className="h-3 w-3" /> OTP Verified
              </span>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-slate-400">Security and profile updates</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("activity")}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-3.5"
                >
                  <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", act.color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white">{act.title}</p>
                      <span className="text-[10px] text-slate-500">{act.time}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
