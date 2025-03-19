import { motion } from "framer-motion";
import { Bot, Loader2, User } from "lucide-react";
import { ChatMessage } from "@/utils/chatPersistence";
import ModeBadge from "./ModeBadge";


interface ChatMessageItemProps {
  message: ChatMessage;
  isDarkMode: boolean;
  index: number;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 my-4 ${message.user ? "justify-end" : "justify-start"}`}
    >
      {!message.user && (
        <div className={`flex-shrink-0 
            ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100/70'} 
            rounded-full p-2 backdrop-blur-sm border 
            ${isDarkMode ? 'border-blue-800/40' : 'border-blue-200/40'}`}>
          <Bot className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
        </div>
      )}

      <div
        className={`max-w-[75%] p-3 md:p-4 rounded-2xl shadow-lg text-sm break-words whitespace-pre-wrap overflow-hidden backdrop-blur-sm
            ${message.user
              ? isDarkMode
                ? "bg-indigo-600/50 border border-indigo-500/40 text-white rounded-tr-none"
                : "bg-gradient-to-br from-blue-500/80 to-blue-600/80 border border-blue-400/30 text-white rounded-tr-none"
              : isDarkMode
                ? "bg-gray-800/40 border border-gray-700/40 text-white rounded-tl-none"
                : "bg-white/60 border border-white/50 text-gray-700 rounded-tl-none"
            }`}
      >
        {message.loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
        ) : (
          <>
            {!message.user && (<ModeBadge mode={message.mode} />)}
            <p className="break-words whitespace-pre-wrap text-justify">{message.text}</p>
          </>
        )}
      </div>

      {message.user && (
        <div className={`flex-shrink-0 
            ${isDarkMode ? 'bg-indigo-600/60' : 'bg-blue-500/80'} 
            rounded-full p-2 backdrop-blur-sm border 
            ${isDarkMode ? 'border-indigo-500/40' : 'border-blue-400/40'}`}>
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;