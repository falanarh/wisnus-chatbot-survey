// src/hooks/useSurveyMessages.ts
import { useState, useEffect, useCallback } from "react";
import { getSurveyMessages, Question, SurveyMessage } from "@/services/survey";
import { getUserData } from "@/services/auth";
import { generateUnorderedList } from "@/utils/otherUtils";

// Tipe untuk pesan chat
export interface ChatMessage {
  text: string;
  user: boolean;
  mode: "survey" | "qa";
  loading?: boolean;
}

export function useSurveyMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load active session ID when component mounts
  useEffect(() => {
    const userData = getUserData();
    if (userData?.activeSurveySessionId) {
      setSessionId(userData.activeSurveySessionId);
    }
    setIsLoaded(true);
  }, []);

  // Function to convert API messages to chat messages
  const convertApiMessagesToChatMessages = useCallback(
    (apiMessages: SurveyMessage[]): ChatMessage[] => {
      const chatMessages: ChatMessage[] = [];

      // Helper function to format a question
      const formatQuestion = (question: Question): string => {
        if (question.code === "KR004" && question.options?.length) {
          return `${
            question.text
          }\n\nPilih salah satu opsi di bawah ini: ${generateUnorderedList(
            question.options,
            "◆"
          )}`;
        }
        return question.text;
      };

      apiMessages.forEach((apiMessage) => {
        // Add user message
        chatMessages.push({
          text: apiMessage.user_message,
          user: true,
          mode: "survey",
        });

        // Add system response based on its structure
        const response = apiMessage.system_response;
        const {
          info,
          additional_info,
          next_question,
          currentQuestion,
          clarification_reason,
          follow_up_question,
          answer,
        } = response;

        let responseText = "";
        let mode: "survey" | "qa" = "survey";

        // Determine the appropriate text based on info type
        if (info) {
          switch (info) {
            case "survey_completed":
              responseText = additional_info || "Survei telah selesai.";
              break;

            case "expected_answer":
              if (!next_question) {
                responseText = "Pertanyaan berikutnya tidak tersedia.";
              } else {
                responseText = formatQuestion(next_question);
              }
              break;

            case "unexpected_answer_or_other":
              if (
                !currentQuestion ||
                !clarification_reason ||
                !follow_up_question
              ) {
                responseText =
                  "Mohon berikan jawaban yang sesuai dengan pertanyaan.";
              } else {
                responseText = `${clarification_reason} ${follow_up_question} ${
                  currentQuestion.code === "KR004"
                    ? `\n\nPilih salah satu opsi di bawah ini: ${generateUnorderedList(
                        currentQuestion.options || [],
                        "◆"
                      )}`
                    : ""
                }`;
              }
              break;

            case "question":
              if (!currentQuestion || !answer) {
                responseText = "Silakan jawab pertanyaan saat ini.";
              } else {
                responseText = `${answer} \n\nPertanyaan saat ini: ${formatQuestion(
                  currentQuestion
                )}`;
              }
              break;

            case "error":
              responseText =
                additional_info ||
                "Terjadi kesalahan dalam memproses jawaban Anda.";
              break;

            default:
              responseText = "Silakan lanjutkan menjawab pertanyaan survei.";
          }
        } else if (response.answer) {
          // For QA-type responses
          responseText = response.answer;
          mode = "qa";
        } else {
          // Fallback if no recognizable format
          responseText =
            additional_info || "System response (could not be displayed)";
        }

        chatMessages.push({
          text: responseText,
          user: false,
          mode: mode,
        });
      });

      return chatMessages;
    },
    []
  );

  // Load chat history from API
  useEffect(() => {
    if (!sessionId || !isLoaded) return;

    async function loadChatHistory() {
      setIsLoading(true);
      setError(null);

      try {
        if (!sessionId)
          throw new Error("No session ID provided for fetching messages");
        
        const response = await getSurveyMessages(sessionId);

        if (response.success && response.data) {
          const convertedMessages = convertApiMessagesToChatMessages(
            response.data
          );
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
  }, [sessionId, isLoaded, convertApiMessagesToChatMessages]);

  // Add new message to local state (will be sent to API by parent component)
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  // Update the last message (for loading states)
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

  // Refresh messages from the API
  const refreshMessages = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getSurveyMessages(sessionId);

      if (response.success && response.data) {
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

  // Set the active session ID
  const setActiveChatSession = (id: string) => {
    setSessionId(id);
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
    sessionId,
  };
}
