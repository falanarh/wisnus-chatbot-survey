import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessToastProps {
  open: boolean;
  message: string;
  onClose?: () => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ open, message }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <div className="bg-green-500 text-white px-3 md:px-5 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="font-medium text-sm pr-2">{message}</span>
            {/* {onClose && (
              <button onClick={onClose} className="ml-2 text-white/80 hover:text-white text-xs">Tutup</button>
            )} */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast; 