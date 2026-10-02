"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Store,
  ShoppingCart,
  ArrowLeftRight,
  ArrowRight,
  Check,
} from "lucide-react";
import { RegistrationLayout } from "@/components/registration/registration-layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { n: 1, label: "ACCOUNT" },
  { n: 2, label: "DETAILS" },
  { n: 3, label: "VERIFY" },
];

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-bold tracking-[0.12em] transition-colors sm:px-3 sm:text-[11px]",
                done
                  ? "border-amber-400/50 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                  : active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted/50 text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  done
                    ? "bg-amber-500 text-white"
                    : active
                      ? "bg-white/20 text-white"
                      : "bg-muted-foreground/15 text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3 w-3" /> : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-5 sm:w-8",
                  current > s.n ? "bg-amber-400/60" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const accountTypes = [
  {
    id: "employee",
    title: "Employee / Employer",
    desc: "For individuals and people-centric roles.",
    icon: User,
    label: "PEOPLE • ROLES",
  },
  {
    id: "business",
    title: "Business",
    desc: "For companies, brands and commerce.",
    icon: Building2,
    label: "COMPANY • COMMERCE",
  },
];

const intents = [
  {
    id: "sell",
    title: "We / I am going to Sell",
    desc: "List products and services to buyers worldwide.",
    icon: Store,
  },
  {
    id: "buy",
    title: "We / I am going to Buy",
    desc: "Discover suppliers and partners for your needs.",
    icon: ShoppingCart,
  },
  {
    id: "both",
    title: "We do both Buy & Sell",
    desc: "Trade on both sides of the marketplace.",
    icon: ArrowLeftRight,
  },
];

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<string | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const ready = Boolean(accountType && intent);

  function handleContinue() {
    if (!ready) return;
    window.location.href = "/register/details";
  }

  return (
    <RegistrationLayout>
      <div className="space-y-6">
        <Stepper current={1} />

        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create your WEBUOS account
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your account type to get started.
          </p>
        </div>

        {/* Account type cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {accountTypes.map((opt) => {
            const selected = accountType === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAccountType(opt.id)}
                className={cn(
                  "group relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all",
                  selected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/15 dark:bg-blue-500/10"
                    : "border-border bg-card hover:border-blue-300 hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      selected
                        ? "bg-blue-500 text-white"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {selected && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground">
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold leading-tight">
                    {opt.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* What will you do on WEBUOS? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              What will you do on WEBUOS?
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {intents.map((opt) => {
              const selected = intent === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntent(opt.id)}
                  className={cn(
                    "group relative flex flex-col gap-2 rounded-xl border p-3 text-left transition-all",
                    selected
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/15 dark:bg-amber-500/10"
                      : "border-border bg-card hover:border-amber-300 hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                        selected
                          ? "bg-amber-500 text-white"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {selected && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-tight">
                    {opt.title}
                  </p>
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!ready}
            className="w-full"
            size="lg"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </RegistrationLayout>
  );
}
