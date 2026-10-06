"use client";

import { useState } from "react";
import { Network, Layers, Sparkles, Check, ArrowRight, Tag, Save, Globe } from "lucide-react";
import { ecosystems } from "@/data/taxonomy";
import { toast } from "sonner";

export function IndustryHierarchyScreen() {
  const [selectedEcosystem, setSelectedEcosystem] = useState(ecosystems[1].id); // tech-ai
  const [selectedSector, setSelectedSector] = useState("enterprise-software");
  const [selectedCategory, setSelectedCategory] = useState("erp-supply-chain");
  const [capabilities, setCapabilities] = useState([
    "Cloud ERP Integration",
    "Generative AI Agent Automation",
    "Industrial IoT Telemetry",
    "Smart Factory Edge Computing",
    "Supply Chain Predictive Analytics",
  ]);
  const [newCap, setNewCap] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const currentEco = ecosystems.find((e) => e.id === selectedEcosystem) ?? ecosystems[0];

  const handleAddCapability = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newCap.trim()) {
      e.preventDefault();
      if (!capabilities.includes(newCap.trim())) {
        setCapabilities([...capabilities, newCap.trim()]);
        setNewCap("");
        toast.success(`Added capability: "${newCap.trim()}"`);
      }
    }
  };

  const handleRemoveCapability = (tag: string) => {
    setCapabilities(capabilities.filter((c) => c !== tag));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Industry hierarchy and capabilities mapped successfully!");
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Industry Hierarchy & Taxonomy</h2>
        <p className="mt-1 text-sm text-slate-400">
          Position your business across WEBUOS's 3 core ecosystems, sectors, and product categories for high-relevance search discovery.
        </p>
      </div>

      {/* Tier 1: Ecosystem Selection */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Tier 1: Core Ecosystem</h3>
        <p className="text-xs text-slate-400">Choose the primary economic ecosystem your company operates within.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ecosystems.map((eco) => {
            const isSelected = selectedEcosystem === eco.id;
            return (
              <div
                key={eco.id}
                onClick={() => {
                  setSelectedEcosystem(eco.id);
                  setSelectedSector(eco.categories[0]?.id ?? "");
                  setSelectedCategory(eco.categories[0]?.categories[0]?.id ?? "");
                }}
                className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/15 ring-2 ring-cyan-500/30"
                    : "border-white/10 bg-slate-950/40 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Ecosystem
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-base font-bold text-white">{eco.name}</h4>
                  <p className="mt-1 text-xs text-slate-400">{eco.tagline}</p>
                </div>
                <div className="mt-4 border-t border-white/5 pt-3 text-[11px] text-slate-500">
                  {eco.sectorsCount} Sectors · {eco.categoriesCount} Categories
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tier 2 & 3: Sector & Category */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Tier 2 & 3: Industry Sector & Sub-Category</h3>
        <p className="text-xs text-slate-400">Narrow down your specific industrial domain for precision buyer matching.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Sector Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Select Sector ({currentEco.categories.length} available)</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {currentEco.categories.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSector(sec.id);
                    setSelectedCategory(sec.categories[0]?.id ?? "");
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                    selectedSector === sec.id
                      ? "border-cyan-500/50 bg-cyan-500/10 font-bold text-white"
                      : "border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/10 hover:text-slate-200"
                  }`}
                >
                  <span>{sec.name}</span>
                  {selectedSector === sec.id && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Select Primary Category</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(
                currentEco.categories.find((s) => s.id === selectedSector)?.categories ??
                currentEco.categories[0]?.categories ??
                []
              ).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                    selectedCategory === cat.id
                      ? "border-cyan-500/50 bg-cyan-500/10 font-bold text-white"
                      : "border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/10 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <p>{cat.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{cat.products.length} Products & Services</p>
                  </div>
                  {selectedCategory === cat.id && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities & Specialties Tags */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <h3 className="text-base font-bold text-white">Supply Capabilities & Specializations</h3>
        <p className="text-xs text-slate-400">Add keywords representing your manufacturing, technical, or service specialties.</p>

        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {capabilities.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveCapability(tag)}
                  className="ml-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCap}
              onChange={(e) => setNewCap(e.target.value)}
              onKeyDown={handleAddCapability}
              placeholder="Type a capability and press Enter (e.g. CNC Turning, Python AI Agent, SAP Migration)..."
              className="h-11 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (newCap.trim() && !capabilities.includes(newCap.trim())) {
                  setCapabilities([...capabilities, newCap.trim()]);
                  setNewCap("");
                  toast.success("Capability added.");
                }
              }}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
        >
          {isSaving ? "Saving hierarchy..." : "Save Industry Mapping"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
