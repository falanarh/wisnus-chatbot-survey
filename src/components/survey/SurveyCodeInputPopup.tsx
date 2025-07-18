import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getTutorialCompleted, setTutorialCompleted } from "@/utils/otherUtils";
import TutorialFlow from "../other/TutorialFlow";
// import Loader from "../other/Loader";

interface SurveyCodeInputPopupProps {
  open: boolean;
  onSubmit: (code: string) => Promise<void> | void;
  onClose?: () => void;
  errorMessage?: string;
}

const CODE_LENGTH = 5;

const SurveyCodeInputPopup: React.FC<SurveyCodeInputPopupProps> = ({
  open,
  onSubmit,
  onClose,
  errorMessage,
}) => {
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTutorialCompleteState, setIsTutorialCompleteState] = useState(
    getTutorialCompleted()
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCode("");
      setTouched(false);
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [open]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > CODE_LENGTH) value = value.slice(0, CODE_LENGTH);
    setCode(value);
    setTouched(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length === CODE_LENGTH) {
      setIsLoading(true);
      try {
        await onSubmit(code);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTouched(true);
    }
  };

  const handleTutorialFinish = () => {
    setTutorialCompleted(true);
    setIsTutorialCompleteState(true);
  };

  if (!isTutorialCompleteState) {
    return <TutorialFlow onFinish={handleTutorialFinish} />;
  }

  const handleClose = () => {
    if (onClose) onClose();
  };

  const isValid = code.length === CODE_LENGTH;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full p-7 relative"
          >
            {onClose && (
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                onClick={handleClose}
                aria-label="Tutup"
                type="button"
              >
                <X size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Masukkan Kode Survei
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Silakan masukkan kode unik survei 5 digit yang Anda terima.
            </p>
            <form onSubmit={handleSubmit} autoComplete="off">
              <input
                ref={inputRef}
                type="text"
                inputMode="text"
                pattern="[A-Z0-9]{5}"
                maxLength={CODE_LENGTH}
                className={`w-full text-center text-2xl tracking-widest font-mono rounded-lg border-2 px-4 py-3 mb-2 outline-none transition-all ${
                  isValid
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : touched && code.length > 0
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                }`}
                value={code}
                onChange={handleInput}
                autoFocus
                aria-label="Kode Survei"
                onBlur={() => setTouched(true)}
                disabled={isLoading}
              />
              <div className="h-5 mb-2">
                {errorMessage ? (
                  <span className="text-xs text-red-600 dark:text-red-400 block text-center">
                    {errorMessage}
                  </span>
                ) : touched && !isValid && code.length > 0 ? (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 block text-center">
                    Kode harus 5 karakter (A-Z, 0-9)
                  </span>
                ) : null}
              </div>
              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all text-base mt-1 flex items-center justify-center gap-2 ${
                  isValid && !isLoading
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isValid || isLoading}
              >
                {isLoading && (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
                {isLoading ? "Memproses..." : "Mulai Survei"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SurveyCodeInputPopup;
