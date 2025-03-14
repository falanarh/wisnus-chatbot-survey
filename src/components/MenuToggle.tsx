// src/components/MenuToggle.tsx

"use client";

import { useEffect, useRef, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UserCircle, LogOut } from "lucide-react";

// Tipe untuk item menu yang bisa ditambahkan
export interface MenuItem {
  name: string;
  icon: ReactElement;
  onClick?: () => void;
}

interface MenuToggleProps {
  isDarkMode: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  closeOtherDropdowns?: () => void;
  extraMenuItems?: MenuItem[]; // Properti baru untuk item menu tambahan
}

// Pastikan ini menggunakan export default
export default function MenuToggle({ 
  isDarkMode, 
  isOpen, 
  setIsOpen, 
  closeOtherDropdowns,
  extraMenuItems = []
}: MenuToggleProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!isOpen && closeOtherDropdowns) {
      closeOtherDropdowns();
    }
    setIsOpen(!isOpen);
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

  // Menu items with colors
  const defaultMenuItems: MenuItem[] = [
    { 
      name: "Profil", 
      icon: <UserCircle className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-purple-600'}`} />
    },
    // { 
    //   name: "Tentang", 
    //   icon: <Info className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} /> 
    // },
    { 
      name: "Logout", 
      icon: <LogOut className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} /> 
    },
  ];

  // Gabungkan menu default dengan menu tambahan
  const allMenuItems = [...defaultMenuItems, ...extraMenuItems];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
                   bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   shadow-sm backdrop-blur`}
        aria-label="Menu"
      >
        {isOpen ? 
          <X className="w-5 h-5 text-red-500" /> : 
          <Menu className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-purple-600'}`} />
        }
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg z-20 backdrop-blur-lg"
          >
            {allMenuItems.map((item, index) => (
              <motion.button
                key={`${item.name}-${index}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    console.log(`Clicked on ${item.name}`);
                  }
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}