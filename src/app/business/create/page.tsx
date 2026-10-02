"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Search, ChevronRight, Home, CheckCircle2, Building2 } from "lucide-react";
import { RegistrationLayout } from "@/components/registration/registration-layout";
import { ecosystems, getEcosystem, getCoreSector } from "@/data/taxonomy";
import { getColor } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const countries = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore", "Germany", "Australia", "Canada", "Japan"];
const businessTypes = ["Private Limited", "Public Limited", "LLP / Partnership", "Proprietorship", "Government / PSU", "Non-Profit / NGO"];

export default function BusinessCreatePage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [ecoId, setEcoId] = useState<string | null>(null);
  const [sectorId, setSectorId] = useState<string | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [ecoSearch, setEcoSearch] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  // Business details
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);

  const eco = ecoId ? getEcosystem(ecoId) : null;
  const sectorResult = ecoId && sectorId ? getCoreSector(ecoId, sectorId) : null;
  const sector = sectorResult?.sector;
  const category = sector?.categories.find(c => c.id === catId);

  const canProceed = ecoId && sectorId && catId;

  function next() {
    if (step === 1 && !canProceed) {
      toast({ title: "Classification required", description: "Select an ecosystem, core sector, and category.", variant: "destructive" });
      return;
    }
    if (step === 2 && (!companyName || !businessType || !country || !city)) {
      toast({ title: "Required fields missing", description: "Company name, business type, country, and city are required.", variant: "destructive" });
      return;
    }
    if (step === 3) { setDone(true); return; }
    setStep(step + 1);
  }
  function prev() { if (step > 1) setStep(step - 1); }

  const steps = [
    { num: 1, label: "Classification" },
    { num: 2, label: "Details" },
    { num: 3, label: "Review" },
  ];

  if (done) {
    return (
      <RegistrationLayout>
        <div className="flex flex-col items-center py-4 text-center">
          <div className="relative mb-6 flex items-center justify-center">
            <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-green-400/20" />
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-soft-lg"><CheckCircle2 className="h-11 w-11" /></span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Business profile created successfully</h1>
          <p className="mt-3 max-w-md text-base text-muted-foreground">Welcome to WEBUOS, {companyName}. Your business is now classified in the taxonomy.</p>
          {eco && sector && category && (
            <div className="mt-6 w-full max-w-lg rounded-2xl border border-border bg-card p-5 text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">WEBUOS Business Classification</p>
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"><Building2 className="h-3.5 w-3.5" />{eco.shortName}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">{sector.name}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-1 font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">{category.name}</span>
              </div>
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">Go to Dashboard<ArrowRight className="h-4 w-4" /></Link>
            <Link href="/business-taxonomy" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted">View Taxonomy</Link>
          </div>
        </div>
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout>
      {/* Stepper */}
      <div className="mb-8">
        <div className="mx-auto w-full max-w-2xl">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Create Business</p>
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const isComplete = step > s.num;
              const isActive = step === s.num;
              const isLast = idx === steps.length - 1;
              return (
                <div key={s.num} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all", isComplete && "border-amber-400 bg-amber-400 text-white", isActive && "border-primary bg-primary text-primary-foreground shadow-md", !isComplete && !isActive && "border-border bg-background text-muted-foreground")}>
                      {isComplete ? <Check className="h-4 w-4" /> : s.num}
                    </div>
                    <span className={cn("text-[11px] font-semibold tracking-wider sm:text-xs", isActive ? "text-foreground" : isComplete ? "text-amber-600" : "text-muted-foreground")}>{s.label}</span>
                  </div>
                  {!isLast && <div className={cn("mx-2 mb-5 h-0.5 flex-1 rounded-full transition-colors sm:mx-3", step > s.num ? "bg-amber-400" : "bg-border")} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <nav className="mb-3 text-xs text-muted-foreground"><Link href="/" className="hover:text-foreground"><Home className="inline h-3 w-3" /> Home</Link> <ChevronRight className="inline h-3 w-3" /> <Link href="/business-taxonomy" className="hover:text-foreground">Taxonomy</Link> <ChevronRight className="inline h-3 w-3" /> <span className="font-medium text-foreground">Create Business</span></nav>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{step === 1 && "Business Classification"}{step === 2 && "Business Details"}{step === 3 && "Review & Submit"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{step === 1 && "Select your ecosystem, core sector, and category. This is mandatory."}{step === 2 && "Enter your company information."}{step === 3 && "Review your business classification before creating."}</p>

      {/* Step 1: Classification */}
      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">Business Ecosystem <span className="text-destructive">*</span></label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ecosystems.filter(e => e.name.toLowerCase().includes(ecoSearch.toLowerCase()) || ecoSearch === "").map(e => {
                const isSelected = ecoId === e.id;
                const c = getColor(e.categories[0]?.color ?? "blue");
                return (
                  <button key={e.id} type="button" onClick={() => { setEcoId(e.id); setSectorId(null); setCatId(null); }} className={cn("flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all", isSelected ? cn(c.border, "bg-primary/[0.03] shadow-soft") : "border-border hover:border-primary/30 hover:shadow-soft")}>
                    <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", c.iconBg, c.iconText)}><DynamicIcon name={e.icon} className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1"><p className={cn("text-[10px] font-bold uppercase", c.text)}>{e.number}</p><p className="text-sm font-bold">{e.shortName}</p><p className="text-[11px] text-muted-foreground">{e.categories.length} core sectors</p></div>
                    {isSelected && <Check className={cn("h-4 w-4 shrink-0", c.text)} />}
                  </button>
                );
              })}
            </div>
          </div>

          {eco && (
            <div>
              <label className="mb-2 block text-sm font-semibold">Business Core Sector <span className="text-destructive">*</span></label>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={sectorSearch} onChange={e => setSectorSearch(e.target.value)} placeholder="Search core sectors..." className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" />
              </div>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background p-2 scrollbar-thin">
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {eco.categories.filter(s => s.name.toLowerCase().includes(sectorSearch.toLowerCase())).map(s => {
                    const isSelected = sectorId === s.id;
                    const c = getColor(s.color);
                    return (
                      <button key={s.id} type="button" onClick={() => { setSectorId(s.id); setCatId(null); }} className={cn("flex items-center gap-3 rounded-lg p-2.5 text-left transition-colors", isSelected ? "bg-primary/10" : "hover:bg-muted")}>
                        <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md", c.iconBg, c.iconText)}><DynamicIcon name={s.icon} className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.categories.length} categories</p></div>
                        {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {sector && (
            <div>
              <label className="mb-2 block text-sm font-semibold">Business Category <span className="text-destructive">*</span></label>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="Search categories..." className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" />
              </div>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background p-2 scrollbar-thin">
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {sector.categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())).map(c => {
                    const isSelected = catId === c.id;
                    return (
                      <button key={c.id} type="button" onClick={() => setCatId(c.id)} className={cn("flex items-center gap-2 rounded-lg p-2.5 text-left transition-colors", isSelected ? "bg-primary/10" : "hover:bg-muted")}>
                        <span className="font-mono text-[10px] text-muted-foreground">{c.code}</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                        {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {canProceed && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Selected classification</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
                <span className="font-semibold">{eco?.shortName}</span><ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-semibold">{sector?.name}</span><ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-semibold">{category?.name}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-sm font-medium">Company Name <span className="text-destructive">*</span></label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Industries Pvt Ltd" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Business Type <span className="text-destructive">*</span></label><select value={businessType} onChange={e => setBusinessType(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"><option value="">Select type</option>{businessTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="mb-1.5 block text-sm font-medium">Country <span className="text-destructive">*</span></label><select value={country} onChange={e => setCountry(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"><option value="">Select country</option>{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="mb-1.5 block text-sm font-medium">City <span className="text-destructive">*</span></label><input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Website</label><input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" /></div>
          </div>
          <div><label className="mb-1.5 block text-sm font-medium">Business Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of your business..." rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15" /></div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Classification</h3>
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              <span className="font-semibold">{eco?.name}</span><ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-semibold">{sector?.name}</span><ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-semibold">{category?.name}</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{category?.code}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Business Details</h3>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Company</dt><dd className="mt-0.5 font-medium">{companyName || "—"}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</dt><dd className="mt-0.5 font-medium">{businessType || "—"}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Country</dt><dd className="mt-0.5 font-medium">{country || "—"}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">City</dt><dd className="mt-0.5 font-medium">{city || "—"}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Website</dt><dd className="mt-0.5 font-medium">{website || "—"}</dd></div>
            </dl>
            {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-amber-600" />By creating this business, it will be classified under the WEBUOS taxonomy shown above.
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={prev} disabled={step === 1} className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40"><ArrowLeft className="h-4 w-4" />Back</button>
        <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">{step === 3 ? "Create Business" : "Continue"}<ArrowRight className="h-4 w-4" /></button>
      </div>
    </RegistrationLayout>
  );
}
