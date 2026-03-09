"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light" | "auto";

function applyTheme(m: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = m === "dark" || (m === "auto" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldBeDark);
  document.documentElement.classList.toggle("light", !shouldBeDark);
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode) ?? "auto";
    setMode(saved);
    applyTheme(saved);

    // Listen for system preference changes when in auto mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if ((localStorage.getItem("theme") ?? "auto") === "auto") applyTheme("auto");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const cycle = () => {
    const order: ThemeMode[] = ["dark", "light", "auto"];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    localStorage.setItem("theme", next);
    setMode(next);
    applyTheme(next);
  };

  const isDark = mode === "dark" || (mode === "auto" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { isDark, mode, cycle };
}