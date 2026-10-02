"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  User,
  Briefcase,
  Building2,
  ArrowRight,
  Check,
  Info,
  ChevronLeft,
} from "lucide-react";
import { RegistrationLayout } from "@/components/registration/registration-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const countries = [
  "United States",
  "United Kingdom",
  "India",
  "Germany",
  "Singapore",
  "United Arab Emirates",
  "Australia",
  "Canada",
  "Brazil",
  "Japan",
];

const industries = [
  "Industrial & Manufacturing",
  "Technology & AI",
  "Business Services",
  "Finance & Banking",
  "Healthcare & Life Sciences",
  "Retail & Consumer Goods",
  "Energy & Utilities",
  "Logistics & Supply Chain",
  "Media & Entertainment",
  "Construction & Real Estate",
];

const schema = z
  .object({
    accountType: z.enum(["employee", "business"]),
    fullName: z.string().optional(),
    professionalRole: z.string().optional(),
    companyName: z.string().optional(),
    industry: z.string().optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z
      .string()
      .min(7, "Enter a valid phone number")
      .max(20, "Phone number is too long"),
    country: z.string().min(1, "Select your country"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.accountType !== "employee" ||
      (data.fullName && data.fullName.trim().length >= 2),
    { message: "Enter your full name", path: ["fullName"] }
  )
  .refine(
    (data) =>
      data.accountType !== "employee" ||
      (data.professionalRole && data.professionalRole.trim().length >= 1),
    { message: "Enter your professional role", path: ["professionalRole"] }
  )
  .refine(
    (data) =>
      data.accountType !== "business" ||
      (data.companyName && data.companyName.trim().length >= 2),
    { message: "Enter your company name", path: ["companyName"] }
  )
  .refine(
    (data) =>
      data.accountType !== "business" ||
      (data.industry && data.industry.length >= 1),
    { message: "Select your industry", path: ["industry"] }
  );

type FormValues = z.infer<typeof schema>;

export default function RegisterDetailsPage() {
  const [accountType, setAccountType] = useState<"employee" | "business">(
    "business"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: "business",
      fullName: "",
      professionalRole: "",
      companyName: "",
      industry: "",
      email: "",
      phone: "",
      country: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const {
    register: rhfRegister,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const country = watch("country");
  const industry = watch("industry");

  function switchType(type: "employee" | "business") {
    setAccountType(type);
    setValue("accountType", type, { shouldValidate: false });
  }

  function onSubmit(_values: FormValues) {
    // Mock submission — navigate to verification step.
    window.location.href = "/register/verify";
  }

  return (
    <RegistrationLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Stepper current={2} />

        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Account details
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in your information to create your WEBUOS account.
          </p>
        </div>

        {/* Account-type segmented control (lets user toggle the prior choice) */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
          {(
            [
              { id: "employee", label: "Individual", icon: User },
              { id: "business", label: "Business", icon: Building2 },
            ] as const
          ).map((opt) => {
            const active = accountType === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => switchType(opt.id)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  active
                    ? "bg-background text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic fields based on account type */}
        {accountType === "business" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="companyName"
              label="Company Name"
              icon={<Building2 className="h-4 w-4" />}
              error={errors.companyName?.message}
            >
              <Input
                id="companyName"
                placeholder="Acme Industries"
                {...rhfRegister("companyName")}
              />
            </Field>
            <Field label="Industry" error={errors.industry?.message}>
              <Select
                value={industry}
                onValueChange={(v) => setValue("industry", v, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Full Name"
              icon={<User className="h-4 w-4" />}
              error={errors.fullName?.message}
            >
              <Input
                id="fullName"
                placeholder="Jane Doe"
                {...rhfRegister("fullName")}
              />
            </Field>
            <Field
              id="professionalRole"
              label="Professional Role"
              icon={<Briefcase className="h-4 w-4" />}
              error={errors.professionalRole?.message}
            >
              <Input
                id="professionalRole"
                placeholder="Procurement Lead"
                {...rhfRegister("professionalRole")}
              />
            </Field>
          </div>
        )}

        {/* Shared contact fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="email"
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...rhfRegister("email")}
            />
          </Field>
          <Field
            id="phone"
            label="Phone"
            icon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              {...rhfRegister("phone")}
            />
          </Field>
        </div>

        <Field label="Country" error={errors.country?.message}>
          <Select
            value={country}
            onValueChange={(v) => setValue("country", v, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="password"
            label="Password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          >
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...rhfRegister("password")}
            />
          </Field>
          <Field
            id="confirmPassword"
            label="Confirm Password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          >
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...rhfRegister("confirmPassword")}
            />
          </Field>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
            After registration you&rsquo;ll verify your email and phone with a
            one-time code.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            Create account <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link
              href="/register"
              className="inline-flex items-center gap-1 font-medium hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <span>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-foreground hover:underline"
              >
                Sign in →
              </Link>
            </span>
          </div>
        </div>
      </form>
    </RegistrationLayout>
  );
}

/* ---------- Field wrapper (icon + label + error) ---------- */
function Field({
  id,
  label,
  icon,
  error,
  trailing,
  children,
}: {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  error?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-xs">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
      </Label>
      <div className="relative">
        {children}
        {trailing}
      </div>
      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}
