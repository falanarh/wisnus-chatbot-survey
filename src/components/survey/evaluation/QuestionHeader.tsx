// src/components/survey/evaluation/QuestionHeader.tsx

import React from "react";

interface QuestionHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-md mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
            <path d="m9 22 6-6" />
            <path d="m15 20 2 2 4-4" />
            <path d="M7 8h10" />
            <path d="M7 12h4" />
          </svg>
        </span>
        Evaluasi Survei
      </h1>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
        {currentQuestionIndex + 1} dari {totalQuestions}
      </span>
    </div>
  );
};

export default QuestionHeader;