"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme, useThemeToggle } from "@/components/site/ThemeProvider";

/**
 * The one control that changes the press run.
 *
 * Icon and label always show the destination, not the current state: a reader
 * on the dark sheet sees the sun, because that is what the switch will do.
 * The aria-pressed carries the state for assistive tech.
 */
export function ThemeToggle({ label = false }: { label?: boolean }) {
  const theme = useTheme();
  const toggle = useThemeToggle();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? "Print the light sheet" : "Print the dark sheet"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <Sun
        className="tt-sun"
        size={16}
        strokeWidth={1.9}
        aria-hidden
      />
      <Moon
        className="tt-moon"
        size={16}
        strokeWidth={1.9}
        aria-hidden
      />
      {label && (
        <span className="t-data text-[0.625rem] uppercase tracking-[0.14em]">
          {dark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
