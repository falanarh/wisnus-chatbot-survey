// src/components/survey/ChatMessageArea.tsx

import { RefObject } from "react";
import { AnimatePresence } from "framer-motion";
import EmptyStateMessage from "./EmptyStateMessage";
import ChatMessageItem from "./ChatMessageItem";
import { ChatMessage } from "@/utils/surveyMessageFormatters";
import { Question } from "@/services/survey/types";

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  isDarkMode: boolean;
  mode: 'survey' | 'qa';
  messagesEndRef: RefObject<HTMLDivElement | null>;
  chatContainerRef: RefObject<HTMLDivElement | null>;
  closeAllDropdowns: () => void;
  visibleOptions: Record<string, string[]>; // Options yang terlihat untuk setiap ID pesan
  animatingMessageId: string | null; // ID pesan yang sedang dianimasikan
  currentQuestion?: Question;
  // Add animatingText prop
  animatingText: Record<string, string>;
}

const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  isDarkMode,
  mode,
  messagesEndRef,
  chatContainerRef,
  closeAllDropdowns,
  visibleOptions,
  animatingMessageId,
  animatingText
}) => {
  return (
    <div
      ref={chatContainerRef}
      className={`w-full mx-auto overflow-x-hidden overflow-y-auto ${messages.length === 0 ? 'h-[87vh]' : 'h-[calc(100vh-200px)]'} flex justify-center z-10`}
      onClick={closeAllDropdowns}
    >
      {messages.length === 0 ? (
        <EmptyStateMessage isDarkMode={isDarkMode} mode={mode} />
      ) : (
        <AnimatePresence>
          <div className="max-w-4xl w-full px-6 md:px-8 lg:px-10 overflow-x-hidden md:overflow-x-visible">
            {messages.map((msg, index) => {
              // Gunakan opsi dari visibleOptions jika pesan ini sedang dianimasikan
              const messageOptions = msg.id && visibleOptions[msg.id] 
                ? visibleOptions[msg.id] 
                : msg.options || [];

              // Cek apakah pesan ini sedang dianimasikan tokennya
              const isTokenAnimating = Boolean(msg.id) && animatingText[msg.id] !== undefined;
              
              // Gunakan teks animasi jika ada, atau teks asli jika tidak
              const displayText = isTokenAnimating 
                ? animatingText[msg.id] 
                : msg.text;

              // Buat salinan pesan dengan opsi yang terlihat dan teks yang sedang dianimasikan
              const messageWithVisibleOptions = {
                ...msg,
                options: messageOptions,
                text: displayText
              };

              return (
                <div key={`message-wrapper-${msg.id || index}`}>
                  {index === 0 && (
                    <div className="h-5" key={`spacer-top-${index}`}></div>
                  )}
                  {/* Tampilkan pesan meskipun textnya kosong jika sedang animasi token */}
                  {(msg.text || isTokenAnimating || msg.loading) && (
                    <ChatMessageItem
                      message={messageWithVisibleOptions}
                      isDarkMode={isDarkMode}
                      index={index}
                      isAnimating={msg.id === animatingMessageId}
                      isTokenAnimating={isTokenAnimating}
                    />
                  )}
                  {index === messages.length - 1 && (
                    <div className="h-20" key={`spacer-bottom-${index}`}></div>
                  )}
                </div>
              );
            })}
            
            {/* Target for scrolling */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatMessageArea;