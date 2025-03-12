"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UserCircle, Info, LogOut } from "lucide-react";

interface MenuToggleProps {
  isDarkMode: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  closeOtherDropdowns?: () => void;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ 
  isDarkMode, 
  isOpen, 
  setIsOpen, 
  closeOtherDropdowns 
}) => {
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
  const menuItems = [
    { 
      name: "Profil", 
      icon: <UserCircle className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-purple-600'}`} />
    },
    { 
      name: "Tentang", 
      icon: <Info className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} /> 
    },
    { 
      name: "Logout", 
      icon: <LogOut className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} /> 
    },
  ];

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
            className="absolute right-0 mt-2 py-2 w-36 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg z-20 backdrop-blur-lg"
          >
            {menuItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  console.log(`Clicked on ${item.name}`);
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
};

export default MenuToggle;