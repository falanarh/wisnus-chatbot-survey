"use client";

import { Mulish } from 'next/font/google';
import React, { useEffect, useRef, useState } from 'react';
import Footer from './Footer';
import AboutSection from './AboutSection';
import GuidesSection from './GuidesSection';
import HomeSection from './HomeSection';
import Header from './Header';
import TutorialFlow from '../other/TutorialFlow';
import { useAuth } from '@/context/AuthContext';
import Loader from '../other/Loader';
import { getTutorialCompleted, setTutorialCompleted } from '@/utils/otherUtils';

const mulish = Mulish({
    variable: "--font-mulish",
    subsets: ["latin"],
    weight: ["400", "700"],
});

const HomePage: React.FC = () => {
    const [tutorialDone, setTutorialDone] = useState<boolean | null>(null);
    const homeRef = useRef<HTMLDivElement>(null);
    const guidesRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, loading } = useAuth();

    // Initialize tutorial state from localStorage
    useEffect(() => {
        const tutorialCompleted = getTutorialCompleted();
        setTutorialDone(tutorialCompleted);
    }, []);

    useEffect(() => {
        // Check if there's a hash in the URL when the page loads
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1); // remove the # symbol
            scrollToSection(sectionId);
        }
    }, []);

    const scrollToSection = (section: string) => {
        let targetRef;

        switch (section) {
            case 'home':
                targetRef = homeRef;
                break;
            case 'guides':
                targetRef = guidesRef;
                break;
            case 'about':
                targetRef = aboutRef;
                break;
            default:
                targetRef = null;
        }

        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleTutorialFinish = () => {
        setTutorialDone(true);
        setTutorialCompleted(true);
    };

    // Show loading while checking authentication or tutorial state
    if (loading || tutorialDone === null) {
        return <Loader />;
    }

    // Show tutorial only if user is not authenticated and tutorial is not done
    if (!isAuthenticated && !tutorialDone) {
        return <TutorialFlow onFinish={handleTutorialFinish} />;
    }

    return (
        <>
            {/* Fixed Background Layer */}
            <div
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
            >
                {/* Base Background Color */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />

                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-30 dark:opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                                linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Subtle Dots Pattern */}
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Colored Blobs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            {/* Custom Header with scroll functionality */}
            <Header fontClass={mulish.className} scrollToSection={scrollToSection} />

            {/* Content Container */}
            <div className="relative" style={{ zIndex: 1 }}>
                <div ref={homeRef} id="home">
                    <HomeSection onGuideClick={() => scrollToSection('guides')} onAboutClick={() => scrollToSection('about')} />
                </div>

                <div ref={guidesRef} id="guides">
                    <GuidesSection />
                </div>

                <div ref={aboutRef} id="about">
                    <AboutSection />
                </div>

                <Footer />
            </div>
        </>
    );
};

export default HomePage;

