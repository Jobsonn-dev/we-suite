"use client";

import { useState } from "react";
import { Bell, MessageSquare, ShieldCheck, Sparkles, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "inquiry" | "security" | "system" | "taxonomy";
  read: boolean;
}

export function NotificationsScreen() {
  const [filter, setFilter] = useState<"all" | "inquiry" | "security" | "system">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "New RFQ Inquiry from Precision Aerospace Ltd",
      desc: "Buyer requested a custom quote for CNC Turning & AI Integration services (500 units).",
      time: "10 mins ago",
      type: "inquiry",
      read: false,
    },
    {
      id: "notif-2",
      title: "GSTN Registration Verification Confirmed",
      desc: "Your company GSTIN 29ABCDE1234F1Z5 was successfully validated with the national portal.",
      time: "2 hours ago",
      type: "security",
      read: false,
    },
    {
      id: "notif-3",
      title: "New Login from Windows PC",
      desc: "Authorized session established from IP 103.21.244.12 in Bengaluru.",
      time: "Today, 01:15 PM",
      type: "security",
      read: true,
    },
    {
      id: "notif-4",
      title: "Taxonomy Update: Technology & AI Sector",
      desc: "3 new subcategories added to Enterprise Software. Your catalog was auto-indexed.",
      time: "Yesterday",
      type: "taxonomy",
      read: true,
    },
    {
      id: "notif-5",
      title: "Weekly Directory Impression Report",
      desc: "Your business profile was displayed in 1,248 buyer search queries this week (+24%).",
      time: "2 days ago",
      type: "system",
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.info("Notification center cleared.");
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications & Alert Center</h2>
          <p className="mt-1 text-sm text-slate-400">
            Real-time trade inquiries, security alerts, and system announcements.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
          >
            <CheckCheck className="h-3.5 w-3.5 text-cyan-400" /> Mark All Read
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: "all", label: "All Alerts" },
          { id: "inquiry", label: "Buyer RFQs & Leads" },
          { id: "security", label: "Security & Login" },
          { id: "system", label: "System Reports" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id as any)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filter === t.id
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm font-bold text-white">No notifications in this category</p>
            <p className="text-xs text-slate-500">You're all caught up!</p>
          </div>
        ) : (
          filtered.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                  !item.read
                    ? "border-cyan-500/30 bg-cyan-500/[0.04]"
                    : "border-white/5 bg-slate-900/60"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    item.type === "inquiry"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : item.type === "security"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-cyan-500/15 text-cyan-400"
                  }`}
                >
                  {item.type === "inquiry" ? (
                    <MessageSquare className="h-5 w-5" />
                  ) : item.type === "security" ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${!item.read ? "text-white" : "text-slate-300"}`}>
                      {item.title}
                    </p>
                    <span className="text-[11px] text-slate-500 shrink-0">{item.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                </div>

                {!item.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 mt-2" title="Unread" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
