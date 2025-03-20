// src/components/survey/evaluation/QuestionCard.tsx
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import LikertScale from "./LikertScale";
import NavigationButtons from "./NavigationButtons";

export interface EvaluationQuestion {
  id: string;
  text: string;
  scaleType: "agreement" | "effort";
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  icon: ReactNode;
  description: string;
}

interface QuestionCardProps {
  question: EvaluationQuestion;
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedValue,
  onSelect,
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
}) => {
  // Card color by question type
  const getGradientByType = (type: string) => {
    if (type === "agreement") {
      return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900";
    }
    return "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900";
  };

  const isQuestionAnswered = selectedValue !== undefined;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`w-full max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden ${getGradientByType(question.scaleType)}`}
    >
      <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm mr-3">
            {question.icon}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {question.description}
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {question.text}
        </h2>

        <LikertScale
          min={question.min}
          max={question.max}
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
          scaleType={question.scaleType}
          selectedValue={selectedValue}
          onSelect={onSelect}
        />

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          isQuestionAnswered={isQuestionAnswered}
          isSubmitting={isSubmitting}
        />
      </div>
    </motion.div>
  );
};

export default QuestionCard;