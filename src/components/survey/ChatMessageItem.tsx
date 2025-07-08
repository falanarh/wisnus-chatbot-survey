//src/components/survey/ChatMessageItem.tsx

import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import ModeBadge from "./ModeBadge";
import { useEffect, useState } from "react";
import { WiMoonWaningCrescent4 } from "react-icons/wi";
import MessageLoader from "./MessageLoader";
import { ChatMessage } from "@/utils/surveyMessageFormatters";

interface ChatMessageItemProps {
  message: ChatMessage;
  isDarkMode: boolean;
  index: number;
  isAnimating?: boolean; // Flag untuk menunjukkan apakah pesan ini sedang dianimasikan
  isTokenAnimating?: boolean; // Flag untuk menunjukkan apakah pesan ini sedang dianimasikan token by token
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isDarkMode,
  isAnimating,
  isTokenAnimating = false,
}) => {
  const [timestamp, setTimestamp] = useState<string>(
    message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // Cursor blinking effect for token animation
  const [showCursor, setShowCursor] = useState<boolean>(true);

  // Set timestamp on first render if not already present
  useEffect(() => {
    if (!message.timestamp) {
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [message.timestamp]);

  // Blinking cursor effect when token animation is active
  useEffect(() => {
    if (isTokenAnimating) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [isTokenAnimating]);

  // Determine bubble colors
  const bubbleColor = message.user
    ? isDarkMode
      ? "#1D76F2" // iOS blue in dark mode
      : "#1A8AEF" // iOS blue in light mode
    : isDarkMode
      ? "#383838" // Dark gray for dark mode
      : "#FFFFFF"; // Light gray for light mode

  const textColor = message.user || isDarkMode
    ? "white"
    : "#000000";

  const timestampColor = message.user
    ? isDarkMode
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(0, 0, 0, 0.5)"
    : isDarkMode
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(0, 0, 0, 0.5)";

  // Determine which options to display
  const shouldShowOptions = !message.user &&
    message.options &&
    message.options.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-1.5 my-1.5 mx-2 ${message.user ? "justify-end" : "justify-start"}`}
    >
      {/* Message container */}
      <div className={`flex flex-col ${message.user ? "items-end" : "items-start"} md:max-w-[75%]`}>
        {/* Chat bubble */}
        <div
          style={{
            backgroundColor: bubbleColor,
            color: textColor,
          }}
          className={`px-4 py-3 text-sm break-words whitespace-pre-wrap shadow-sm text-justify 
            ${message.user
              ? "rounded-t-2xl rounded-bl-2xl rounded-br-lg"
              : "rounded-t-2xl rounded-br-2xl rounded-bl-lg"
            } relative`}
        >
          {message.loading ? (
            <div className="flex items-center justify-center py-1">
              <MessageLoader />
            </div>
          ) : (
            <>
              {!message.user && (
                <div className="mb-1">
                  <ModeBadge mode={message.mode} />
                </div>
              )}
              <p className="break-words whitespace-pre-wrap">
                {message.text}
                {/* Show blinking cursor during token animation */}
                {isTokenAnimating && showCursor && (
                  <span className="inline-block w-2 h-4 bg-current animate-pulse ml-0.5"></span>
                )}
              </p>

              {/* Display options if they should be shown */}
              {shouldShowOptions && message.questionCode === "KR004" && (
                <>
                  <p className="break-words whitespace-pre-wrap dark:text-white my-1">
                    Pilih salah satu opsi di bawah ini:
                  </p>
                  <ul className="space-y-1 my-2">
                    {message.options?.map((option, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: isAnimating ? index * 0.15 : 0 // Animasi hanya saat isAnimating = true
                        }}
                        className="flex items-start group rounded-lg p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      >
                        <span className="inline-flex w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 mr-3 mt-[6px] flex-shrink-0 shadow-sm"></span>
                        <span className="dark:text-white">{option}</span>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <div className={`absolute -bottom-0 -right-[35px] ${message.user ? "block" : "hidden"}`}>
            <div className="relative w-[50px] h-[25px] overflow-hidden">
              <WiMoonWaningCrescent4
                color={isDarkMode ? `#1D76F2` : `#1A8AEF`}
                className="absolute -rotate-[13deg]"
                size={50}
                style={{ top: "-19px" }} // Position icon higher to show bottom half
              />
            </div>
          </div>
          <div className={`absolute -bottom-0 -left-[35px] ${message.user ? "hidden" : "block"}`}>
            <div className="relative w-[50px] h-[25px] overflow-hidden">
              <WiMoonWaningCrescent4
                color={isDarkMode ? `#383838` : `#FFFFFF`}
                className="absolute rotate-[15deg] scale-x-[-1]"
                size={50}
                style={{ top: "-19px" }} // Position icon higher to show bottom half
              />
            </div>
          </div>
        </div>

        {/* Timestamp and read status */}
        {!message.loading && (
          <div
            style={{ color: timestampColor }}
            className="text-[10px] px-1 flex items-center mt-0.5"
          >
            <span>{timestamp}</span>
            {message.user && (
              <CheckCheck className="w-3 h-3 ml-1" style={{ color: timestampColor }} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessageItem;