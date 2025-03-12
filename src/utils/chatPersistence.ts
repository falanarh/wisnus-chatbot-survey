// src/utils/chatPersistence.ts
import { useState, useEffect } from "react";

// Tipe untuk pesan chat
export interface ChatMessage {
  text: string;
  user: boolean;
  loading?: boolean;
}

// Kunci untuk penyimpanan dalam localStorage
const CHAT_STORAGE_KEY = "wisnus_chat_history";

// Hook sederhana untuk persistensi chat
export function useChatPersistence() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chat history saat komponen dimount
  useEffect(() => {
    loadChatHistory();
    setIsLoaded(true);
  }, []);

  // Simpan chat history ke localStorage setiap kali messages berubah
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages, isLoaded]);

  // Simpan pesan-pesan ke localStorage
  const saveChatHistory = (chatMessages: ChatMessage[]) => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Muat pesan-pesan dari localStorage
  const loadChatHistory = () => {
    try {
      const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Menambahkan pesan baru
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Update pesan terakhir (digunakan untuk loading state dan stopbot)
  const updateLastMessage = (text: string, isUser: boolean) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        // Cari pesan terakhir dari bot
        const lastBotIndex = newMessages.length - 1;
        if (newMessages[lastBotIndex] && newMessages[lastBotIndex].user === isUser) {
          newMessages[lastBotIndex] = {
            ...newMessages[lastBotIndex],
            text,
            loading: false
          };
        }
      }
      return newMessages;
    });
  };

  // Bersihkan semua pesan
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  return {
    messages,
    addMessage,
    updateLastMessage,
    clearChat,
    isLoaded
  };
}