"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Globe, Camera, Shield, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface PersonalInfoScreenProps {
  email: string;
  phone: string;
}

export function PersonalInfoScreen({ email: initialEmail, phone: initialPhone }: PersonalInfoScreenProps) {
  const [fullName, setFullName] = useState("Harshadeep Reddy");
  const [displayName, setDisplayName] = useState("Harsha");
  const [jobTitle, setJobTitle] = useState("Managing Director & Founder");
  const [email, setEmail] = useState(initialEmail || "webuostech@gmail.com");
  const [phone, setPhone] = useState(initialPhone || "+91 78295 23537");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [country, setCountry] = useState("India");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST +05:30)");
  const [language, setLanguage] = useState("English (US)");
  const [visibility, setVisibility] = useState<"public" | "network" | "private">("public");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Personal information updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Personal Information</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your personal identity, contact details, and account visibility preferences across WEBUOS.
        </p>
      </div>

      {/* Avatar Section */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Profile Photo & Identity</h3>
        <p className="text-xs text-slate-400">This will be displayed on your verified business profile card.</p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20 ring-4 ring-white/10">
              HR
            </div>
            <button
              type="button"
              onClick={() => toast.info("Photo upload selector opened.")}
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-md transition-all hover:bg-cyan-400"
              title="Upload new photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toast.success("Photo uploaded successfully!")}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/15"
              >
                Upload new image
              </button>
              <button
                type="button"
                onClick={() => toast.info("Photo reset to default avatar.")}
                className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-xs font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-white"
              >
                Remove photo
              </button>
            </div>
            <p className="text-[11px] text-slate-500">Supports JPG, PNG, WebP or SVG up to 5MB. Recommended resolution: 400x400px.</p>
          </div>
        </div>
      </section>

      {/* Basic Info Form */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Basic Profile Details</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Legal Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Display Name / Alias</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Job Title / Designation</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Gender</label>
            <select className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="nonbinary">Non-binary / Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Contact & Location</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address (Verified)</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                disabled
                className="h-11 w-full rounded-xl border border-emerald-500/30 bg-slate-950/40 pl-10 pr-24 text-sm text-slate-300 cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Phone Number (Verified)</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={phone}
                disabled
                className="h-11 w-full rounded-xl border border-emerald-500/30 bg-slate-950/40 pl-10 pr-24 text-sm text-slate-300 cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">City</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">State / Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Country</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
              <option value="America/New_York (EST -05:00)">America/New_York (EST -05:00)</option>
              <option value="Europe/London (GMT +00:00)">Europe/London (GMT +00:00)</option>
              <option value="Asia/Dubai (GST +04:00)">Asia/Dubai (GST +04:00)</option>
              <option value="Asia/Singapore (SGT +08:00)">Asia/Singapore (SGT +08:00)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Visibility Preferences */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Profile Visibility</h3>
        <p className="text-xs text-slate-400">Control who can discover and view your executive contact info.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "public", title: "Public", desc: "Visible to all buyers & visitors on WEBUOS directory" },
            { id: "network", title: "Verified Network Only", desc: "Only logged-in verified business accounts can view" },
            { id: "private", title: "Private / Hidden", desc: "Hidden from public search, only direct links work" },
          ].map((v) => (
            <div
              key={v.id}
              onClick={() => setVisibility(v.id as any)}
              className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all ${
                visibility === v.id
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-white/10 bg-slate-950/40 hover:border-white/20"
              }`}
            >
              <div>
                <p className="text-sm font-bold text-white">{v.title}</p>
                <p className="mt-1 text-xs text-slate-400">{v.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                {visibility === v.id && <Check className="h-3.5 w-3.5" />}
                {visibility === v.id ? "Selected" : "Click to select"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Save Button Bar */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
        >
          {isSaving ? "Saving changes..." : "Save Personal Info"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
