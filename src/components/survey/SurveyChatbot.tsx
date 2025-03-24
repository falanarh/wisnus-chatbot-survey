"use client";

import React from "react";
import SurveyCompletionPage from "@/components/survey/SurveyCompletionPage";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import ChatLayout from "./ChatLayout";
import Loader from "../other/Loader";
import { useSurveyMessages } from "@/hooks/useSurveyMessages";

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
    // Otherwise show the chat interface for active survey
    return (
      <StyledBackground>
        <ChatLayout 
          messages={messages} 
          addMessage={addMessage} 
          updateLastMessage={updateLastMessage} 
          sessionId={sessionData?.session_id}
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