"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
    fontClass?: string;
}

export const Header: React.FC<HeaderProps> = ({ fontClass = 'font-sans' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768); // 768px adalah breakpoint untuk md
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        // Close theme menu when opening navigation menu
        setThemeMenuOpen(false);
    };

    // Function to close other dropdowns when opening theme menu
    const closeOtherDropdowns = () => {
        setIsOpen(false);
    };

    const menuVariants = {
        open: {
            opacity: 1,
            y: 0,
            display: 'block',
            transition: { duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] },
        },
        closed: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] },
            transitionEnd: { display: 'none' },
        },
    };

    return (
        <header className={`py-3 px-4 sm:px-6 md:px-10 lg:px-20 flex justify-between items-center ${fontClass} fixed top-0 w-full z-50 backdrop-blur-md shadow-sm dark:shadow-md dark:shadow-black/10 border-b
            bg-gradient-to-r from-blue-400/80 to-indigo-400/80 text-white
            dark:bg-gradient-to-r dark:from-blue-900/80 dark:to-purple-900/80
            dark:border-gray-800`}>
            <div className="flex items-center">
                <Image
                    src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
                    alt="Badan Pusat Statistik"
                    width={48}
                    height={48}
                    className="mr-3"
                />
                <h1 className="text-[14px] sm:text-lg font-bold text-white">Badan Pusat Statistik</h1>
            </div>
            
            {/* Mobile Controls in a Flex Container */}
            <div className="md:hidden flex items-center gap-3">
                {/* Theme Toggle for Mobile - Always visible */}
                <ThemeToggle 
                    isOpen={themeMenuOpen}
                    setIsOpen={setThemeMenuOpen}
                    closeOtherDropdowns={closeOtherDropdowns}
                />
                
                {/* Hamburger Menu Button */}
                <button
                    className="text-white relative w-5 h-5"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    <div className={`absolute w-5 h-[2px] top-0 bg-white transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'}`} />
                    <div className={`absolute w-5 h-[2px] top-1 bg-white transition-opacity duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'} translate-y-1`} />
                    <div className={`absolute w-5 h-[2px] top-2 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
                </button>
            </div>
            
            <AnimatePresence>
                {isOpen && !isDesktop && (
                    <motion.nav
                        className="absolute md:static top-12 left-0 w-full md:w-auto bg-blue-400/90 dark:bg-gray-900/90 backdrop-blur-md md:bg-transparent shadow-sm dark:shadow-gray-800 md:shadow-none md:flex justify-center"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <div className="w-full md:w-auto flex flex-col md:flex-row items-center md:space-x-6 text-[12px] font-medium text-white p-4 md:p-0">
                            <ul className="flex flex-col items-center md:flex-row space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto">
                                <li>
                                    <a href="#" className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300">Beranda</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300">Panduan</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300">Tentang</a>
                                </li>
                            </ul>
                            <div className="flex items-center mt-4">
                                <motion.button
                                    className="ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 items-center justify-center px-4 py-2 border-0 rounded-full text-sm font-medium text-white bg-gradient-to-l from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:from-indigo-600 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 focus:outline-none"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
            <div className="hidden md:flex items-center space-x-6">
                <nav className="flex space-x-6 text-white text-[14px]">
                    <a href="#" className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300">Beranda</a>
                    <a href="#" className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300">Panduan</a>
                    <a href="#" className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300">Tentang</a>
                </nav>
                <div className="flex items-center space-x-4">
                    <ThemeToggle 
                        isOpen={themeMenuOpen}
                        setIsOpen={setThemeMenuOpen}
                        closeOtherDropdowns={closeOtherDropdowns}
                    />
                    <motion.button
                        className="ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 items-center justify-center px-4 sm:px-6 py-2 border-0 rounded-full text-sm font-medium text-white bg-gradient-to-l from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:from-indigo-600 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 focus:outline-none"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Login
                    </motion.button>
                </div>
            </div>
        </header>
    );
};