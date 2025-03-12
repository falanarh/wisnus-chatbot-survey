// import { Dispatch, SetStateAction } from 'react';
// import { motion } from 'framer-motion';

// interface ModeToggleProps {
//   mode: 'survey' | 'qa';
//   setMode: Dispatch<SetStateAction<'survey' | 'qa'>>;
//   isDarkMode?: boolean; // Add this to support dark mode styling
// }

// const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode, isDarkMode = false }) => {
//   const toggleMode = () => {
//     setMode((prevMode) => (prevMode === 'survey' ? 'qa' : 'survey'));
//   };

//   return (
//     <div className="flex items-center justify-center p-4">
//       <div className={`relative flex items-center w-48 h-12 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-full shadow-lg`}>
//         <motion.div
//           className={`absolute w-24 h-10 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-full`}
//           initial={false}
//           animate={{
//             x: mode === 'survey' ? 1 : 'calc(100% - 0.25rem)'
//           }}
//           transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//         />
//         <button
//           onClick={() => setMode('survey')}
//           className={`relative z-10 w-1/2 text-center text-sm font-semibold ${
//             mode === 'survey' 
//               ? 'text-white' 
//               : isDarkMode ? 'text-gray-300' : 'text-gray-700'
//           }`}
//         >
//           Survey
//         </button>
//         <button
//           onClick={() => setMode('qa')}
//           className={`relative z-10 w-1/2 text-center text-sm font-semibold ${
//             mode === 'qa' 
//               ? 'text-white' 
//               : isDarkMode ? 'text-gray-300' : 'text-gray-700'
//           }`}
//         >
//           Q&A
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ModeToggle;

// import { Dispatch, SetStateAction } from 'react';
// import { ClipboardList, MessageCircleQuestion } from 'lucide-react';

// interface ModeToggleProps {
//   mode: 'survey' | 'qa';
//   setMode: Dispatch<SetStateAction<'survey' | 'qa'>>;
//   isDarkMode?: boolean;
// }

// const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode, isDarkMode = false }) => {
//   return (
//     <div className="flex items-center justify-center">
//       <div className={`flex items-center w-[200px] rounded-lg
//         ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
//         <button
//           onClick={() => setMode('survey')}
//           className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all w-1/2
//             ${mode === 'survey' 
//               ? isDarkMode 
//                 ? 'bg-gray-700 text-blue-400' 
//                 : 'bg-white text-blue-600 shadow-sm' 
//               : isDarkMode 
//                 ? 'text-gray-400'
//                 : 'text-gray-500'
//             }`}
//         >
//           <ClipboardList size={16} />
//           <span>Survey</span>
//         </button>
//         <button
//           onClick={() => setMode('qa')}
//           className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all w-1/2
//             ${mode === 'qa' 
//               ? isDarkMode 
//                 ? 'bg-gray-700 text-blue-400' 
//                 : 'bg-white text-blue-600 shadow-sm' 
//               : isDarkMode 
//                 ? 'text-gray-400'
//                 : 'text-gray-500'
//             }`}
//         >
//           <MessageCircleQuestion size={16} />
//           <span>Q&A</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ModeToggle;

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