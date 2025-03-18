"use client";

import React from "react";
import ChatLayout from "@/components/ChatLayout";
import SurveyCompletionPage from "@/components/SurveyCompletionPage";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";

const SurveyChatbot: React.FC = () => {
  const { isLoading, error, sessionData, refreshStatus } = useSurveyStatus();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state if API call fails
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-lg max-w-md">
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
    );
  }

  // Show completion page if survey is completed
  if (sessionData?.status === 'COMPLETED') {
    return <SurveyCompletionPage sessionData={sessionData} />;
  }

  // Otherwise show the chat interface for active survey
  return <ChatLayout />;
};

export default SurveyChatbot;