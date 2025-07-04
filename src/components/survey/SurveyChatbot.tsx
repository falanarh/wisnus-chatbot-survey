//src/components/survey/SurveyChatbot.tsx

"use client";

import React, { useState } from "react";
import SurveyCompletionPage from "@/components/survey/SurveyCompletionPage";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import ChatLayout from "./ChatLayout";
import Loader from "../other/Loader";
import { useSurveyMessages } from "@/hooks/useSurveyMessages";
import ProgressBar from "@/components/survey/evaluation/ProgressBar";
import { CheckCircle, Circle, BarChart2 } from "lucide-react";

// Reusable background component
const StyledBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen relative">
    {/* Fixed Background Layer - same as homepage */}
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

    {/* Content on top of background */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Loading component with styled background
const LoadingState = () => (
  <StyledBackground>
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Memuat data survei...</p>
      </div>
    </div>
  </StyledBackground>
);

// Error component with styled background
const ErrorState = ({ error, refreshStatus }: { error: string, refreshStatus: () => void }) => (
  <StyledBackground>
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-6 rounded-lg max-w-md shadow-lg">
        <h2 className="font-bold text-lg mb-2">Terjadi Kesalahan</h2>
        <p>{error}</p>
        <button
          onClick={refreshStatus}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </StyledBackground>
);

const SurveyChatbot: React.FC = () => {
  const { isLoading: isLoadingSurveyStatus, error, sessionData, refreshStatus } = useSurveyStatus();
  const { isLoading: isLoadingSurveyMessages, messages, addMessage, updateLastMessage } = useSurveyMessages();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Selalu tampilkan LoadingState terlebih dahulu
  if (isLoadingSurveyStatus || isLoadingSurveyMessages) {
    return <LoadingState />;
  }

  // Show error state if API call fails
  if (error) {
    return <ErrorState error={error} refreshStatus={refreshStatus} />;
  }

  // Show completion page if survey is completed
  if (sessionData?.status === 'COMPLETED') {
    return (
      <StyledBackground>
        <SurveyCompletionPage sessionData={sessionData} />
      </StyledBackground>
    );
  } else if (sessionData?.status === 'IN_PROGRESS') {
    const progress = sessionData.progress;
    const responses = sessionData.responses || [];
    const answeredMap = new Map(responses.map(r => [r.question_code, r.valid_response]));
    const allQuestionCodes = [
      ...(progress.answered_question_codes || []),
      ...(progress.current_question_code ? [progress.current_question_code] : [])
    ];
    const uniqueQuestionCodes = Array.from(new Set(allQuestionCodes));
    return (
      <StyledBackground>
        {/* Floating Progress Button */}
        <button
          className="fixed z-40 bottom-5 right-5 sm:top-6 sm:bottom-auto sm:right-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg p-3 sm:p-3.5 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Lihat progress survei"
          onClick={() => setDrawerOpen(true)}
        >
          <BarChart2 size={28} />
        </button>

        {/* Drawer Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen}
        />

        {/* Drawer Panel */}
        <aside
          className={`fixed top-0 right-0 h-full w-full sm:w-[420px] max-w-full z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Progress Survei"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">Progress Survei</h2>
            <button
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup progress"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">
                  {progress.answered_questions} / {progress.total_questions} terjawab
                </span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {progress.progress_percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress.progress_percentage}%` }}
                  aria-label={`Progress: ${progress.progress_percentage}%`}
                ></div>
              </div>
            </div>
            <div className="bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-200">Status Pertanyaan</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 max-h-[40vh] overflow-y-auto hide-scrollbar">
                {uniqueQuestionCodes.map((code, idx) => {
                  const answered = answeredMap.has(code);
                  return (
                    <div
                      key={code}
                      className={`flex items-center gap-2 sm:gap-3 min-w-[140px] sm:min-w-0 p-2 sm:p-3 rounded-lg transition-all shadow-sm border group cursor-pointer ${answered ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'}`}
                      tabIndex={0}
                      aria-label={answered ? `Pertanyaan ${idx + 1} sudah dijawab` : `Pertanyaan ${idx + 1} belum dijawab`}
                    >
                      {answered ? <CheckCircle className="text-green-500" size={20} /> : <Circle className="text-gray-400" size={20} />}
                      <span className={`font-medium truncate ${answered ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>Pertanyaan {idx + 1}</span>
                      <span className="text-xs text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition" title={`Kode: ${code}`}>({code})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
        <ChatLayout 
          messages={messages} 
          addMessage={addMessage} 
          updateLastMessage={updateLastMessage} 
        />
      </StyledBackground>
    );
  }

  // Fallback loading state
  return (
    <StyledBackground>
      <ChatLayout messages={messages} addMessage={addMessage} updateLastMessage={updateLastMessage} />
    </StyledBackground>
  );
};

export default SurveyChatbot;