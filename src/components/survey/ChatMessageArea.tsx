import { RefObject } from "react";
import { AnimatePresence } from "framer-motion";
import EmptyStateMessage from "./EmptyStateMessage";
import ChatMessageItem from "./ChatMessageItem";
import { ChatMessage } from "@/utils/surveyMessageFormatters";

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  isDarkMode: boolean;
  mode: 'survey' | 'qa';
  messagesEndRef: RefObject<HTMLDivElement | null>;
  chatContainerRef: RefObject<HTMLDivElement | null>;
  closeAllDropdowns: () => void;
}

const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  isDarkMode,
  mode,
  messagesEndRef,
  chatContainerRef,
  closeAllDropdowns
}) => {
  return (
    <div
      ref={chatContainerRef}
      className={`w-full mx-auto overflow-y-auto ${messages.length === 0 ? 'h-[87vh]' : 'h-[calc(100vh-210px)]'} flex justify-center z-10`}
      onClick={closeAllDropdowns}
    >
      {messages.length === 0 ? (
        <EmptyStateMessage isDarkMode={isDarkMode} mode={mode} />
      ) : (
        <AnimatePresence>
          <div className="max-w-4xl w-full px-6 md:px-4 overflow-x-hidden md:overflow-x-visible">
            {messages.map((msg, index) => (
              <div key={`message-wrapper-${index}`}>
                {index === 0 && (
                  <div className="h-5" key={`spacer-top-${index}`}></div>
                )}
                {msg.text && (
                  <ChatMessageItem
                    message={msg}
                    isDarkMode={isDarkMode}
                    index={index}
                  />
                )}
                {index === messages.length - 1 && (
                  <div className="h-20" key={`spacer-bottom-${index}`}></div>
                )}
              </div>
            ))}
            {/* Target for scrolling */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatMessageArea;