"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Mail, Phone, RefreshCw, Check, ShieldCheck,
  MailCheck, PhoneCall, Info,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ecosystems } from "@/data/taxonomy";
import { getColor, accentText } from "@/lib/colors";
import { DynamicIcon } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get("email") ?? "";
  const rawPhone = searchParams.get("phone") ?? "";

  // Mask email: w...s@webuos.com
  const maskedEmail = maskEmail(rawEmail || "user@webuos.com");
  // Mask phone: +91 9...4310
  const maskedPhone = maskPhone(rawPhone || "+91 98765 43210");

  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const emailRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer — uses interval, no setState in effect body
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (!domain) return email;
    if (name.length <= 2) return `${name[0]}...@${domain}`;
    return `${name[0]}...${name[name.length - 1]}@${domain}`;
  }

  function maskPhone(phone: string): string {
    if (phone.length <= 4) return phone;
    const start = phone.slice(0, phone.length - 4);
    const end = phone.slice(-4);
    return `${start.slice(0, 4)}....${end}`;
  }

  function handleOtpChange(
    index: number,
    value: string,
    type: "email" | "phone"
  ) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const setOtp = type === "email" ? setEmailOtp : setPhoneOtp;
    const otp = type === "email" ? [...emailOtp] : [...phoneOtp];
    const refs = type === "email" ? emailRefs : phoneRefs;

    otp[index] = digit;
    setOtp(otp);

    // Auto-advance
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }

    // Check if complete
    if (otp.every((d) => d !== "") && otp.join("").length === 6) {
      if (type === "email") setEmailVerified(true);
      else setPhoneVerified(true);
    }
  }

  function handleOtpKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: "email" | "phone"
  ) {
    const refs = type === "email" ? emailRefs : phoneRefs;
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(
    e: React.ClipboardEvent<HTMLInputElement>,
    type: "email" | "phone"
  ) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const setOtp = type === "email" ? setEmailOtp : setPhoneOtp;
    const refs = type === "email" ? emailRefs : phoneRefs;
    const otp = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      otp[i] = pasted[i];
    }
    setOtp(otp);
    if (pasted.length === 6) {
      if (type === "email") setEmailVerified(true);
      else setPhoneVerified(true);
    }
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleResend() {
    setResendTimer(30);
    setCanResend(false);
    setEmailOtp(["", "", "", "", "", ""]);
    setPhoneOtp(["", "", "", "", "", ""]);
    setEmailVerified(false);
    setPhoneVerified(false);
  }

  function handleVerify() {
    // Route to success page after OTP verification
    const params = new URLSearchParams();
    if (rawEmail) params.set("email", rawEmail);
    if (rawPhone) params.set("phone", rawPhone);
    window.location.href = `/register/success${params.toString() ? `?${params.toString()}` : ""}`;
  }

  const bothVerified = emailVerified && phoneVerified;

  return (
    <PageShell>
      <div className="flex min-h-[calc(100vh-60px)] flex-col lg:flex-row">
        {/* Left brand panel — always dark */}
        <aside className="relative hidden overflow-hidden bg-[#0a0e1a] lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

          {/* Back to Sign In */}
          <div className="relative z-10">
            <Link
              href="/login"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 transition-all duration-200 hover:border-cyan-500/30 hover:bg-white/[0.06]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-500/15 group-hover:text-cyan-400">
                <ArrowLeft className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Return</p>
                <p className="text-sm font-bold text-white">Back to Sign In</p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Progress stepper */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5">
                <Check className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Account</span>
              </div>
              <div className="h-px w-4 bg-white/20" />
              <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5">
                <Check className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Details</span>
              </div>
              <div className="h-px w-4 bg-white/20" />
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-900" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Verify</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Verify your account.
            </h1>
            <p className="max-w-md text-base text-slate-400">
              We sent verification codes to your registered email and phone. Enter the 6-digit codes below to activate your WEBUOS account and start discovering businesses worldwide.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ecosystems.map((seg) => {
                const color = getColor(seg.categories[0]?.color ?? "blue");
                return (
                  <Link key={seg.id} href={`/business-taxonomy/${seg.id}`} className={cn("group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md transition-all hover:bg-white/[0.07]", color.border)}>
                    <span className={cn("absolute left-0 top-0 h-full w-1 transition-all group-hover:w-1.5", color.dot)} />
                    <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110", color.iconBg, color.iconText)}>
                      <DynamicIcon name={seg.icon} className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", accentText(seg.accent))}>{seg.number}</p>
                      <p className="text-xs font-semibold leading-tight text-white sm:text-[13px]">{seg.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} WEBUOS. Global Business Discovery Platform.
          </div>
        </aside>

        {/* Right verify panel — top-aligned, full width */}
        <main className="flex flex-1 flex-col bg-background px-4 pt-8 sm:px-8 lg:px-12 lg:pt-12">
          <div className="w-full">
            {/* Mobile back link */}
            <Link href="/register" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden">
              <ArrowLeft className="h-4 w-4" /> Back to Registration
            </Link>

            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Verify your account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent verification codes to your registered email and phone.
              </p>
            </div>

            {/* Verification cards */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Email verification card */}
              <div className={cn(
                "rounded-2xl border p-5 transition-all duration-300",
                emailVerified
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border bg-muted/20"
              )}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      emailVerified ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                    )}>
                      {emailVerified ? <Check className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Email verification</h3>
                      <p className="text-xs text-muted-foreground">Code sent to {maskedEmail}</p>
                    </div>
                  </div>
                  {emailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>

                {/* OTP inputs */}
                <div className="flex gap-2" onPaste={(e) => handleOtpPaste(e, "email")}>
                  {emailOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { emailRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value, "email")}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx, "email")}
                      disabled={emailVerified}
                      className={cn(
                        "h-12 w-full rounded-lg border text-center text-lg font-bold transition-all focus:outline-none focus:ring-2",
                        emailVerified
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
                          : "border-border bg-background text-foreground focus:border-primary/40 focus:ring-primary/15"
                      )}
                    />
                  ))}
                </div>

                {/* Change email link */}
                <div className="mt-3 flex items-center justify-between">
                  <Link href="/register" className="text-xs font-medium text-primary hover:underline">
                    Change email
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
                      canResend ? "text-primary hover:underline" : "text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <RefreshCw className={cn("h-3 w-3", !canResend && "animate-spin")} />
                    {canResend ? "Resend code" : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </div>

              {/* Phone verification card */}
              <div className={cn(
                "rounded-2xl border p-5 transition-all duration-300",
                phoneVerified
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border bg-muted/20"
              )}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      phoneVerified ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                    )}>
                      {phoneVerified ? <Check className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Phone verification</h3>
                      <p className="text-xs text-muted-foreground">Code sent to {maskedPhone}</p>
                    </div>
                  </div>
                  {phoneVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>

                {/* OTP inputs */}
                <div className="flex gap-2" onPaste={(e) => handleOtpPaste(e, "phone")}>
                  {phoneOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { phoneRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value, "phone")}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx, "phone")}
                      disabled={phoneVerified}
                      className={cn(
                        "h-12 w-full rounded-lg border text-center text-lg font-bold transition-all focus:outline-none focus:ring-2",
                        phoneVerified
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
                          : "border-border bg-background text-foreground focus:border-primary/40 focus:ring-primary/15"
                      )}
                    />
                  ))}
                </div>

                {/* Change phone link */}
                <div className="mt-3 flex items-center justify-between">
                  <Link href="/register" className="text-xs font-medium text-primary hover:underline">
                    Change phone
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
                      canResend ? "text-primary hover:underline" : "text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <RefreshCw className={cn("h-3 w-3", !canResend && "animate-spin")} />
                    {canResend ? "Resend code" : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </div>
            </div>

            {/* Info alert */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <p className="text-xs text-muted-foreground">
                Check your spam folder if you don't see the email. SMS may take up to 30 seconds to arrive.
              </p>
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={!bothVerified}
              className={cn(
                "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                bothVerified
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {bothVerified ? (
                <>
                  Verify &amp; continue
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "Enter both codes to continue"
              )}
            </button>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Back link */}
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link href="/register" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to registration
              </Link>
            </p>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
