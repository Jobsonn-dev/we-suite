"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight, Sparkles, Factory, Cpu, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemCard {
  number: string;
  title: string;
  subtitle: string;
  icon: typeof Factory;
  numberColor: string;
  iconBg: string;
  iconText: string;
  border: string;
  href: string;
}

const ecosystemCards: EcosystemCard[] = [
  {
    number: "01",
    title: "Industrial",
    subtitle: "Build • Produce • Operate",
    icon: Factory,
    numberColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-400",
    border: "border-amber-500/30 hover:border-amber-500/60",
    href: "/business-taxonomy/industrial",
  },
  {
    number: "02",
    title: "Technology & AI",
    subtitle: "Digital • Data • Intelligence",
    icon: Cpu,
    numberColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
    iconText: "text-blue-400",
    border: "border-blue-500/30 hover:border-blue-500/60",
    href: "/business-taxonomy/technology-ai",
  },
  {
    number: "03",
    title: "Business Services",
    subtitle: "People • Capital • Services",
    icon: ShoppingBag,
    numberColor: "text-purple-400",
    iconBg: "bg-purple-500/15",
    iconText: "text-purple-400",
    border: "border-purple-500/30 hover:border-purple-500/60",
    href: "/business-taxonomy/business-services",
  },
];

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  function handleContinue() {
    // Route to Profile Account page
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (phone) params.set("phone", phone);
    window.location.href = `/account${params.toString() ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0e1a] text-white">
      {/* Background gradient + glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]" />

      {/* Top brand bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-400 hover:text-white">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400">
            <Sparkles className="h-4 w-4" />
          </span>
          WEBUOS
        </Link>
        <Link href="/" className="text-xs text-slate-500 hover:text-white">
          Back to home
        </Link>
      </header>

      {/* Centered content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pb-20 pt-6 sm:pt-12">
        <div
          className={cn(
            "w-full max-w-4xl text-center transition-all duration-700",
            show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {/* Success icon */}
          <div className="relative mb-8 inline-flex">
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-500/30" />
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Account created successfully
          </h1>
          <p className="mb-10 text-base text-slate-400 sm:text-lg">
            Welcome to WEBUOS. Your account is ready.
          </p>

          {/* Ecosystem section header */}
          <div className="mb-7 flex items-center justify-center gap-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 sm:text-sm">
              Explore the Three Ecosystems
            </span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>

          {/* Ecosystem cards */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {ecosystemCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.number}
                  href={card.href}
                  className={cn(
                    "group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border bg-white/[0.03] p-6 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]",
                    card.border,
                  )}
                  style={{ animation: `cardFadeIn 0.6s ease-out ${idx * 120}ms both` }}
                >
                  <span className={cn("absolute right-5 top-5 text-sm font-bold", card.numberColor)}>
                    {card.number}
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      card.iconBg,
                      card.iconText,
                    )}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{card.title}</h3>
                    <p className="text-xs text-slate-400 sm:text-sm">{card.subtitle}</p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors group-hover:text-white">
                    Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Continue button */}
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-semibold text-[#0a0e1a] shadow-lg transition-all duration-200 hover:bg-slate-100 hover:shadow-xl active:translate-y-px"
          >
            Continue to WEBUOS
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Footer note */}
          <p className="mt-6 text-xs text-slate-500">
            Your communication details (email &amp; phone) are verified. You&apos;ll complete business verification next.
          </p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
