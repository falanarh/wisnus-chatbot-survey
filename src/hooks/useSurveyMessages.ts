// src/hooks/useSurveyMessages.ts
import { useState, useEffect } from "react";
import { getSurveyMessages } from "@/services/survey";
import { getUserData } from "@/services/auth";
import {
  ChatMessage,
  convertApiMessagesToChatMessages,
  formatSurveyResponse,
} from "@/utils/surveyMessageFormatters";
import { addSurveyMessage } from "@/services/survey/surveyMessages";
import { SurveyMessageRequest, SurveyResponseData } from "@/services/survey/types";
import { v4 as uuidv4 } from 'uuid';

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
            const openingText = "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi tentang profil wisatawan nusantara, maksud perjalanan, akomodasi yang digunakan, lama perjalanan, dan rata-rata pengeluaran terkait perjalanan yang dilakukan oleh penduduk Indonesia di dalam wilayah teritorial Indonesia.\n\nSebelum memulai, apakah Anda sudah siap untuk mengikuti survei ini? Contoh: Saya sudah siap untuk mengikuti survei ini.";
            
            // Use formatSurveyResponse to get proper custom component formatting
            const systemResponse = {
              info: 'welcome',
              system_message: openingText
            };
            
            const openingMessage = formatSurveyResponse(systemResponse);
            setMessages([openingMessage]);
            
            // Persist to DB
            addSurveyMessage({
              user_message: null,
              system_response: systemResponse,
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
  const updateLastMessage = (text: string, user: boolean, customProps?: Partial<ChatMessage>) => {
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        return [{ 
          id: uuidv4(), 
          text, 
          user, 
          mode: 'survey', 
          read: !user, 
          options: [],
          ...customProps
        }];
      }
      const newMessages = [...prevMessages];
      if (newMessages.length > 0) {
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex] && newMessages[lastIndex].user === user) {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            text,
            loading: false,
            ...customProps
          };
        }
      }
      return newMessages;
    });
  };

  const addMessage = (message: Partial<ChatMessage> & { text: string; user: boolean; mode: 'survey' | 'qa' }) => {
    const newMessage: ChatMessage = {
      id: message.id || uuidv4(),
      text: message.text,
      user: message.user,
      mode: message.mode,
      responseType: message.responseType,
      questionCode: message.questionCode,
      questionObject: message.questionObject,
      timestamp: message.timestamp || new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: message.user ? true : message.read,
      loading: message.loading,
      options: message.options || []
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    // Don't persist to database automatically - let the calling code handle it
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

  const addSystemMessage = (systemResponse: SurveyResponseData, mode: 'survey' | 'qa' = 'survey') => {
    const payload: SurveyMessageRequest = {
      user_message: null,
      system_response: systemResponse,
      mode: mode,
    };

    return addSurveyMessage(payload)
      .catch(err => console.error("Gagal menyimpan pesan sistem ke database:", err));
  };

  const addUserAndSystemMessage = (userMessage: string, systemResponse: SurveyResponseData, mode: 'survey' | 'qa' = 'survey') => {
    const payload: SurveyMessageRequest = {
      user_message: userMessage,
      system_response: systemResponse,
      mode: mode,
    };

    // DEBUG: Log payload yang akan dikirim ke API
    console.log("🔍 DEBUG - addUserAndSystemMessage dipanggil dengan payload:", payload);

    return addSurveyMessage(payload)
      .then(result => {
        // DEBUG: Log hasil dari addSurveyMessage
        console.log("🔍 DEBUG - Hasil addSurveyMessage:", result);
        return result;
      })
      .catch(err => {
        console.error("Gagal menyimpan pesan user dan sistem ke database:", err);
        throw err;
      });
  };

  const setActiveChatSession = () => {};

  return {
    messages,
    addMessage,
    updateLastMessage,
    addSystemMessage,
    addUserAndSystemMessage,
    refreshMessages,
    setActiveChatSession,
    isLoaded,
    isLoading,
    error,
    userId,
    setMessages,
  };
}