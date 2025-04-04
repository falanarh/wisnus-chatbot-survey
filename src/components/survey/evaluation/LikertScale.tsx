import React from "react";
import { motion } from "framer-motion";

interface LikertScaleProps {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  scaleType: "agreement" | "effort" | "text";
  selectedValue: number | string | undefined;
  onSelect: (value: number | string) => void;
}

const LikertScale: React.FC<LikertScaleProps> = ({
  min,
  max,
  minLabel,
  maxLabel,
  scaleType,
  selectedValue,
  onSelect,
}) => {
  // Dynamic background color based on value position
  const getBgColor = (value: number) => {
    const normalizedValue = (value - min) / (max - min);
    
    if (scaleType === "agreement") {
      if (normalizedValue < 0.33) return "bg-gradient-to-b from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30";
      if (normalizedValue < 0.66) return "bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30";
      return "bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30";
    } else {
      // Effort scale
      if (normalizedValue < 0.33) return "bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30";
      if (normalizedValue < 0.66) return "bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30";
      return "bg-gradient-to-b from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30";
    }
  };

  // Selected style based on value 
  const getSelectedStyle = (value: number) => {
    const normalizedValue = (value - min) / (max - min);
    
    if (scaleType === "agreement") {
      if (normalizedValue < 0.33) return "bg-red-500 ring-red-300 dark:ring-red-500/30";
      if (normalizedValue < 0.66) return "bg-yellow-500 ring-yellow-300 dark:ring-yellow-500/30";
      return "bg-green-500 ring-green-300 dark:ring-green-500/30";
    } else {
      // Effort scale
      if (normalizedValue < 0.33) return "bg-green-500 ring-green-300 dark:ring-green-500/30";
      if (normalizedValue < 0.66) return "bg-yellow-500 ring-yellow-300 dark:ring-yellow-500/30";
      return "bg-red-500 ring-red-300 dark:ring-red-500/30";
    }
  };

  // If scale type is text, return null
  if (scaleType === "text") {
    return null;
  }

  // Calculate number of buttons
  const numButtons = max - min + 1;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span className="flex items-center font-medium">
          <span className="w-2 h-2 rounded-full bg-red-400 mr-1.5"></span>
          {minLabel}
        </span>
        <span className="flex items-center font-medium">
          {maxLabel}
          <span className="w-2 h-2 rounded-full bg-green-400 ml-1.5"></span>
        </span>
      </div>

      {/* Center-aligned button container */}
      <div className="flex justify-center">
        <div className={`grid grid-flow-col gap-1.5 md:gap-2 auto-cols-fr ${
          // Set fixed width based on number of buttons
          numButtons === 7 ? 'w-full max-w-2xl' : 'w-full max-w-3xl'
        }`}>
          {Array.from({ length: numButtons }).map((_, index) => {
            const value = min + index;
            const isSelected = selectedValue === value;
            
            return (
              <motion.button
                key={value}
                onClick={() => onSelect(value)}
                whileTap={{ scale: 0.95 }}
                className={`relative h-16 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                  isSelected
                    ? `${getSelectedStyle(value)} text-white ring-2 ring-offset-2 dark:ring-offset-gray-900`
                    : `${getBgColor(value)} hover:brightness-105 dark:hover:brightness-125 text-gray-800 dark:text-gray-200`
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center font-bold">
                  {value}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {scaleType === "agreement" ? "Sangat Tidak Setuju" : "Sangat Rendah"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {scaleType === "agreement" ? "Netral" : "Sedang"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {scaleType === "agreement" ? "Sangat Setuju" : "Sangat Tinggi"}
        </div>
      </div>
    </div>
  );
};

export default LikertScale;