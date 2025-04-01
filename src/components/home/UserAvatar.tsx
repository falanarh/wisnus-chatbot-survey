"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import {
  LogOut,
  User,
  ClipboardList,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronDown,
  Plane,
  ShieldUser,
} from "lucide-react";
import { useEvaluation } from "@/hooks/useEvaluation";

const UserAvatar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [surveysDropdownOpen, setSurveysDropdownOpen] = useState(false);
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);
  const [surveyStatus, setSurveyStatus] = useState({
    activeSurvey: false,
    activeEvaluation: false
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const { sessionData } = useSurveyStatus();
  const { isComplete: isEvaluationComplete } = useEvaluation();

  // Check survey and evaluation status on component mount and when user changes
  useEffect(() => {
    const checkSurveyStatus = async () => {
      let isSurveyActive = false;
      let isEvaluationActive = false;

      if (!user) return;

      try {
        // Check Survey Status
        if (!sessionData) {
          isSurveyActive = true;
        } else {
          isSurveyActive = sessionData.status === "IN_PROGRESS" ? true : false;
        }

        // Check Evaluation Status
        isEvaluationActive = !isEvaluationComplete;

        setSurveyStatus({
          activeSurvey: isSurveyActive,
          activeEvaluation: isEvaluationActive
        });
      } catch (error) {
        console.error("Error checking survey status:", error);
      }
    };

    checkSurveyStatus();
  }, [user, sessionData, isEvaluationComplete]);
 
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        // Also close submenus when clicking outside
        setSurveysDropdownOpen(false);
        setHistoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get initials from user name
  const getInitials = () => {
    if (!user?.name) return "?";

    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Toggle surveys dropdown
  const toggleSurveysDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent menu from closing
    setSurveysDropdownOpen(!surveysDropdownOpen);
    // Close other dropdown if open
    if (!surveysDropdownOpen) {
      setHistoryDropdownOpen(false);
    }
  };

  // Toggle history dropdown
  const toggleHistoryDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent menu from closing
    setHistoryDropdownOpen(!historyDropdownOpen);
    // Close other dropdown if open
    if (!historyDropdownOpen) {
      setSurveysDropdownOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 transition-all duration-200 rounded-full group"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {/* Avatar circle */}
        <div className="relative">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium transition-transform group-hover:scale-105 shadow-sm">
            {getInitials()}
          </div>
          {/* Status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors" />
        </div>
      </button>

      {/* Enhanced Dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header with profile banner */}
            <div className="relative">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

              {/* Content */}
              <div className="relative p-4 text-white">
                <div className="flex items-center space-x-3">
                  {/* Larger avatar */}
                  <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-white/20 text-white text-xl font-medium">
                    {getInitials()}
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-white truncate">{user.name}</h4>
                    <p className="text-sm text-blue-100 truncate">{user.email}</p>
                    <div className="flex items-center mt-1 text-xs text-blue-100">
                      <MapPin size={10} className="mr-1" />
                      <span>Indonesia</span>
                    </div>
                  </div>
                </div>

                {/* Status pill */}
                <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-100">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Sedang Online
                </div>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700">
              <div className="px-2 py-3 text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">2</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Survei</div>
              </div>
              <div className="px-2 py-3 text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">85%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Penyelesaian</div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Profil Saya</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              {/* Surveys dropdown */}
              <div className="relative">
                <button
                  onClick={toggleSurveysDropdown}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <ClipboardList className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                    <span>Survei Saya</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${surveysDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Surveys submenu */}
                {surveysDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-100 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 text-sm"
                  >
                    {/* Dynamic survey menu items */}
                    {!surveyStatus.activeSurvey && !surveyStatus.activeEvaluation ? (
                      <div className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                        Tidak Ada Survei
                      </div>
                    ) : (
                      <>
                        {surveyStatus.activeSurvey && (
                          <Link
                            href="/survey"
                            className="flex items-center pl-11 pr-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plane className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            <span>Wisatawan Nusantara</span>
                          </Link>
                        )}
                        {surveyStatus.activeEvaluation && (
                          <Link
                            href="/survey/evaluation"
                            className="flex items-center pl-11 pr-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <ShieldUser className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                            <span>Persepsi Pengguna</span>
                          </Link>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              {/* History dropdown */}
              <div className="relative">
                <button
                  onClick={toggleHistoryDropdown}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                    <span>Riwayat Survei</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${historyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {historyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-100 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 text-sm"
                  >
                    {/* Dynamic history menu items */}
                    {surveyStatus.activeSurvey && surveyStatus.activeEvaluation ? (
                      <div className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                        Tidak Ada Riwayat
                      </div>
                    ) : (
                      <>
                        {!surveyStatus.activeSurvey && (
                          <Link
                            href="/survey"
                            className="flex items-center pl-11 pr-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plane className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            <span>Wisatawan Nusantara</span>
                          </Link>
                        )}
                        {!surveyStatus.activeEvaluation && (
                          <Link
                            href="/survey/evaluation"
                            className="flex items-center pl-11 pr-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <ShieldUser className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                            <span>Persepsi Pengguna</span>
                          </Link>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

              <button
                onClick={logout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserAvatar;