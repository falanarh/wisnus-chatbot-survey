// src/components/survey/evaluation/ProgressBar.tsx

import React from "react";

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentQuestionIndex, 
  totalQuestions 
}) => {
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
  
  return (
    <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <div className="w-full flex justify-between px-1 z-10">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mt-0 transition-all duration-300 ${
              index <= currentQuestionIndex 
                ? 'bg-white' 
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;