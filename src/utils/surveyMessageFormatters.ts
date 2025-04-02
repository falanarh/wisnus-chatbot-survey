import { Question, SurveyMessage, SurveyResponseData } from "@/services/survey";

// Shared ChatMessage interface that both components will use
export interface ChatMessage {
  id: string; // Tambahkan ID unik untuk setiap pesan
  text: string;
  user: boolean;
  mode: "survey" | "qa";
  loading?: boolean;
  responseType?: string;
  questionCode?: string;
  questionObject?: Question;
  timestamp?: string;
  read?: boolean;
  options?: string[]; // Opsi yang ditampilkan untuk pesan ini
}

/**
 * Formats a single survey response into a ChatMessage
 * @param response The survey response data to format
 * @returns Formatted chat message
 */
export function formatSurveyResponse(
  response: SurveyResponseData
): ChatMessage {
  // Extract all possible fields from response
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
  let questionObject: Question | undefined = undefined;
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
          responseText = next_question.text || "Pertanyaan tidak ditemukan.";
          questionObject = next_question;
        }
        break;

      case "unexpected_answer_or_other":
        if (!currentQuestion || !clarification_reason || !follow_up_question) {
          responseText = "Mohon berikan jawaban yang sesuai dengan pertanyaan.";
        } else {
          if (currentQuestion.code === "S003" || currentQuestion.code === "S005") {
            responseText = clarification_reason;
          } else {
            responseText = `${clarification_reason} ${follow_up_question}`;
          }
          questionObject = currentQuestion;
        }
        break;

      case "question":
        if (!currentQuestion || !answer) {
          responseText = "Silakan jawab pertanyaan saat ini.";
        } else {
          responseText = `${answer} \n\nPertanyaan saat ini: ${currentQuestion.text}`;
          questionObject = currentQuestion;
        }
        break;

      case "survey_started":
        responseText = additional_info || "Survei telah dimulai.";
        if (next_question) {
          responseText += `\n\n${next_question.text}`;
        }
        break;

      case "not_ready_for_survey":
        responseText =
          system_message ||
          "Sepertinya Anda belum siap untuk memulai survei. Silakan kirim pesan kapan saja jika Anda ingin memulai.";
        break;

      case "error":
        responseText =
          additional_info || "Terjadi kesalahan dalam memproses jawaban Anda.";
        break;

      case "switched_to_survey":
        responseText =
          "Anda telah beralih ke mode survei. Silakan jawab pertanyaan survei.\n\nPertanyaan saat ini:\n\n" +
          (currentQuestion?.text || "Pertanyaan tidak ditemukan.");
        questionObject = currentQuestion;
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

  // Create timestamp for the current time
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Generate ID unik
    text: responseText,
    user: false,
    mode: mode,
    responseType: info,
    questionCode,
    questionObject: questionObject,
    timestamp,
    read: false,
    options: questionObject?.options || [] // Tambahkan options dari questionObject jika ada
  };
}

/**
 * Converts API messages to chat messages
 * @param apiMessages The API messages to convert
 * @returns Array of formatted chat messages
 */
export function convertApiMessagesToChatMessages(
  apiMessages: SurveyMessage[]
): ChatMessage[] {
  const chatMessages: ChatMessage[] = [];

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

    // Add user message with ID
    chatMessages.push({
      id: `user_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Generate ID unik untuk pesan user
      text: apiMessage.user_message,
      user: true,
      mode: apiMessage.mode,
      timestamp,
      read: true, // User messages are always read
      options: [] // Empty options for user messages
    });

    // Add system response based on its structure
    const systemResponse = formatSurveyResponse(apiMessage.system_response);

    // Preserve the timestamp from the API
    systemResponse.timestamp = timestamp;

    chatMessages.push(systemResponse);
  });

  return chatMessages;
}