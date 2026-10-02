"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  Phone,
  Check,
  ArrowRight,
  RotateCw,
  ChevronLeft,
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

function OtpPanel({
  channel,
  masked,
  icon: Icon,
  value,
  onChange,
}: {
  channel: "email" | "phone";
  masked: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
}) {
  const complete = value.length === 6;
  const channelLabel = channel === "email" ? "Email-ID" : "Phone-no";
  const title = channel === "email" ? "Email verification" : "Phone verification";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 transition-colors sm:p-5",
        complete
          ? "border-green-500/50 bg-green-50 dark:bg-green-500/10"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg",
            complete
              ? "bg-green-500 text-white"
              : "bg-muted text-foreground"
          )}
        >
          <Lock className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold">{title}</p>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        A text message with a verification code was just sent to {channelLabel}:
      </p>
      <p className="text-sm font-bold tracking-wide">{masked}</p>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit code"
          className={cn(
            "h-11 w-full rounded-xl border bg-background pl-10 pr-12 text-center text-lg font-semibold tracking-[0.35em] outline-none transition-colors focus:ring-2",
            complete
              ? "border-green-500 text-green-700 focus:ring-green-500/20 dark:text-green-300"
              : "border-border focus:border-primary/40 focus:ring-primary/15"
          )}
        />
        {complete && (
          <span className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-green-500 text-white shadow-soft">
            <Check className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">
          Change your {channelLabel}{" "}
          <button
            type="button"
            className="font-semibold text-foreground hover:underline"
          >
            Click Here
          </button>
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
        >
          <RotateCw className="h-3 w-3" /> Resend
        </button>
      </div>
    </div>
  );
}

export default function RegisterVerifyPage() {
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const bothComplete = emailCode.length === 6 && phoneCode.length === 6;

  function handleVerify() {
    if (!bothComplete) return;
    // Mock — accept any 6-digit code.
    window.location.href = "/register/success";
  }

  return (
    <RegistrationLayout>
      <div className="space-y-5">
        <Stepper current={3} />

        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Verify your account
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent verification codes to your registered email and phone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OtpPanel
            channel="email"
            masked="w••••s@webuos.com"
            icon={Mail}
            value={emailCode}
            onChange={setEmailCode}
          />
          <OtpPanel
            channel="phone"
            masked="+91 9•••• 4310"
            icon={Phone}
            value={phoneCode}
            onChange={setPhoneCode}
          />
        </div>

        <div className="space-y-3 pt-1">
          <Button
            onClick={handleVerify}
            disabled={!bothComplete}
            className="w-full"
            size="lg"
          >
            Verify &amp; continue <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link
              href="/register/details"
              className="inline-flex items-center gap-1 font-medium hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <span>Didn&rsquo;t get the code? Check spam or resend.</span>
          </div>
        </div>
      </div>
    </RegistrationLayout>
  );
}
