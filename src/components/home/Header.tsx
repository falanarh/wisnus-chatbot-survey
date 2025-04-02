//src/components/home/Header.tsx

"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/other/ThemeProvider';
import { usePathname } from 'next/navigation';
import { Home, Book, Info, LogIn, X, UserPlus, LogOut } from 'lucide-react';
import { Merriweather_Sans } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from './UserAvatar';
import ThemeToggle from '../other/ThemeToggle';

const merriweatherSans = Merriweather_Sans({
    variable: "--font-merriweather-sans",
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface HeaderProps {
    fontClass?: string;
    scrollToSection?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ fontClass = 'font-sans', scrollToSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const { theme } = useTheme();
    const pathname = usePathname();
    const isDarkMode = theme === 'dark';
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const isHomePage = pathname === '/';
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isOpen && !isDesktop) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isDesktop]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setThemeMenuOpen(false);
    };

    const closeOtherDropdowns = () => {
        setIsOpen(false);
    };

    const handleNavigation = (section: string) => {
        if (isHomePage && scrollToSection) {
            scrollToSection(section);
            setIsOpen(false);
        } else {
            router.push(`/#${section}`);
        }
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    const menuItems = [
        { name: 'Beranda', icon: <Home size={18} />, section: 'home' },
        { name: 'Panduan', icon: <Book size={18} />, section: 'guides' },
        { name: 'Tentang', icon: <Info size={18} />, section: 'about' },
    ];

    const menuBackdropVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3, delay: 0.1 }
        }
    };

    const menuPanelVariants = {
        hidden: {
            x: '-100%',
            opacity: 0
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 30,
                stiffness: 300,
                duration: 0.4,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            x: '-100%',
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        }
    };

    const menuItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        }
    };

    const buttonVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                delay: 0.4,
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <header className={`py-3 px-4 sm:px-6 md:px-24 lg:36 xl:px-48 flex justify-between items-center ${fontClass} fixed top-0 w-full z-50 backdrop-blur-md shadow-sm dark:shadow-md dark:shadow-black/10 border-b
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
                <h1 className={`${merriweatherSans.className} text-[14px] sm:text-lg font-bold text-white`}>Badan Pusat Statistik</h1>
            </div>

            <div className="md:hidden flex items-center gap-2" ref={menuRef}>
                <ThemeToggle
                    isOpen={themeMenuOpen}
                    setIsOpen={setThemeMenuOpen}
                    closeOtherDropdowns={closeOtherDropdowns}
                />

                <button
                    className="text-white relative w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    <div className={`absolute w-5 h-[2px] bg-green-500 dark:bg-blue-400 transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-0' : 'translate-y-[-6px]'}`} />
                    <div className={`absolute w-5 h-[2px] bg-green-500 dark:bg-blue-400 transition-opacity duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <div className={`absolute w-5 h-[2px] bg-green-500 dark:bg-blue-400 transition-transform duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-[6px]'}`} />
                </button>
            </div>

            <div className="hidden md:flex items-center space-x-6">
                <nav className="flex space-x-6 text-white text-[14px]">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.section)}
                            className="hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                        >
                            {item.name}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center space-x-3">
                    <ThemeToggle
                        isOpen={themeMenuOpen}
                        setIsOpen={setThemeMenuOpen}
                        closeOtherDropdowns={closeOtherDropdowns}
                    />

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            <UserAvatar />
                        </div>
                    ) : (
                        <>
                            <motion.button
                                className="ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 items-center justify-center px-4 py-2 border border-white/30 rounded-full text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm focus:outline-none hidden sm:flex"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/auth?tab=register'}
                            >
                                <UserPlus size={16} className="mr-1.5" />
                                <span>Register</span>
                            </motion.button>
                            <motion.button
                                className="ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 items-center justify-center px-4 py-2 border-0 rounded-full text-sm font-medium text-white bg-gradient-to-l from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:from-indigo-600 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 focus:outline-none flex"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/auth?tab=login'}
                            >
                                <LogIn size={16} className="mr-1.5" />
                                <span>Login</span>
                            </motion.button>
                        </>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && !isDesktop && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuBackdropVariants}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="fixed top-0 left-0 h-screen w-full md:w-[380px] overflow-hidden bg-gradient-to-br from-white to-white/95 dark:from-gray-900 dark:to-gray-800/95 backdrop-blur-md shadow-xl z-50 flex flex-col"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuPanelVariants}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
                                        alt="Badan Pusat Statistik"
                                        width={48}
                                        height={48}
                                    />
                                    <h1 className="text-base font-bold text-blue-600 dark:text-white">Badan Pusat Statistik</h1>
                                </div>
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className='flex-1 flex flex-col overflow-y-auto'>
                                <nav className="flex-1 p-5 bg-white dark:bg-gray-900">
                                    <div className="mb-3 text-sm font-medium text-gray-400 dark:text-gray-500 px-2">MENU UTAMA</div>
                                    <ul className="space-y-2">
                                        {menuItems.map((item, index) => (
                                            <motion.li
                                                key={index}
                                                variants={menuItemVariants}
                                            >
                                                <button
                                                    onClick={() => handleNavigation(item.section)}
                                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 group transition-colors w-full text-left"
                                                >
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-700 transition-colors">
                                                        {item.icon}
                                                    </div>
                                                    <span className="font-medium">{item.name}</span>
                                                </button>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </nav>
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95">
                                    {isAuthenticated ? (
                                        <div className="space-y-3">
                                            <motion.div
                                                className="flex"
                                                variants={menuItemVariants}
                                            >
                                                <UserAvatar inMobileMenu={true} />
                                            </motion.div>
                                            <motion.button
                                                variants={buttonVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={handleLogout}
                                                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 rounded-lg shadow transition-shadow hover:shadow-md"
                                            >
                                                <LogOut size={16} />
                                                <span className="font-medium">Keluar</span>
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 mb-3">
                                            <motion.button
                                                variants={buttonVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => router.push('/auth?tab=register')}
                                                className="flex-1 py-2.5 px-3 flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg shadow transition-shadow hover:shadow-md"
                                            >
                                                <UserPlus size={16} />
                                                <span className="font-medium">Register</span>
                                            </motion.button>

                                            <motion.button
                                                variants={buttonVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => router.push('/auth?tab=login')}
                                                className="flex-1 py-2.5 px-3 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                                            >
                                                <LogIn size={16} />
                                                <span className="font-medium">Login</span>
                                            </motion.button>
                                        </div>
                                    )}

                                    <motion.div
                                        variants={menuItemVariants}
                                        className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        <p className="text-blue-500 dark:text-blue-400 font-medium hover:underline">
                                            © 2025 Badan Pusat Statistik Republik Indonesia
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;