import React from "react";
import { BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingProgressButtonProps {
  onClick: () => void;
  progress: number; // 0-100
}

const FloatingProgressButton: React.FC<FloatingProgressButtonProps> = ({ onClick, progress }) => {
  return (
    <div className="fixed z-40 left-[5%] md:left-[10%] lg:left-[15%] bottom-[136px] select-none">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center h-12 w-12 transition-all"
        aria-label="Lihat progress survei"
      >
        <BarChart2 className="w-6 h-6" />
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center shadow-md px-1.5">
          {progress}%
        </div>
      </motion.button>
    </div>
  );
};

export default FloatingProgressButton; 