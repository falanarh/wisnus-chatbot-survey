"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CompletionScreen from "./CompletionScreen";
import QuestionHeader from "./QuestionHeader";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import Footer from "./Footer";
import { getUserData } from "@/services/auth";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import Loader from "@/components/other/Loader";

const EvaluationPage: React.FC = () => {
  const router = useRouter();
  // Get session ID from user data if available
  const userData = getUserData();
  const sessionId = userData?.activeSurveySessionId;
  
  // Use the survey status hook to check if survey is completed
  const { isLoading: isStatusLoading, sessionData } = useSurveyStatus(true);
  
  // Redirect countdown state
  const [countdown, setCountdown] = useState(10);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);

  // Check if survey is completed and setup redirect timer if needed
  useEffect(() => {
    if (!isStatusLoading) {
      const shouldRedirect = !sessionData || sessionData.status !== "COMPLETED";
      setShowRedirectPopup(shouldRedirect);
      
      let timer: NodeJS.Timeout;
      if (shouldRedirect) {
        timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              // Move the navigation outside the state update function
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [isStatusLoading, sessionData]);
  
  // Separate effect to handle the navigation
  useEffect(() => {
    if (countdown === 0 && showRedirectPopup) {
      router.push("/survey");
    }
  }, [countdown, router, showRedirectPopup]);

  const {
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    isSubmitting,
    error,
    isComplete,
    questions,
    submitQuestionAnswer,
    goToPreviousQuestion
  } = useEvaluation({ sessionId });

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Keep track of currently selected value before submitting
  const [selectedValue, setSelectedValue] = useState<number | string | undefined>(undefined);

  // Handle answer selection for both numeric and text inputs
  const handleAnswerSelect = (value: number | string) => {
    // We don't need to update local state since useEvaluation handles this
    // Just storing the selected value temporarily until "Next" is clicked
    setSelectedValue(value);
  };

  // Reset selected value when question changes
  React.useEffect(() => {
    // Check if currentQuestion exists and has an id before accessing
    if (currentQuestion && currentQuestion.id) {
      // Use the answers from the evaluation hook if available
      const currentValue = currentQuestion.value; // Already undefined if not present
      setSelectedValue(currentValue);
    }
  }, [currentQuestion]);

  const handleNext = () => {
    if (selectedValue !== undefined && currentQuestion) {
      submitQuestionAnswer(currentQuestion.id, selectedValue);
    }
  };

  const handleRedirectNow = () => {
    router.push("/survey");
  };

  if (isStatusLoading || isLoading) {
    return (
      <div className="flex min-h-screen relative">
        {/* Background Layer */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 dark:bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        {/* Centered Loader */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Sedang memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <CompletionScreen />;
  }

  if (!currentQuestion) {
    return null; // Or a better fallback UI
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Header with progress bar */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-5">
          <QuestionHeader
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <ProgressBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center relative z-10">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedValue={selectedValue}
            onSelect={handleAnswerSelect}
            onPrevious={goToPreviousQuestion}
            onNext={handleNext}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
          />
        </AnimatePresence>
      </main>

      <Footer />

      {/* Redirect Popup */}
      {showRedirectPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-4 sm:mx-auto"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Anda belum menyelesaikan survei Wisnus</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Anda harus menyelesaikan survei Wisantara Nusantara sebelum dapat mengakses halaman evaluasi. 
                Anda akan dialihkan ke halaman survei dalam <span className="font-bold">{countdown}</span> detik.
              </p>
              <button 
                onClick={handleRedirectNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Lanjutkan ke Survei Sekarang
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPage;