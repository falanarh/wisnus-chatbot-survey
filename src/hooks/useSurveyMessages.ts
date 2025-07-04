// src/hooks/useSurveyMessages.ts
import { useState, useEffect } from "react";
import { getSurveyMessages } from "@/services/survey";
import { getUserData } from "@/services/auth";
import {  
  ChatMessage,
  convertApiMessagesToChatMessages,
  formatSurveyResponse 
} from "@/utils/surveyMessageFormatters";
import { addSurveyMessage } from "@/services/survey/surveyMessages";
import { SurveyMessageRequest } from "@/services/survey/types";

// (localStorage chat history utilities removed as no longer used)

export function useSurveyMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load active user ID when component mounts
  useEffect(() => {
    const userData = getUserData();
    if (userData?._id) {
      setUserId(userData._id);
    }
    setIsLoaded(true);
  }, []);

  // Load chat history from DB or localStorage
  useEffect(() => {
    if (!isLoaded) return;

    async function loadChatHistory() {
      setIsLoading(true);
      setError(null);

      try {
        // Always load from DB
        const response = await getSurveyMessages();
          if (response.success && response.data) {
            const convertedMessages = convertApiMessagesToChatMessages(response.data);
          if (convertedMessages.length === 0) {
            // Add and persist opening message if chat is empty
            const openingText = "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi tentang profil wisatawan nusantara, maksud perjalanan, akomodasi yang digunakan, lama perjalanan, dan rata-rata pengeluaran terkait perjalanan yang dilakukan oleh penduduk Indonesia di dalam wilayah teritorial Indonesia.\n\nSebelum memulai, apakah Anda sudah siap untuk mengikuti survei ini?";
            const openingMessage: ChatMessage = {
              id: `opening_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              text: openingText,
              user: false,
              mode: 'survey',
              options: [],
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            };
            setMessages([openingMessage]);
            // Persist to DB
            addSurveyMessage({
              user_message: null,
              system_response: { system_message: openingText },
              mode: 'survey'
            }).catch((err) => console.error("Failed to persist opening message:", err));
          } else {
            setMessages(convertedMessages);
          }
        } else {
          setError(response.message || "Failed to load chat history");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error loading chat history"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadChatHistory();
  }, [userId, isLoaded]);

  // Save to localStorage if not loaded from DB (optional, can be removed if not needed)
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     savePreSurveyMessages(messages);
  //   }
  // }, [messages]);

  // Message management functions
  const addMessage = (messageInput: Partial<ChatMessage> & { text: string; user: boolean; mode: "survey" | "qa" }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: messageInput.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        text: messageInput.text,
        user: messageInput.user,
        mode: messageInput.mode,
        responseType: messageInput.responseType,
        questionCode: messageInput.questionCode,
        questionObject: messageInput.questionObject,
        timestamp: messageInput.timestamp || new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: messageInput.user ? true : messageInput.read,
        loading: messageInput.loading,
        options: messageInput.options || []
      },
    ]);

    // Persist the message to the database if this is a real (non-loading) message and has a valid system_response
    if (!messageInput.loading) {
      const payload: SurveyMessageRequest = {
        user_message: messageInput.user ? messageInput.text : null,
        system_response: messageInput.user ? {} : { system_message: messageInput.text },
        mode: messageInput.mode,
      };

      const openingText = "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi tentang profil wisatawan nusantara, maksud perjalanan, akomodasi yang digunakan, lama perjalanan, dan rata-rata pengeluaran terkait perjalanan yang dilakukan oleh penduduk Indonesia di dalam wilayah teritorial Indonesia.\n\nSebelum memulai, apakah Anda sudah siap untuk mengikuti survei ini?";

      const isOpeningMessage =
        payload.user_message === null &&
        payload.system_response &&
        typeof payload.system_response === 'object' &&
        'system_message' in payload.system_response &&
        payload.system_response.system_message === openingText;

      // Only save if:
      // - user_message is NOT null AND system_response exists and not empty
      // - OR user_message is null AND system_response.system_message is exactly the opening message
      if (
        (payload.user_message !== null && payload.system_response && Object.keys(payload.system_response).length > 0)
        || isOpeningMessage
      ) {
        addSurveyMessage(payload).catch((err) => console.error("Failed to persist message:", err));
      }
    }
  };

  const updateLastMessage = (text: string, isUser: boolean) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        // Find the last message from the specified sender (user or bot)
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex] && newMessages[lastIndex].user === isUser) {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            text,
            loading: false,
          };
        }
      }
      return newMessages;
    });
  };

  const refreshMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSurveyMessages();

      if (response.success && response.data) {
        // Using the shared convertApiMessagesToChatMessages function
        const convertedMessages = convertApiMessagesToChatMessages(
          response.data
        );
        setMessages(convertedMessages);
      } else {
        setError(response.message || "Failed to refresh chat history");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unknown error refreshing chat history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveChatSession = () => {};

  return {
    messages,
    addMessage,
    updateLastMessage,
    refreshMessages,
    setActiveChatSession,
    isLoaded,
    isLoading,
    error,
    userId,
    formatSurveyResponse,
  };
}