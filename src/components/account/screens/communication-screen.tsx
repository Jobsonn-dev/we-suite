"use client";

import { useState } from "react";
import { Mail, Phone, MessageSquare, Check, ShieldCheck, Plus, Bell, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CommunicationScreenProps {
  email: string;
  phone: string;
}

export function CommunicationScreen({ email, phone }: CommunicationScreenProps) {
  const [backupEmail, setBackupEmail] = useState("");
  const [isAddingBackup, setIsAddingBackup] = useState(false);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsInquiries, setSmsInquiries] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [marketTrends, setMarketTrends] = useState(false);
  const [autoReply, setAutoReply] = useState(true);
  const [autoReplyText, setAutoReplyText] = useState(
    "Thank you for contacting WEBUOS Tech. Our team will review your inquiry and respond within 2 business hours."
  );

  const handleSaveNotifications = () => {
    toast.success("Communication & alert preferences updated!");
  };

  const handleAddBackupEmail = () => {
    if (!backupEmail) {
      toast.error("Please enter a valid backup email address.");
      return;
    }
    toast.success(`Verification link sent to ${backupEmail}`);
    setIsAddingBackup(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Communication & Channels</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your verified channels for two-factor authentication, RFQ notifications, and business buyer inquiries.
        </p>
      </div>

      {/* Verified Channels */}
      <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Verified Primary Channels</h3>
              <p className="text-xs text-slate-400">Used for signing in and securing your WEBUOS account</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            2/2 Active
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Email */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Primary Email</p>
                  <p className="text-sm font-bold text-white">{email}</p>
                  <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> OTP Verified at Registration
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Email change verification code initiated.")}
                className="text-xs font-semibold text-cyan-400 hover:underline"
              >
                Change
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Primary Mobile Number</p>
                  <p className="text-sm font-bold text-white">{phone}</p>
                  <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> OTP Verified at Registration
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Phone change verification code initiated.")}
                className="text-xs font-semibold text-cyan-400 hover:underline"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Secondary / Backup email */}
        <div className="mt-5 border-t border-white/10 pt-5">
          {!isAddingBackup ? (
            <button
              type="button"
              onClick={() => setIsAddingBackup(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              <Plus className="h-4 w-4" /> Add backup email for emergency recovery
            </button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Enter recovery email address..."
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddBackupEmail}
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Send Verification
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingBackup(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Notification Dispatch Preferences */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Inquiry & Alert Preferences</h3>
        <p className="text-xs text-slate-400">Choose how you want to be notified when buyers submit RFQs or contact you.</p>

        <div className="mt-6 space-y-4">
          {[
            {
              id: "wa",
              title: "Instant WhatsApp Inquiries",
              desc: "Receive real-time lead alerts & buyer RFQ messages directly on WhatsApp",
              state: whatsappAlerts,
              setState: setWhatsappAlerts,
            },
            {
              id: "sms",
              title: "SMS Urgent Alerts",
              desc: "Get critical system notifications and urgent trade alerts via SMS",
              state: smsInquiries,
              setState: setSmsInquiries,
            },
            {
              id: "digest",
              title: "Daily Trade & Inquiry Digest",
              desc: "Summary email every morning with all profile views and new product inquiries",
              state: emailDigest,
              setState: setEmailDigest,
            },
            {
              id: "trends",
              title: "WEBUOS Ecosystem Trend Reports",
              desc: "Weekly industrial demand analytics and price trend intelligence reports",
              state: marketTrends,
              setState: setMarketTrends,
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 p-4 transition-all hover:border-white/10"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => item.setState(!item.state)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.state ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.state ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Auto-Responder for Buyer Inquiries */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Automated Inquiry Response</h3>
            <p className="text-xs text-slate-400">Instantly send an acknowledgment message when buyers request quotes</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoReply(!autoReply)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              autoReply ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                autoReply ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {autoReply && (
          <div className="mt-5 space-y-2">
            <textarea
              rows={3}
              value={autoReplyText}
              onChange={(e) => setAutoReplyText(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 p-4 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">Variables available: [Buyer Name], [Inquiry Product], [Estimated Time]</p>
          </div>
        )}
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveNotifications}
          className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          Save Communication Settings
        </button>
      </div>
    </div>
  );
}
