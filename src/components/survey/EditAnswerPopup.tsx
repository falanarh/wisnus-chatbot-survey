import React from "react";
import { X, Send } from "lucide-react";
import { motion } from "framer-motion";

interface EditAnswerPopupProps {
  open: boolean;
  onClose: () => void;
  messages: Array<{
    id: string;
    text: string;
    user: boolean;
  }>;
  loading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  editingQuestion?: {
    displayNumber: number;
    question_code: string;
  } | null;
}

const EditAnswerPopup: React.FC<EditAnswerPopupProps> = ({
  open,
  onClose,
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  editingQuestion,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Edit Jawaban
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pertanyaan {editingQuestion?.displayNumber} • {editingQuestion?.question_code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.user
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center gap-2 
            bg-gray-100/90 dark:bg-gray-700/90 
            rounded-full pl-5 pr-2 py-3 border 
            border-gray-300/60 dark:border-gray-600/60 
            focus-within:border-blue-400 dark:focus-within:border-blue-400 
            focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 
            backdrop-blur-md shadow-lg transition-all
            ${loading ? 'opacity-80' : 'opacity-100'}`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend()}
              placeholder={loading ? "Memperbarui jawaban..." : "Ketik jawaban baru Anda..."}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />

            {/* Send Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={!loading && input.trim() ? { scale: 1.1, rotate: 10 } : {}}
              onClick={onSend}
              disabled={!input.trim() || loading}
              className={`p-3 rounded-full backdrop-blur-sm ${!loading && input.trim()
                ? 'bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-400 dark:hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 border border-gray-400 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-500'
              } transition-colors duration-200`}
              aria-label="Kirim jawaban baru"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Status indicator */}
          {loading && (
            <div className="text-center mt-2">
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Memperbarui jawaban...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAnswerPopup; 