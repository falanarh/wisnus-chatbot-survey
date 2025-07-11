import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

interface AutoNavigatePopupProps {
  secondsLeft: number;
  onStay: () => void;
  onNavigate: () => void;
}

const AutoNavigatePopup: React.FC<AutoNavigatePopupProps> = ({
  secondsLeft,
  onStay,
  onNavigate,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative overflow-hidden"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(secondsLeft / 10) * 100}%` }}
        />
      </div>

      <div className="text-center mb-6 mt-2">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Navigasi Otomatis
        </h3>

        <p className="text-gray-600 dark:text-gray-300">
          Anda akan dialihkan ke halaman evaluasi dalam <span className="font-bold text-blue-600 dark:text-blue-400">{secondsLeft}</span> detik
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onStay}
          className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg
                    text-gray-700 dark:text-gray-300 font-medium
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Tetap di Halaman Ini
        </button>

        <button
          onClick={onNavigate}
          className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2
                    bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium
                    hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <span>Evaluasi Sekarang</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default AutoNavigatePopup;