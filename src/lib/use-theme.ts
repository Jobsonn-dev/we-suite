"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
export type Resolved = "light" | "dark";

const KEY = "webuos-theme";

function systemTheme(): Resolved {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolve(t: Theme): Resolved {
  return t === "system" ? systemTheme() : t;
}

function apply(r: Resolved) {
  const el = document.documentElement;
  el.classList.toggle("dark", r === "dark");
  el.style.colorScheme = r;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => typeof window === "undefined" ? "system" : (() => { try { const v = localStorage.getItem(KEY) as Theme | null; return v === "light" || v === "dark" || v === "system" ? v : "system"; } catch { return "system"; } })());
  const [resolved, setResolved] = useState<Resolved>(() => typeof window === "undefined" ? "light" : resolve((() => { try { const v = localStorage.getItem(KEY) as Theme | null; return v === "light" || v === "dark" || v === "system" ? v : "system"; } catch { return "system"; } })()));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const r = resolve(theme);
    apply(r);
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = () => {
      const r = systemTheme();
      setResolved(r);
      apply(r);
    };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    const r = resolve(t);
    setResolved(r);
    apply(r);
    try { localStorage.setItem(KEY, t); } catch {}
  }, []);

  return { theme, resolved, setTheme, mounted };
}
