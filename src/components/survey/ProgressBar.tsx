import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, leftLabel, rightLabel, className }) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        {leftLabel && (
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">{leftLabel}</span>
        )}
        {rightLabel && (
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{rightLabel}</span>
        )}
      </div>
      <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${value}%` }}
          aria-label={`Progress: ${value}%`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar; 