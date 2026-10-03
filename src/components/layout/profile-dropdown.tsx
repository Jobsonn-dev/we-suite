"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User, Settings, LogOut, ChevronDown, UserCircle, Bell, HelpCircle,
  LayoutGrid, ShieldCheck, Building2, Mail, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  variant?: "header" | "account";
  className?: string;
}

/**
 * ProfileDropdown — avatar button that opens a dropdown menu.
 *
 * Used in the site header (variant="header") to provide quick access to:
 *   - Profile Account  → /account
 *   - Account settings → /account#security
 *   - Help center
 *   - Sign in / Sign out
 *
 * The avatar shows "WT" initials in a cyan→blue gradient circle.
 * On click, a dropdown opens with a profile summary card and menu items.
 */
export function ProfileDropdown({ variant = "header", className }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isDark = variant === "account";
  const triggerColor = isDark
    ? "ring-2 ring-white/20 hover:ring-cyan-400/50"
    : "ring-2 ring-white/10 hover:ring-primary/40";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Avatar trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white transition-all",
          triggerColor,
        )}
      >
        WT
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          style={{ animation: "dropdownFadeIn 0.15s ease-out" }}
        >
          {/* Profile summary card */}
          <div className="border-b border-border bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white ring-2 ring-white/20">
                WT
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  WEBUOS Tech &amp; AI Services
                </p>
                <p className="truncate text-xs text-muted-foreground">webuostech@gmail.com</p>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="p-2">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              role="menuitem"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <UserCircle className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">Profile Account</p>
                <p className="text-[11px] text-muted-foreground">Manage your profile &amp; business</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/account#communication"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              role="menuitem"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Mail className="h-3.5 w-3.5" />
              </span>
              Communication
            </Link>

            <Link
              href="/account#business"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              role="menuitem"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Building2 className="h-3.5 w-3.5" />
              </span>
              Business profile
            </Link>

            <Link
              href="/account#security"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              role="menuitem"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              Security &amp; sign-in
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              role="menuitem"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <LayoutGrid className="h-3.5 w-3.5" />
              </span>
              Dashboard
            </Link>

            <div className="my-2 border-t border-border" />

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              role="menuitem"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors">
                <LogOut className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm leading-tight">Sign in / Switch account</p>
                <p className="text-[11px] font-normal text-muted-foreground">Use different credentials</p>
              </div>
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-4 py-2.5">
            <p className="text-[10px] text-center text-muted-foreground">
              © {new Date().getFullYear()} WEBUOS · Profile Account
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Compact version — just an avatar trigger (no dropdown)
// Useful in places like the Account page header (where a real
// dropdown is already provided by the page itself)
// ============================================================
export function ProfileAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-bold text-white ring-2 ring-white/20",
        dims,
        className,
      )}
    >
      WT
    </div>
  );
}

// Suppress unused import warning for icons used elsewhere
export const _icons = { User, Settings, Bell, HelpCircle };
