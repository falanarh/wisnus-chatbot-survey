"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface AnimatedInputProps {
  onSend: (message: string) => void;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ onSend }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxHeight = 100; // Tinggi maksimum sebelum scroll muncul

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height agar ukurannya menyesuaikan
      const newHeight = textareaRef.current.scrollHeight;
      
      // Jika tinggi lebih kecil dari maxHeight, biarkan bertambah
      // Jika melebihi maxHeight, set ke maxHeight dan aktifkan scroll
      textareaRef.current.style.height = `${Math.min(newHeight, maxHeight)}px`;
      textareaRef.current.style.overflowY = newHeight > maxHeight ? "auto" : "hidden";
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSendMessage = () => {
    if (text.trim() !== "") {
      onSend(text);
      setText(""); // Kosongkan textarea setelah mengirim pesan
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full my-5">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        className="w-full p-3 pr-12 border rounded-lg resize-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 custom-scrollbar"
        placeholder="Tulis sesuatu..."
      />
      <motion.button
        whileHover={{ scale: 1.2, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-3 top-3 text-blue-500 hover:text-blue-700"
        onClick={handleSendMessage}
      >
        <Send size={24} />
      </motion.button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #60a5fa;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default AnimatedInput;
