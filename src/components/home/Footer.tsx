"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  ChevronUp, 
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Show scroll button when user scrolls down
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    });
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Footer links
  const footerLinks = [
    {
      title: "Tentang BPS",
      links: [
        { name: "Profil BPS", href: "#" },
        { name: "Visi & Misi", href: "#" },
        { name: "Struktur Organisasi", href: "#" },
        { name: "Peraturan & Kebijakan", href: "#" }
      ]
    },
    {
      title: "Layanan",
      links: [
        { name: "Survei Digital", href: "/survey" },
        { name: "Konsultasi Statistik", href: "#" },
        { name: "Data & Publikasi", href: "#" },
        { name: "Katalog Statistik", href: "#" }
      ]
    },
    {
      title: "Bantuan",
      links: [
        { name: "Panduan Survei", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Kebijakan Privasi", href: "#" },
        { name: "Hubungi Kami", href: "#" }
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/bps_statistics" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/bps_statistics" },
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/bpsstatistics" },
    { name: "Youtube", icon: <Youtube className="w-5 h-5" />, href: "https://www.youtube.com/c/bpsstatistics" }
  ];

  return (
    <footer className={`w-full pt-12 pb-6 relative ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/40 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute inset-0 opacity-5 ${isDarkMode ? 'opacity-10' : 'opacity-30'}`}
          style={{
            backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Smaller, Subtle Wave Top Decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden translate-y-[-1px]">
        <svg 
          className="relative block w-full h-6 sm:h-8"
          viewBox="0 0 1200 40" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,20 C150,40 350,0 500,10 C650,20 800,40 1000,30 C1100,25 1150,10 1200,20 L1200,0 L0,0 Z" 
            className={`${isDarkMode ? 'fill-blue-900/40' : 'fill-blue-100/80'}`}
          ></path>
          <path 
            d="M0,15 C250,0 350,30 600,15 C850,0 950,25 1200,12 L1200,0 L0,0 Z" 
            className={`${isDarkMode ? 'fill-blue-900/60' : 'fill-blue-100'}`}
            opacity="0.5"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo & Contact Info Column */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
                alt="BPS Logo"
                width={48}
                height={48}
              />
              <div>
                <h2 className="font-bold text-blue-700 dark:text-blue-300 text-lg">Badan Pusat Statistik</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Republik Indonesia</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
              Menyediakan Data Statistik Berkualitas Untuk Indonesia Maju
            </p>

            <div className="mt-2 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Jl. Dr. Sutomo No. 6-8, Jakarta 10710, Indonesia
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  (021) 3841195, 3842508
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  bpshq@bps.go.id
                </p>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-5 lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((column, index) => (
              <div key={index}>
                <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter & Social Links Column */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-4">
              Dapatkan Info Terbaru
            </h3>
            
            <div className="flex">
              <input
                type="email"
                placeholder="Email Anda"
                className={`w-full px-4 py-2 rounded-l-lg focus:outline-none text-sm
                  ${isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                  } border`}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg text-sm transition-colors"
              >
                Daftar
              </button>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-600 dark:text-gray-300 text-sm mb-3">
                Ikuti Kami
              </h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full flex items-center justify-center
                      ${isDarkMode
                        ? 'bg-gray-800 hover:bg-blue-800 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600'
                      } transition-colors`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className={`my-8 border-t ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Badan Pusat Statistik Republik Indonesia. Hak Cipta Dilindungi.
            </p>
          </div>
          
          <div className="flex items-center gap-5">
            <Link 
              href="#"
              className="hidden sm:inline-block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link 
              href="#"
              className="hidden sm:inline-block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Syarat & Ketentuan
            </Link>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span>Dibuat dengan</span>
              <Heart className="w-3 h-3 mx-1 text-red-500 animate-pulse" />
              <span>di Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed right-6 bottom-6 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg z-50 ${showScrollButton ? 'visible' : 'invisible opacity-0'}`}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollButton ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;