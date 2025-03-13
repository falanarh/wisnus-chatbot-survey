"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Merriweather_Sans } from "next/font/google";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Registration data:", formData);
      setIsLoading(false);
      // Handle success (would navigate to login or dashboard)
    }, 1500);
  };

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
          <h1 className={`${merriweatherSans.className} text-sm md:text-base font-bold ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>
            Badan Pusat Statistik
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className={`w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl relative ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
          } backdrop-blur-md border ${
            isDarkMode ? 'border-gray-700/50' : 'border-white/70'
          }`}
        >
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className={`${merriweatherSans.className} text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-blue-800'
            }`}>
              Buat Akun Baru
            </h2>
            <p className={`mt-2 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Daftar untuk mengakses Survei Digital Wisatawan Nusantara
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Nama Lengkap
              </label>
              <div className={`flex items-center rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
              } px-3 py-2 focus-within:ring-2 ${
                isDarkMode ? 'focus-within:ring-blue-500/50' : 'focus-within:ring-blue-300'
              } transition-all`}>
                <User className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  required
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className={`flex items-center rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
              } px-3 py-2 focus-within:ring-2 ${
                isDarkMode ? 'focus-within:ring-blue-500/50' : 'focus-within:ring-blue-300'
              } transition-all`}>
                <Mail className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  required
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Kata Sandi
              </label>
              <div className={`flex items-center rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
              } px-3 py-2 focus-within:ring-2 ${
                isDarkMode ? 'focus-within:ring-blue-500/50' : 'focus-within:ring-blue-300'
              } transition-all`}>
                <Lock className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 karakter"
                  required
                  minLength={8}
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`p-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Sandi harus memiliki minimal 8 karakter
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 flex justify-center items-center rounded-lg text-white font-medium ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                } shadow-md hover:shadow-lg transition-all duration-200`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>Daftar</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>

            {/* OR Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-white/70 text-gray-500'} text-sm`}>
                  atau daftar dengan
                </span>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              className={`w-full py-2.5 px-4 flex justify-center items-center gap-2 rounded-lg font-medium 
                ${isDarkMode
                  ? 'bg-white text-gray-800 hover:bg-gray-100'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
                } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 186.69 190.5">
                <g transform="translate(1184.583 765.171)">
                  <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
                  <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
                  <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
                  <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" fill="#ea4335"/>
                </g>
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sudah punya akun?{" "}
              <Link href="/login" className={`font-medium ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              } hover:underline`}>
                Masuk di sini
              </Link>
            </p>
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