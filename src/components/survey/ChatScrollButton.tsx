import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface ChatScrollButtonProps {
  show: boolean;
  isDarkMode: boolean;
  onClick: () => void;
}

const ChatScrollButton: React.FC<ChatScrollButtonProps> = ({
  show,
  isDarkMode,
  onClick
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className={`fixed bottom-40 right-8 z-40 p-2 rounded-full shadow-lg
            ${isDarkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40'
              : 'bg-blue-500 hover:bg-blue-400 text-white border border-blue-400/40'} 
            backdrop-blur-sm transition-all duration-300`}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ChatScrollButton;