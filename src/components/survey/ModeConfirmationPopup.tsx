import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModeConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchMode: () => void;
  isDarkMode: boolean;
  countdown: number;
}

export default function ModeConfirmationPopup({
  isOpen,
  onClose,
  onSwitchMode,
  isDarkMode,
  countdown
}: ModeConfirmationPopupProps) {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSwitchRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(countdown);
      autoSwitchRef.current = false;
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Set flag for auto-switching but don't call the function directly
            autoSwitchRef.current = true;
            
            // Clear the interval
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, countdown]);

  // Separate useEffect to handle the auto-switch
  useEffect(() => {
    if (timeLeft === 0 && autoSwitchRef.current) {
      // Reset the flag
      autoSwitchRef.current = false;
      
      // Use setTimeout to avoid the "setState during render" error
      setTimeout(() => {
        onSwitchMode();
      }, 0);
    }
  }, [timeLeft, onSwitchMode]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        <motion.div 
          className={`relative w-full max-w-md rounded-xl shadow-xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header with progress bar */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / countdown) * 100}%` }}
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full flex-shrink-0 ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  className="w-6 h-6 text-blue-500"
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Anda sedang berada dalam mode Q&A</h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Dalam mode ini, Anda dapat menanyakan berbagai informasi umum. Apakah Anda ingin melanjutkan survei?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={onSwitchMode}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                    }`}
                  >
                    Pindah ke mode survei ({timeLeft}s)
                  </button>
                  
                  <button
                    onClick={onClose}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Tetap di mode Q&A
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}