"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { RegistrationLayout } from "@/components/registration/registration-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
    mode: "onSubmit",
  });

  function onSubmit(_values: FormValues) {
    // Mock auth — navigate to dashboard.
    // Using assign() (a method call) instead of href assignment so the
    // react-hooks/immutability rule doesn't fire inside the memoized handler.
    window.location.assign("/dashboard");
  }

  return (
    <RegistrationLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back to WEBUOS
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-xs">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...rhfRegister("email")}
            />
            {errors.email && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="flex items-center gap-1.5 text-xs"
            >
              <Lock className="h-4 w-4 text-muted-foreground" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-10"
                {...rhfRegister("password")}
              />
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
            </div>
            {errors.password && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...rhfRegister("remember")}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-muted-foreground">Keep me signed in</span>
            </label>
            <Link
              href="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => {
              window.location.assign("/dashboard");
            }}
          >
            <Building2 className="h-4 w-4" />
            Continue with Business SSO
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Don&rsquo;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-foreground hover:underline"
          >
            Create account →
          </Link>
        </p>

        <div
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground"
          )}
        >
          <ShieldCheck className="h-3 w-3" />
          Demo sign-in — any email &amp; password will work.
        </div>
      </form>
    </RegistrationLayout>
  );
}
