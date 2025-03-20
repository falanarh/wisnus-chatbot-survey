// src/components/survey/evaluation/NavigationButtons.tsx

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isQuestionAnswered: boolean;
  isSubmitting: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isQuestionAnswered,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-between">
      <motion.button
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`flex items-center px-4 py-2 rounded-lg ${
          isFirstQuestion
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
        }`}
      >
        <ChevronLeft size={20} className="mr-1" />
        Sebelumnya
      </motion.button>

      <motion.button
        whileHover={{ x: isLastQuestion ? 0 : 3 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={!isQuestionAnswered || isSubmitting}
        className={`flex items-center px-6 py-2 rounded-lg shadow-sm ${
          isQuestionAnswered && !isSubmitting
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        ) : null}
        {isLastQuestion ? "Kirim Evaluasi" : "Selanjutnya"}
        {!isLastQuestion && <ChevronRight size={20} className="ml-1" />}
      </motion.button>
    </div>
  );
};

export default NavigationButtons;