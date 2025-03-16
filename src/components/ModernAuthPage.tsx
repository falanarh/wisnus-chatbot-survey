"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Merriweather_Sans } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import ModernAuthTab from "./ModernAuthTab";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import ModernFormTransition from "./ModernFormTransition";
import ModernLoginForm from "./ModernLoginForm";
import ModernRegisterForm from "./ModernRegisterForm";
import { useSearchParams } from "next/navigation";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface AuthPageProps {
  initialTab?: "login" | "register";
}

export default function ModernAuthPage({ initialTab = "login" }: AuthPageProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Check URL query parameter for initial tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'login' || tabParam === 'register') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Ensure hydration matching
  useEffect(() => {
    setMounted(true);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    }
  };

  // Function to close other dropdowns when opening theme menu
  const closeOtherDropdowns = () => {
    // Add other dropdown closing logic here if needed
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen flex flex-col relative
      ${isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/80 to-blue-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-100'}`}>

      {/* Background Pattern and Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic wave background */}
        <div className="absolute w-full h-full opacity-10">
          <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-300/30 to-transparent dark:from-blue-500/10 dark:to-transparent"></div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Top Navigation */}
      <div className="w-full py-4 px-4 sm:px-6 md:px-24 lg:36 xl:px-48 flex justify-between items-center relative z-10">
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative overflow-hidden rounded-full p-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className={`relative rounded-full p-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
              <Image
                src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
                alt="Badan Pusat Statistik"
                width={34}
                height={34}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>
          <div>
            <h1 className={`${merriweatherSans.className} text-sm md:text-base font-bold ${isDarkMode ? 'text-white' : 'text-blue-800'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
              Badan Pusat Statistik
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-600'} opacity-80 group-hover:opacity-100 transition-opacity`}>
              Survei Digital Wisatawan Nusantara
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Back to Home Button */}
          <Link 
            href="/" 
            className={`
              hidden sm:flex items-center gap-1.5 text-sm 
              py-1.5 px-3 rounded-full transition-all duration-300
              ${isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </Link>
          
          {/* Theme Toggle */}
          <ThemeToggle
            isOpen={themeMenuOpen}
            setIsOpen={setThemeMenuOpen}
            closeOtherDropdowns={closeOtherDropdowns}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className={`
            w-full max-w-md overflow-hidden relative
            backdrop-blur-md border
            ${isDarkMode 
              ? 'bg-gray-900/50 border-gray-700/50 shadow-xl shadow-blue-900/20' 
              : 'bg-white/80 border-white/50 shadow-xl shadow-indigo-200/50'
            }
            rounded-2xl
          `}
        >
          {/* Subtle glass reflection effect */}
          <div className={`
            absolute top-0 inset-x-0 h-40 w-full
            bg-gradient-to-b ${isDarkMode 
              ? 'from-white/5 to-transparent' 
              : 'from-white/60 to-transparent'
            }
            opacity-70 pointer-events-none
          `}></div>

          {/* Modern Auth Tabs */}
          <div className={`
            relative flex rounded-t-xl overflow-hidden
            ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70'}
            p-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <ModernAuthTab 
              active={activeTab === "login"}
              onClick={() => setActiveTab("login")}
              label="Masuk"
              icon={<LogIn size={18} />}
              isDarkMode={isDarkMode}
            />
            <ModernAuthTab 
              active={activeTab === "register"}
              onClick={() => setActiveTab("register")}
              label="Daftar"
              icon={<UserPlus size={18} />}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8 overflow-hidden">
            {/* Form Header */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
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
            </motion.div>

            {/* Form Content with Transitions */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <ModernFormTransition show={true}>
                    <ModernLoginForm isDarkMode={isDarkMode} />
                  </ModernFormTransition>
                ) : (
                  <ModernFormTransition show={true}>
                    <ModernRegisterForm isDarkMode={isDarkMode} />
                  </ModernFormTransition>
                )}
              </AnimatePresence>
            </div>

            {/* Switch Auth Mode */}
            <div className="mt-8 text-center">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activeTab === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
                  {" "}
                  <button
                    onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                    className={`
                      font-medium relative
                      ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
                      transition-colors hover:underline
                    `}
                  >
                    {activeTab === "login" ? "Daftar sekarang" : "Masuk di sini"}
                  </button>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 text-center">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          © 2025 Badan Pusat Statistik Republik Indonesia
        </p>
      </div>
    </div>
  );
}