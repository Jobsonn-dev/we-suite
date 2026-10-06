"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Home, Mail, User, Building2, FileText, Network, FolderCheck,
  ShieldCheck, Lock, Users, Database, Bell, Sparkles, Clock,
  Search, HelpCircle, Grid3x3, Check, LogOut, ChevronRight,
  Menu, X
} from "lucide-react";
import { WebuosLogo } from "@/components/brand/webuos-logo";
import { cn } from "@/lib/utils";
import { OverviewScreen } from "./screens/overview-screen";
import { PersonalInfoScreen } from "./screens/personal-info-screen";
import { CommunicationScreen } from "./screens/communication-screen";
import { BusinessProfileScreen } from "./screens/business-profile-screen";
import { GstnVerificationScreen } from "./screens/gstn-verification-screen";
import { IndustryHierarchyScreen } from "./screens/industry-hierarchy-screen";
import { LegalDocumentsScreen } from "./screens/legal-documents-screen";
import { SecurityScreen } from "./screens/security-screen";
import { PrivacyScreen } from "./screens/privacy-screen";
import { TeamSharingScreen } from "./screens/team-sharing-screen";
import { StorageQuotaScreen } from "./screens/storage-quota-screen";
import { NotificationsScreen } from "./screens/notifications-screen";
import { SubscriptionScreen } from "./screens/subscription-screen";
import { ActivityLogsScreen } from "./screens/activity-logs-screen";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";

// ============================================================
// Types & Nav Item Configuration
// ============================================================
export type NavId =
  | "home"
  | "personal"
  | "communication"
  | "business"
  | "gstn"
  | "industry"
  | "documents"
  | "security"
  | "privacy"
  | "sharing"
  | "storage"
  | "notifications"
  | "subscription"
  | "activity";

export interface NavGroup {
  title: string;
  items: {
    id: NavId;
    label: string;
    icon: any;
    color: string;
    badge?: string;
    badgeType?: "verified" | "pending" | "pro";
  }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview & Identity",
    items: [
      { id: "home", label: "Dashboard Home", icon: Home, color: "bg-blue-500/15 text-blue-400" },
      { id: "personal", label: "Personal info", icon: User, color: "bg-emerald-500/15 text-emerald-400" },
      { id: "communication", label: "Communication", icon: Mail, color: "bg-emerald-500/15 text-emerald-400", badge: "Verified", badgeType: "verified" },
    ],
  },
  {
    title: "Business & Verification",
    items: [
      { id: "business", label: "Business profile", icon: Building2, color: "bg-amber-500/15 text-amber-400" },
      { id: "gstn", label: "GSTN & Tax info", icon: FileText, color: "bg-amber-500/15 text-amber-400", badge: "Active", badgeType: "verified" },
      { id: "industry", label: "Industry hierarchy", icon: Network, color: "bg-amber-500/15 text-amber-400" },
      { id: "documents", label: "Legal documents", icon: FolderCheck, color: "bg-amber-500/15 text-amber-400", badge: "5 Docs", badgeType: "pro" },
    ],
  },
  {
    title: "Security & Governance",
    items: [
      { id: "security", label: "Security & sign-in", icon: Lock, color: "bg-blue-500/15 text-blue-400", badge: "2FA On", badgeType: "verified" },
      { id: "privacy", label: "Data & privacy", icon: ShieldCheck, color: "bg-orange-500/15 text-orange-400" },
      { id: "sharing", label: "People & sharing", icon: Users, color: "bg-pink-500/15 text-pink-400", badge: "4 Seats", badgeType: "pro" },
    ],
  },
  {
    title: "System & Resources",
    items: [
      { id: "storage", label: "Account storage", icon: Database, color: "bg-purple-500/15 text-purple-400", badge: "7.4 GB", badgeType: "pro" },
      { id: "notifications", label: "Notifications", icon: Bell, color: "bg-cyan-500/15 text-cyan-400", badge: "2 New", badgeType: "pending" },
      { id: "subscription", label: "Membership plan", icon: Sparkles, color: "bg-amber-500/15 text-amber-400", badge: "Enterprise", badgeType: "pro" },
      { id: "activity", label: "Activity & logs", icon: Clock, color: "bg-slate-500/15 text-slate-400" },
    ],
  },
];

