"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 p-2 text-foreground backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/20 dark:border-white/10 shadow-sm"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </button>
  );
}
