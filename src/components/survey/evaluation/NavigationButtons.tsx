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
  charError?: string | null; // Tambahkan prop untuk error karakter
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isQuestionAnswered,
  isSubmitting,
  charError, // Tambahkan parameter baru
}) => {
  // Tombol selanjutnya akan dinonaktifkan jika:
  // 1. Pertanyaan belum terjawab, ATAU
  // 2. Sedang mengirim, ATAU
  // 3. Ada error karakter
  const isNextButtonDisabled = 
    !isQuestionAnswered || 
    isSubmitting || 
    !!charError; // Tambahkan pengecekan error karakter

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
        disabled={isNextButtonDisabled} // Gunakan kondisi baru
        className={`flex items-center px-6 py-2 rounded-lg shadow-sm ${
          !isNextButtonDisabled
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        ) : null}
        {isLastQuestion ? "Kirim" : "Selanjutnya"}
        {!isLastQuestion && <ChevronRight size={20} className="ml-1" />}
      </motion.button>
    </div>
  );
};

export default NavigationButtons;