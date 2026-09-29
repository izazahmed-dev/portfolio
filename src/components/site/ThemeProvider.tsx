"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<Theme>("dark");

const STORAGE_KEY = "press-run";

/**
 * The press run.
 *
 * Dark is the default for this site, and the default is applied in the head
 * before hydration so the first paint is already the right sheet of paper.
 * The preference is remembered, and it follows the reader back on a return
 * visit rather than re-resolving.
 *
 * System preference is honoured once: the first time a reader with no stored
 * choice loads the page, their OS setting picks the run. After that their
 * explicit choice wins, because a toggle that silently flips back is worse
 * than no toggle.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // The inline head script has already written data-theme before hydration.
  // Read it back rather than resolving independently, so the first client
  // render agrees with the first server paint.
  useEffect(() => {
    const el = document.documentElement;
    const current = el.getAttribute("data-theme");
    if (current === "dark" || current === "light") setTheme(current);
    else {
      const stored = readStored();
      const initial = stored ?? (prefersDark() ? "dark" : "light");
      setTheme(initial);
    }
  }, []);

  // Write the attribute from state, the single source of truth.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable, the run is session-only */
    }
    updateThemeColor(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeToggleContext.Provider value={toggle}>
        {children}
      </ThemeToggleContext.Provider>
    </ThemeContext.Provider>
  );
}

const ThemeToggleContext = createContext<() => void>(() => {});

export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}

export function useTheme() {
  return useContext(ThemeContext);
}

function readStored(): Theme | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Keep the OS chrome, the mobile browser bar, matched to the sheet. */
function updateThemeColor(theme: Theme) {
  const tag = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  if (tag) tag.content = theme === "dark" ? "#0b0f14" : "#ece9e1";
}
