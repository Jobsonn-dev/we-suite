"use client";

import Link from "next/link";
import {
  Building2, Users, BarChart3, Wallet, Calculator, TrendingUp, Megaphone,
  ShoppingCart, Package, ListChecks, FileText, MessageSquare, Video,
  Headphones, Brain, Search, Workflow, Zap, ShieldCheck, Settings,
  UserSquare, Truck, Handshake, Globe, Plug, FileBarChart, Bell,
  Layers, Network, Cpu, Stethoscope, GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { WebuosLogo } from "@/components/brand/webuos-logo";

interface AppDef {
  name: string;
  icon: LucideIcon;
  color: string; // tailwind gradient classes for the icon background
  href: string;
}

// All 32 apps matching the WebUOS Business Apps Dashboard
const APPS: AppDef[] = [
  // Row 1
  { name: "Business", icon: Building2, color: "from-blue-500 to-blue-600", href: "/dashboard" },
  { name: "CRM", icon: Users, color: "from-cyan-500 to-blue-500", href: "/dashboard" },
  { name: "ERP", icon: Layers, color: "from-blue-500 to-purple-500", href: "/dashboard" },
  { name: "HR", icon: Users, color: "from-green-500 to-teal-500", href: "/dashboard" },
  { name: "Finance", icon: Wallet, color: "from-amber-500 to-orange-500", href: "/dashboard" },
  { name: "Accounting", icon: Calculator, color: "from-emerald-500 to-green-600", href: "/dashboard" },
  { name: "Sales", icon: TrendingUp, color: "from-blue-500 to-indigo-500", href: "/dashboard" },
  { name: "Marketing", icon: Megaphone, color: "from-purple-500 to-pink-500", href: "/dashboard" },
  // Row 2
  { name: "Marketplace", icon: ShoppingCart, color: "from-orange-500 to-red-500", href: "/dashboard" },
  { name: "Procurement", icon: ShoppingCart, color: "from-cyan-500 to-blue-500", href: "/dashboard" },
  { name: "Inventory", icon: Package, color: "from-amber-500 to-yellow-500", href: "/dashboard" },
  { name: "Projects", icon: ListChecks, color: "from-violet-500 to-purple-500", href: "/dashboard" },
  { name: "Tasks", icon: ListChecks, color: "from-teal-500 to-cyan-500", href: "/dashboard" },
  { name: "Documents", icon: FileText, color: "from-blue-500 to-cyan-500", href: "/dashboard" },
  { name: "Communication", icon: MessageSquare, color: "from-cyan-400 to-blue-500", href: "/dashboard" },
  { name: "Meetings", icon: Video, color: "from-purple-500 to-violet-500", href: "/dashboard" },
  // Row 3
  { name: "Support", icon: Headphones, color: "from-green-500 to-emerald-500", href: "/dashboard" },
  { name: "Analytics", icon: BarChart3, color: "from-blue-500 to-cyan-500", href: "/dashboard" },
  { name: "AI", icon: Brain, color: "from-cyan-500 to-blue-600", href: "/dashboard" },
  { name: "Search", icon: Search, color: "from-indigo-500 to-blue-500", href: "/search" },
  { name: "Workflow", icon: Workflow, color: "from-violet-500 to-purple-500", href: "/dashboard" },
  { name: "Automation", icon: Zap, color: "from-amber-500 to-orange-500", href: "/dashboard" },
  { name: "Security", icon: ShieldCheck, color: "from-red-500 to-rose-500", href: "/dashboard" },
  { name: "Admin", icon: Settings, color: "from-slate-500 to-slate-600", href: "/dashboard" },
  // Row 4
  { name: "Employees", icon: Users, color: "from-teal-500 to-green-500", href: "/dashboard" },
  { name: "Customers", icon: UserSquare, color: "from-amber-500 to-yellow-500", href: "/dashboard" },
  { name: "Suppliers", icon: Truck, color: "from-orange-500 to-red-500", href: "/dashboard" },
  { name: "Partners", icon: Handshake, color: "from-amber-500 to-orange-500", href: "/dashboard" },
  { name: "Ecosystem", icon: Globe, color: "from-cyan-500 to-blue-500", href: "/business-taxonomy" },
  { name: "Integrations", icon: Plug, color: "from-blue-500 to-indigo-500", href: "/dashboard" },
  { name: "Reports", icon: FileBarChart, color: "from-purple-500 to-indigo-500", href: "/dashboard" },
  { name: "Settings", icon: Settings, color: "from-slate-400 to-slate-500", href: "/dashboard" },
];

export default function AppsPage() {
  return (
    <PageShell>
      <div className="min-h-screen bg-[#0a0e1a]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <WebuosLogo size="xl" />
            <div className="mt-4 flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
              <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                Business Apps
              </h1>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {APPS.length} applications to power your business ecosystem
            </p>
          </div>

          {/* Apps grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {APPS.map((app) => {
              const Icon = app.icon;
              return (
                <Link
                  key={app.name}
                  href={app.href}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-[#131826] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-[#161c2e] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${app.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-center text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
                    {app.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <a
              href="https://esuite.webuos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-6 py-2.5 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              Open ESuite
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