// ============================================================
// Main Account Dashboard Component
// ============================================================
export function AccountDashboard() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "webuostech@gmail.com";
  const phone = searchParams.get("phone") ?? "+91 78295 23537";
  const companyName = "WEBUOS Tech & AI Services";

  const [activeNav, setActiveNav] = useState<NavId>("home");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Flattened nav items for searching & matching
  const allNavItems = useMemo(() => {
    return NAV_GROUPS.flatMap((g) => g.items);
  }, []);

  const activeNavItem = allNavItems.find((item) => item.id === activeNav) ?? allNavItems[0];

  // Filtered nav groups when user searches in the sidebar
  const filteredGroups = useMemo(() => {
    if (!sidebarSearch.trim()) return NAV_GROUPS;
    const query = sidebarSearch.toLowerCase();
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => i.label.toLowerCase().includes(query) || g.title.toLowerCase().includes(query)
      ),
    })).filter((g) => g.items.length > 0);
  }, [sidebarSearch]);

  const handleNavigate = (id: string) => {
    setActiveNav(id as NavId);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* ───────────────────────────────────────────────
          Top Header Bar
      ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center" aria-label="WEBUOS home">
              <WebuosLogo size="sm" />
            </Link>
            <span className="hidden text-xs font-semibold text-slate-400 sm:inline">
              / Profile Account
            </span>
          </div>

          {/* Active section title badge on mobile/desktop */}
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 md:flex">
            <activeNavItem.icon className="h-3.5 w-3.5 text-cyan-400" />
            <span>{activeNavItem.label}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" /> Directory Search
            </Link>

            <button
              type="button"
              onClick={() => handleNavigate("notifications")}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-[#070b14]" />
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown variant="account" />
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────
          Main Workspace: Left Scrollable Sidebar + Screen Area
      ─────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-[1440px]">
        {/* Desktop Scrollable Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-72 shrink-0 flex-col border-r border-white/10 bg-[#070b14] lg:flex">
          {/* Sidebar Search Bar */}
          <div className="p-3 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search settings..."
                className="h-9 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-8 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              />
              {sidebarSearch && (
                <button
                  type="button"
                  onClick={() => setSidebarSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Navigation Groups */}
          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {filteredGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.id)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all",
                          isActive
                            ? "bg-cyan-500/10 font-bold text-white ring-1 ring-cyan-500/30"
                            : "text-slate-400 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                            isActive ? item.color : "bg-white/5 text-slate-400 group-hover:text-slate-200",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="flex-1 truncate">{item.label}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[9px] font-bold",
                              item.badgeType === "verified"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : item.badgeType === "pending"
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-cyan-500/10 text-cyan-400",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer Link */}
          <div className="border-t border-white/10 p-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" /> Back to WEBUOS
            </Link>
          </div>
        </aside>

        {/* ───────────────────────────────────────────────
            Main Dynamic Screen Content
        ─────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            {activeNav === "home" && (
              <OverviewScreen
                email={email}
                phone={phone}
                companyName={companyName}
                onNavigate={handleNavigate}
              />
            )}

            {activeNav === "personal" && (
              <PersonalInfoScreen email={email} phone={phone} />
            )}

            {activeNav === "communication" && (
              <CommunicationScreen email={email} phone={phone} />
            )}

            {activeNav === "business" && <BusinessProfileScreen />}

            {activeNav === "gstn" && <GstnVerificationScreen />}

            {activeNav === "industry" && <IndustryHierarchyScreen />}

            {activeNav === "documents" && <LegalDocumentsScreen />}

            {activeNav === "security" && <SecurityScreen />}

            {activeNav === "privacy" && <PrivacyScreen />}

            {activeNav === "sharing" && <TeamSharingScreen />}

            {activeNav === "storage" && <StorageQuotaScreen />}

            {activeNav === "notifications" && <NotificationsScreen />}

            {activeNav === "subscription" && <SubscriptionScreen />}

            {activeNav === "activity" && <ActivityLogsScreen />}
          </div>
        </main>
      </div>

      {/* ───────────────────────────────────────────────
          Mobile Drawer Menu
      ─────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] border-r border-white/10 bg-[#070b14] p-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <WebuosLogo size="sm" />
                <span className="text-xs font-bold text-slate-300">Profile Account</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto py-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.title} className="space-y-1">
                  <p className="px-2 text-[10px] font-bold uppercase text-slate-500">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavigate(item.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all",
                            isActive
                              ? "bg-cyan-500/10 font-bold text-white ring-1 ring-cyan-500/30"
                              : "text-slate-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                              isActive ? item.color : "bg-white/5 text-slate-400",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
