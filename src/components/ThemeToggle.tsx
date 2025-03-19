//components/ThemeToggle.tsx

"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface ThemeToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  closeOtherDropdowns?: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isOpen, setIsOpen, closeOtherDropdowns }) => {
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!isOpen && closeOtherDropdowns) {
      closeOtherDropdowns();
    }
    setIsOpen(!isOpen);
  };

  const selectTheme = (selectedTheme: "light" | "dark" | "system") => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
                   bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   shadow-sm backdrop-blur`}
        aria-label="Ubah Tema"
      >
        {theme === "light" && <Sun className="w-5 h-5 text-amber-500" />}
        {theme === "dark" && <Moon className="w-5 h-5 text-blue-400" />}
        {theme === "system" && <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 py-2 w-36 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg z-20 backdrop-blur-lg"
          >
            <button
              onClick={() => selectTheme("light")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Terang</span>
              {theme === "light" && <span className="ml-auto">✓</span>}
            </button>
            <button
              onClick={() => selectTheme("dark")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Gelap</span>
              {theme === "dark" && <span className="ml-auto">✓</span>}
            </button>
            <button
              onClick={() => selectTheme("system")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Sistem</span>
              {theme === "system" && <span className="ml-auto">✓</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;