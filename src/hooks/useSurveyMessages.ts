// src/hooks/useSurveyMessages.ts - Update to match the new API
import { useState, useEffect, useCallback } from "react";
import { getSurveyMessages, Question, SurveyMessage } from "@/services/survey";
import { getUserData } from "@/services/auth";
import { generateUnorderedList } from "@/utils/otherUtils";

// Chat message type (keeping the same interface but adding support for new fields)
export interface ChatMessage {
  text: string;
  user: boolean;
  mode: "survey" | "qa";
  loading?: boolean;
  responseType?: string;
  questionCode?: string;
  timestamp?: string; // Add timestamp field
  read?: boolean; // Add read status for double check marks
}

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

  // Convert API messages to chat messages - updated for new response format
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
        // Format the timestamp from API or create a new one
        const timestamp = apiMessage.timestamp
          ? new Date(apiMessage.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

        // Add user message
        chatMessages.push({
          text: apiMessage.user_message,
          user: true,
          mode: "survey",
          timestamp,
          read: true, // User messages are always read
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
          system_message,
        } = response;

        let responseText = "";
        let mode: "survey" | "qa" = "survey";
        const questionCode = next_question?.code || currentQuestion?.code;

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

            case "survey_started":
              responseText = additional_info || "Survei telah dimulai.";
              if (next_question) {
                responseText += `\n\n${formatQuestion(next_question)}`;
              }
              break;

            case "not_ready_for_survey":
              responseText =
                system_message ||
                "Sepertinya Anda belum siap untuk memulai survei. Silakan kirim pesan kapan saja jika Anda ingin memulai.";
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
          responseType: info,
          questionCode,
          timestamp,
          read: false, // System messages start as unread
        });
      });

      return chatMessages;
    },
    []
  );

  // Load chat history - unchanged
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
  }, [userId, isLoaded, convertApiMessagesToChatMessages]);

  // Message management functions remain unchanged to maintain UI compatibility
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        timestamp:
          message.timestamp ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        read: message.user ? true : message.read, // Mark user messages as read by default
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
  };
}
