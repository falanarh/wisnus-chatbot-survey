"use client";

import { Dispatch, SetStateAction } from 'react';
import { ClipboardList, MessageCircleQuestion } from 'lucide-react';

interface ModeToggleProps {
  mode: 'survey' | 'qa';
  setMode: Dispatch<SetStateAction<'survey' | 'qa'>>;
  isDarkMode?: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode, isDarkMode = false }) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`flex items-center w-[200px] rounded-lg
        ${isDarkMode ? 'bg-gray-800/70' : 'bg-gray-100/80'} backdrop-blur-sm`}>
        <button
          onClick={() => setMode('survey')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all w-1/2
            ${mode === 'survey' 
              ? isDarkMode 
                ? 'bg-gray-700/80 text-blue-400' 
                : 'bg-white/90 text-blue-600 shadow-sm' 
              : isDarkMode 
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <ClipboardList size={16} />
          <span>Survey</span>
        </button>
        <button
          onClick={() => setMode('qa')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all w-1/2
            ${mode === 'qa' 
              ? isDarkMode 
                ? 'bg-gray-700/80 text-blue-400' 
                : 'bg-white/90 text-blue-600 shadow-sm' 
              : isDarkMode 
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <MessageCircleQuestion size={16} />
          <span>Q&A</span>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;