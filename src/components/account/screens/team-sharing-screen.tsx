"use client";

import { useState } from "react";
import { Users, UserPlus, Mail, Shield, Trash2, CheckCircle2, MoreVertical, Crown } from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Manager" | "Editor" | "Viewer";
  avatar: string;
  status: "active" | "invited";
}

export function TeamSharingScreen() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "mem-1",
      name: "Harshadeep Reddy",
      email: "webuostech@gmail.com",
      role: "Owner",
      avatar: "HR",
      status: "active",
    },
    {
      id: "mem-2",
      name: "Priya Sharma",
      email: "priya.sharma@webuos.com",
      role: "Admin",
      avatar: "PS",
      status: "active",
    },
    {
      id: "mem-3",
      name: "Rahul Verma",
      email: "rahul.verma@webuos.com",
      role: "Manager",
      avatar: "RV",
      status: "active",
    },
    {
      id: "mem-4",
      name: "Anita Desai",
      email: "anita.desai@webuos.com",
      role: "Editor",
      avatar: "AD",
      status: "invited",
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Manager" | "Editor" | "Viewer">("Manager");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
      status: "invited",
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success(`Invitation sent to ${inviteEmail} with ${inviteRole} role!`);
  };

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    toast.info("Team member removed.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">People & Team Collaboration</h2>
          <p className="mt-1 text-sm text-slate-400">
            Invite coworkers and delegate management of RFQs, product catalogs, and buyer inquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <UserPlus className="h-4 w-4" /> Invite Colleague
        </button>
      </div>

      {/* Invite Modal / Box */}
      {showInviteModal && (
        <section className="rounded-3xl border border-cyan-500/30 bg-cyan-500/[0.05] p-6 backdrop-blur-sm sm:p-8">
          <h3 className="text-base font-bold text-white">Invite New Team Member</h3>
          <p className="text-xs text-slate-400">They will receive an email invitation to access your WEBUOS business dashboard.</p>

          <form onSubmit={handleInvite} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Colleague's corporate email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="h-11 rounded-xl border border-white/10 bg-slate-950/80 px-4 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Manager">Manager (RFQs & Catalog)</option>
              <option value="Editor">Editor (Catalog Only)</option>
              <option value="Viewer">Viewer (Read Only)</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Send Invite
              </button>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Members List */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Active Organization Members</h3>
              <p className="text-xs text-slate-400">{members.length} seats assigned</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {members.map((mem) => {
            const isOwner = mem.role === "Owner";
            return (
              <div
                key={mem.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-4 transition-all hover:border-white/15"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-sm font-bold text-cyan-400">
                    {mem.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{mem.name}</p>
                      {isOwner && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          <Crown className="h-3 w-3" /> Account Owner
                        </span>
                      )}
                      {mem.status === "invited" && (
                        <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                          Invite Sent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{mem.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                    {mem.role}
                  </span>

                  {!isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemove(mem.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Permissions Matrix */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Role Permissions Guide</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-white/10 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-2.5">Feature</th>
                <th className="py-2.5">Owner</th>
                <th className="py-2.5">Admin</th>
                <th className="py-2.5">Manager</th>
                <th className="py-2.5">Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { feat: "Edit Company Profile & Branding", owner: true, admin: true, mgr: true, edit: false },
                { feat: "Manage Product Catalog & Pricing", owner: true, admin: true, mgr: true, edit: true },
                { feat: "View & Respond to Buyer RFQs", owner: true, admin: true, mgr: true, edit: false },
                { feat: "Upload Legal & Compliance Docs", owner: true, admin: true, mgr: false, edit: false },
                { feat: "Manage Team Members & Billing", owner: true, admin: true, mgr: false, edit: false },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-3 font-medium text-white">{row.feat}</td>
                  <td className="py-3 text-cyan-400">Full</td>
                  <td className="py-3 text-cyan-400">Full</td>
                  <td className="py-3 text-slate-300">{row.mgr ? "Yes" : "—"}</td>
                  <td className="py-3 text-slate-300">{row.edit ? "Yes" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
