import { motion } from "framer-motion";
import { Send, Square } from "lucide-react";
import ModeToggle from "./ModeToggle";

interface ChatInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  isDarkMode: boolean;
  mode: 'survey' | 'qa';
  setMode: React.Dispatch<React.SetStateAction<'survey' | 'qa'>>;
  botIsTyping: boolean;
  onSend: () => void;
  onStopGeneration: () => void;
  closeAllDropdowns: () => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  input,
  setInput,
  isDarkMode,
  mode,
  setMode,
  botIsTyping,
  onSend,
  onStopGeneration,
  closeAllDropdowns
}) => {
  const isSendButtonDisabled = !input.trim() || botIsTyping;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center">
          <ModeToggle mode={mode} setMode={setMode} isDarkMode={isDarkMode} />
        </div>

        {/* Input Field */}
        <div className={`flex items-center gap-2 
          ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/70'} 
          rounded-full pl-5 pr-2 py-3 border 
          ${isDarkMode ? 'border-gray-700/40' : 'border-white/60'} 
          focus-within:${isDarkMode ? 'border-blue-500/50' : 'border-blue-300'} 
          focus-within:ring-2 focus-within:${isDarkMode ? 'ring-blue-500/20' : 'ring-blue-100'} 
          backdrop-blur-md shadow-lg transition-all
          ${botIsTyping ? 'opacity-80' : 'opacity-100'}`}
          onClick={closeAllDropdowns}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder={botIsTyping ? "Tunggu chatbot membalas..." : mode === 'survey' ? "Ketik jawaban survei Anda..." : "Ketik pertanyaan Anda..."}
            className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-400'}`}
            disabled={botIsTyping} // Disable input when bot is typing
          />

          {/* Stop Button or Send Button */}
          {botIsTyping ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onStopGeneration}
              className={`p-3 rounded-full backdrop-blur-sm mr-2
                ${isDarkMode
                  ? 'bg-red-600/70 text-white border border-red-500/40 hover:bg-red-500/80'
                  : 'bg-red-500/80 text-white border border-red-400/40 hover:bg-red-400/90'}`}
              aria-label="Stop Generation"
            >
              <Square className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={!isSendButtonDisabled ? { scale: 1.1, rotate: 10 } : {}}
              onClick={onSend}
              disabled={isSendButtonDisabled}
              className={`p-3 rounded-full backdrop-blur-sm ${!isSendButtonDisabled
                ? isDarkMode
                  ? 'bg-blue-600/80 text-white border border-blue-500/40'
                  : 'bg-blue-500/90 text-white border border-blue-400/40'
                : isDarkMode
                  ? 'bg-gray-700/60 text-gray-400 border border-gray-600/30'
                  : 'bg-gray-200/80 text-gray-400 border border-gray-300/30'
                } transition-colors duration-200 ${!isSendButtonDisabled ? 'hover:bg-[#3b82f6cc] hover:text-white' : ''}`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Status indicator */}
        {botIsTyping && (
          <div className="text-center mt-1">
            <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Chatbot sedang mengetik...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-1">
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2025 Badan Pusat Statistik Republik Indonesia
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInputArea;