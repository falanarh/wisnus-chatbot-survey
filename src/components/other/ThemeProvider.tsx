"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: string;
}

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme as Theme);
  const [mounted, setMounted] = useState(false);

  // Handle theme change
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    const isDark = theme === "dark" || (theme === "system" && prefersDarkMode());

    // Remove transition class
    if (disableTransitionOnChange) {
      root.classList.add("no-theme-transition");
    }

    // Apply theme attribute
    if (attribute === "class") {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else {
      root.setAttribute(attribute, isDark ? "dark" : "light");
    }

    // Set resolved theme for hooks
    // (resolvedTheme state removed)
    // Re-enable transitions
    if (disableTransitionOnChange) {
      window.setTimeout(() => {
        root.classList.remove("no-theme-transition");
      }, 0);
    }
  };

  // Check for dark mode preference
  const prefersDarkMode = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Update theme
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, mounted]);

  // Set up system theme listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Initialize
  useEffect(() => {
    setMounted(true);
    
    // Read from localStorage or use default
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Handle theme setting with local storage persistence
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};