// src/hooks/useSurveyMessages.ts
import { useState, useEffect } from "react";
import { getSurveyMessages } from "@/services/survey";
import { getUserData } from "@/services/auth";
import {  
  ChatMessage,
  convertApiMessagesToChatMessages,
  formatSurveyResponse 
} from "@/utils/surveyMessageFormatters";

export function useSurveyMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load active session ID when component mounts
  useEffect(() => {
    const userData = getUserData();
    if (userData?._id) {
      setUserId(userData._id);
    }
    setIsLoaded(true);
  }, []);

  // Load chat history
  useEffect(() => {
    if (!isLoaded) return;

    async function loadChatHistory() {
      setIsLoading(true);
      setError(null);

      try {
        if (!userId)
          throw new Error("User ID not available to load chat history");

        const response = await getSurveyMessages(userId);

        if (response.success && response.data) {
          console.log("Loaded messages:", response.data);
          // Using the shared convertApiMessagesToChatMessages function
          const convertedMessages = convertApiMessagesToChatMessages(
            response.data
          );

          console.log("Converted messages:", convertedMessages);

          setMessages(convertedMessages);
        } else {
          setError(response.message || "Failed to load chat history");
          // Keep existing messages if there's an error
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
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getSurveyMessages(userId);

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

  const setActiveChatSession = (id: string) => {
    setUserId(id);
  };

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