import { RefObject } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/utils/chatPersistence";
import EmptyStateMessage from "./EmptyStateMessage";
import ChatMessageItem from "./ChatMessageItem";

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
      className={`w-full mx-auto overflow-y-auto ${messages.length === 0 ? 'h-[87vh]' : 'h-[calc(100vh-210px)]'} flex justify-center`}
      onClick={closeAllDropdowns}
    >
      {messages.length === 0 ? (
        <EmptyStateMessage isDarkMode={isDarkMode} mode={mode} />
      ) : (
        <AnimatePresence>
          <div className="max-w-4xl w-full px-4 pb-[180px]">
            {messages.map((msg, index) => (
              <ChatMessageItem
                key={index}
                message={msg}
                isDarkMode={isDarkMode}
                index={index}
              />
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