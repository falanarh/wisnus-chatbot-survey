import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LikertScale from "./LikertScale";
import NavigationButtons from "./NavigationButtons";
import { EvaluationQuestion } from "@/services/survey/evaluation";

interface QuestionCardProps {
  question: EvaluationQuestion;
  selectedValue: number | string | undefined;
  onSelect: (value: number | string) => void;
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
  // State untuk melacak jumlah karakter
  const [charCount, setCharCount] = useState(0);
  const [charError, setCharError] = useState<string | null>(null);

  // Tambahkan efek untuk memperbarui jumlah karakter saat selectedValue berubah
  useEffect(() => {
    if (question.scaleType === "text" && typeof selectedValue === 'string') {
      const trimmedValue = selectedValue.trim();
      setCharCount(trimmedValue.length);

      // Validasi panjang minimal dan maksimal
      if (trimmedValue.length < (question.min || 10)) {
        setCharError(`Minimal ${question.min || 10} karakter`);
      } else if (trimmedValue.length > (question.max || 500)) {
        setCharError(`Maksimal ${question.max || 500} karakter`);
      } else {
        setCharError(null);
      }
    }
  }, [selectedValue, question.scaleType, question.min, question.max]);

  // Tentukan warna dan gaya untuk penghitung karakter
  const getCharCountColor = () => {
    const maxLength = question.max || 500;
    const minLength = question.min || 10;
    const remainingChars = maxLength - charCount;

    if (charCount < minLength) return 'text-red-500';
    if (remainingChars <= 50) return 'text-red-500';
    if (remainingChars <= 100) return 'text-yellow-500';
    return 'text-gray-500';
  };

  // Card color by question type
  const getGradientByType = (type: string) => {
    if (type === "agreement") {
      return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900";
    }
    if (type === "effort") {
      return "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900";
    }
    return "bg-gradient-to-br from-teal-50 to-green-50 dark:from-gray-800 dark:to-gray-900";
  };

  // Validasi apakah pertanyaan sudah terjawab
  const isQuestionAnswered =
    question.scaleType !== "text"
      ? selectedValue !== undefined
      : typeof selectedValue === 'string' &&
      selectedValue.trim().length >= (question.min || 10) &&
      selectedValue.trim().length <= (question.max || 500);

  // Render textarea khusus untuk pertanyaan terbuka
  const renderTextInput = () => {
    const maxLength = question.max || 1000;

    return (
      <div className="relative">
        <textarea
          value={selectedValue as string || ''}
          onChange={(e) => {
            // Potong input jika melebihi batas maksimal
            const truncatedValue = e.target.value.slice(0, maxLength);
            onSelect(truncatedValue);
          }}
          placeholder="Tuliskan pendapat Anda di sini..."
          rows={4}
          maxLength={maxLength}
          className={`
            w-full p-3 
            border 
            rounded-lg 
            focus:outline-none 
            focus:ring-2 
            ${charError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
            }
            dark:bg-gray-800 
            dark:text-white
          `}
        />
        {/* Tambahkan penghitung karakter dan error */}
        <div className="absolute bottom-2 right-2 flex flex-row-reverse justify-between items-center w-full">
          <span className={`text-xs ${getCharCountColor()}`}>
            {charCount} / {maxLength}
          </span>
          {charError && (
            <span className="text-xs text-red-500 mt-1 mb-1 ml-5">
              {charError}
            </span>
          )}
        </div>
      </div>
    );
  };

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

        {question.scaleType === "text" ? (
          renderTextInput()
        ) : (
          <LikertScale
            min={question.min}
            max={question.max}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
            scaleType={question.scaleType}
            selectedValue={selectedValue as number}
            onSelect={onSelect}
          />
        )}

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          isQuestionAnswered={isQuestionAnswered && !charError}
          isSubmitting={isSubmitting}
          charError={question.scaleType === "text" ? charError : undefined} // Tambahkan ini
        />
      </div>
    </motion.div>
  );
};

export default QuestionCard;