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
        if (currentQuestion) {
          responseText = currentQuestion.text || system_message || "Silakan jawab pertanyaan saat ini.";
          questionObject = currentQuestion;
        } else {
          responseText = system_message || "Silakan jawab pertanyaan saat ini.";
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
      system_message || additional_info || "System response (could not be displayed)";
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
  // Temporary extended interface for sorting purposes
  interface ExtendedChatMessage extends ChatMessage {
    __sortTime: number;
  }

  const chatMessages: ExtendedChatMessage[] = [];

  apiMessages.forEach((apiMessage) => {
    // Format the timestamp from API or create a new one
    const rawTimestamp = apiMessage.timestamp || new Date().toISOString();
    const timestamp = new Date(rawTimestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

    const numericTime = new Date(rawTimestamp).getTime();

    // Hanya tambahkan pesan user jika user_message ada isinya
    if (apiMessage.user_message && apiMessage.user_message.trim() !== "") {
      chatMessages.push({
        id: `user_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        text: apiMessage.user_message,
        user: true,
        mode: apiMessage.mode,
        timestamp,
        read: true,
        options: [],
        __sortTime: numericTime,
      });
    }

    // Hanya tambahkan pesan sistem jika system_response ada isinya (bukan null/undefined/empty object)
    if (apiMessage.system_response && Object.keys(apiMessage.system_response).length > 0) {
      const systemResponse = formatSurveyResponse(apiMessage.system_response) as ChatMessage;
      systemResponse.timestamp = timestamp;
      chatMessages.push({
        ...systemResponse,
        __sortTime: numericTime,
      });
    }
  });

  // Sort messages by their original timestamp to maintain chronological order
  chatMessages.sort((a, b) => a.__sortTime - b.__sortTime);

  // Remove the temporary __sortTime property before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return chatMessages.map(({ __sortTime, ...rest }) => rest);
}