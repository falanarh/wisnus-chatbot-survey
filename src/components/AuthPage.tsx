"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Merriweather_Sans } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import AuthTab from "./AuthTab";
import FormTransition from "./FormTransistion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface AuthPageProps {
  initialTab?: "login" | "register";
}

export default function AuthPage({ initialTab = "login" }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: 0.1
      } 
    }
  };

  // Function to close other dropdowns when opening theme menu
  const closeOtherDropdowns = () => {
    // Add other dropdown closing logic here if needed
  };

  return (
    <div className={`min-h-screen flex flex-col relative
      ${isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'}`}>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Top Navigation */}
      <div className="w-full py-4 px-6 flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
            alt="Badan Pusat Statistik"
            width={40}
            height={40}
          />
          <div>
            <h1 className={`${merriweatherSans.className} text-sm md:text-base font-bold ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>
              Badan Pusat Statistik
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
              Survei Digital Wisatawan Nusantara
            </p>
          </div>
        </Link>
        
        {/* Theme Toggle */}
        <ThemeToggle
          isOpen={themeMenuOpen}
          setIsOpen={setThemeMenuOpen}
          closeOtherDropdowns={closeOtherDropdowns}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className={`w-full max-w-md rounded-2xl shadow-xl relative ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
          } backdrop-blur-md border ${
            isDarkMode ? 'border-gray-700/50' : 'border-white/70'
          }`}
        >
          {/* Auth Tabs */}
          <div className="flex rounded-t-2xl overflow-hidden">
            <AuthTab 
              active={activeTab === "login"}
              onClick={() => setActiveTab("login")}
              label="Masuk"
              isDarkMode={isDarkMode}
            />
            <AuthTab 
              active={activeTab === "register"}
              onClick={() => setActiveTab("register")}
              label="Daftar"
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8 overflow-hidden">
            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className={`${merriweatherSans.className} text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-blue-800'
              }`}>
                {activeTab === "login" ? "Masuk ke Akun Anda" : "Buat Akun Baru"}
              </h2>
              <p className={`mt-2 text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {activeTab === "login" 
                  ? "Akses Survei Digital Wisatawan Nusantara" 
                  : "Daftar untuk mengakses Survei Digital Wisatawan Nusantara"}
              </p>
            </div>

            {/* Form Content with Transitions */}
            <div className="relative">
              <FormTransition show={activeTab === "login"}>
                <LoginForm isDarkMode={isDarkMode} />
              </FormTransition>
              
              <FormTransition show={activeTab === "register"}>
                <RegisterForm isDarkMode={isDarkMode} />
              </FormTransition>
            </div>

            {/* Switch Auth Mode */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {activeTab === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
                {" "}
                <button
                  onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                  className={`font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  } hover:underline`}
                >
                  {activeTab === "login" ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          © 2025 Badan Pusat Statistik Republik Indonesia
        </p>
      </div>
    </div>
  );
}