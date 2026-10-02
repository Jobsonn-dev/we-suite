"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { RegistrationLayout } from "@/components/registration/registration-layout";
import { Button } from "@/components/ui/button";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function RegisterSuccessPage() {
  function handleContinue() {
    window.location.href = "/dashboard";
  }

  return (
    <RegistrationLayout>
      <div className="space-y-7 text-center">
        {/* Animated green checkmark */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
          <span className="absolute inset-1 rounded-full bg-green-500/20" />
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-soft-lg">
            <Check className="h-8 w-8" strokeWidth={3} />
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Account created successfully
          </h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Welcome to WEBUOS. Your account is ready.
          </p>
        </div>

        {/* Three ecosystem mini-cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Explore the three ecosystems
            </span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {ecosystems.map((eco) => {
              const color = getColor(eco.categories[0]?.color ?? "blue");
              return (
                <Link
                  key={eco.id}
                  href={`/business-taxonomy/${eco.id}`}
                  className={cn(
                    "group flex flex-col gap-2 rounded-xl border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft",
                    color.border
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                        color.iconBg,
                        color.iconText
                      )}
                    >
                      <DynamicIcon name={eco.icon} className="h-4 w-4" />
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold tracking-wider",
                        accentText(eco.accent)
                      )}
                    >
                      {eco.number}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight">
                      {eco.shortName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {eco.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            className="w-full"
            size="lg"
          >
            Continue to WEBUOS <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Need help getting started? Visit the{" "}
            <Link
              href="/business-taxonomy"
              className="font-semibold text-foreground hover:underline"
            >
              taxonomy explorer
            </Link>
            .
          </p>
        </div>
      </div>
    </RegistrationLayout>
  );
}
