import React from "react";
import { BarChart2 } from "lucide-react";

interface FloatingProgressButtonProps {
  onClick: () => void;
}

const FloatingProgressButton: React.FC<FloatingProgressButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed z-40 right-5 bottom-[136px] md:bottom-24 md:right-10 flex flex-col items-center gap-1 select-none">
      <button
        className="mb-0.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-800/80 text-blue-700 dark:text-blue-200 font-semibold text-[11px] shadow-md border border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ letterSpacing: ".01em" }}
        aria-label="Lihat progress survei"
        onClick={onClick}
      >
        Cek progress
      </button>
      <button
        className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-xl p-2.5 md:p-3 hover:scale-110 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 border-white dark:border-gray-900"
        aria-label="Lihat progress survei"
        onClick={onClick}
        style={{ minWidth: 36, minHeight: 36 }}
      >
        <BarChart2 size={20} className="md:w-7 md:h-7 w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingProgressButton; 