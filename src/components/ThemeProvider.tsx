"use client";

import * as React from "react";
import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeContextValue = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeContextValue>(initialState);

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",  
  storageKey = "theme",
  attribute = "data-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme attribute
    root.removeAttribute(attribute);

    // Check for stored theme preference or use default
    const storedTheme = localStorage.getItem(storageKey);
    let resolvedTheme = defaultTheme;

    if (storedTheme) {
      resolvedTheme = storedTheme as Theme;
    } else if (enableSystem) {
      resolvedTheme = "system";
    }

    setTheme(resolvedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Disable transitions
    if (disableTransitionOnChange) {
      root.classList.add("no-theme-transition");
    }

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.toggle("dark", systemTheme === "dark");
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
    }

    // Store theme in localStorage
    if (theme !== defaultTheme) {
      localStorage.setItem(storageKey, theme);
    } else {
      localStorage.removeItem(storageKey);
    }

    // Re-enable transitions
    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.classList.remove("no-theme-transition");
      }, 0);
    }
  }, [theme, enableSystem, disableTransitionOnChange]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        document.documentElement.classList.toggle(
          "dark",
          mediaQuery.matches
        );
        document.documentElement.style.colorScheme = mediaQuery.matches
          ? "dark"
          : "light";
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, enableSystem]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default ThemeProvider;