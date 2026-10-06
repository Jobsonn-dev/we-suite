"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Smartphone, KeyRound, Laptop, LogOut, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function SecurityScreen() {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "Windows 11 PC (Chrome 134)",
      location: "Bengaluru, India",
      ip: "103.21.244.12",
      active: true,
      lastSeen: "Active now",
    },
    {
      id: "sess-2",
      device: "Apple iPhone 15 Pro (Safari Mobile)",
      location: "Bengaluru, India",
      ip: "103.21.244.18",
      active: false,
      lastSeen: "2 hours ago",
    },
    {
      id: "sess-3",
      device: "MacBook Pro M3 (Chrome)",
      location: "Mumbai, India",
      ip: "49.207.210.55",
      active: false,
      lastSeen: "3 days ago",
    },
  ]);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Account password changed successfully!");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success("Session revoked and logged out.");
  };

  const handleRevokeAll = () => {
    setSessions(sessions.filter((s) => s.active));
    toast.success("All other active sessions have been logged out.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Security & Sign-in</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your login credentials, two-factor authentication, and monitor active sessions protecting your business data.
        </p>
      </div>

      {/* Security Score Overview */}
      <section className="flex flex-col gap-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 shadow-md">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Security Health: 94/100</h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Excellent
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Two-factor authentication is active · Strong password set · 0 suspicious attempts
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Security audit check passed with zero issues.")}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/15"
        >
          Run Security Audit
        </button>
      </section>

      {/* Two-Factor Authentication */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Smartphone className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-slate-400">Require an authenticator code or SMS OTP when signing in from a new browser.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              toast.success(
                twoFactorEnabled
                  ? "2FA disabled (not recommended)"
                  : "2FA enabled with Authenticator App"
              );
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              twoFactorEnabled ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                twoFactorEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Change Password Form */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">Change Password</h3>
            <p className="text-xs text-slate-400">Ensure your password contains at least 8 characters with numbers and symbols.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter current password..."
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 pr-10 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">New Password</label>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new strong password..."
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 pr-10 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm new password..."
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Update Password
          </button>
        </form>
      </section>

      {/* Active Sessions */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300">
              <Laptop className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Active Signed-in Devices</h3>
              <p className="text-xs text-slate-400">Devices currently authenticated with your WEBUOS profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRevokeAll}
            className="text-xs font-semibold text-rose-400 hover:underline"
          >
            Sign out other sessions
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Laptop className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{sess.device}</p>
                    {sess.active && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                        This Device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {sess.location} · IP: {sess.ip} · {sess.lastSeen}
                  </p>
                </div>
              </div>

              {!sess.active && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(sess.id)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
