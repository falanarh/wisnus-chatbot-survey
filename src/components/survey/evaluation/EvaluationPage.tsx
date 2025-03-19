"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/other/ProtectedRoute";
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
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 bg-[url('/img/grid-pattern-light.svg')] dark:bg-[url('/img/grid-pattern-dark.svg')]">
        {/* Header with progress bar */}
        <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
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

        <main className="flex-grow container mx-auto px-4 py-8 flex items-center">
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
    </ProtectedRoute>
  );
};

// export { EvaluationQuestion };
export default EvaluationPage;