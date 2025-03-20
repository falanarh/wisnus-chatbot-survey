"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { evaluationQuestions } from "./constants";
import CompletionScreen from "./CompletionScreen";
import QuestionHeader from "./QuestionHeader";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import Footer from "./Footer";

const EvaluationPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = evaluationQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === evaluationQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (value: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here we would typically send the data to an API
      console.log("Submitting evaluation:", answers);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Terjadi kesalahan saat mengirim evaluasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return <CompletionScreen />;
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
            totalQuestions={evaluationQuestions.length}
          />
          <ProgressBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={evaluationQuestions.length}
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center relative z-10">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedValue={answers[currentQuestion.id]}
            onSelect={handleAnswerSelect}
            onPrevious={goToPreviousQuestion}
            onNext={goToNextQuestion}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
          />
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default EvaluationPage;