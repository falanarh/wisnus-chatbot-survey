// src/components/survey/evaluation/CompletionScreen.tsx
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CompletionScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 bg-[url('/img/grid-pattern-light.svg')] dark:bg-[url('/img/grid-pattern-dark.svg')]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
        <div className="p-8 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
          >
            <Check size={42} className="text-white" />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Terima Kasih!
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-8"
          >
            Evaluasi Anda telah berhasil dikirim. Tanggapan Anda sangat berharga untuk peningkatan kualitas survei kami.
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => window.location.href = '/survey'}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Kembali ke Survei
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletionScreen;