import { Question, SurveyMessage, SurveyResponseData } from "@/services/survey";
import React from "react";

// Shared ChatMessage interface that both components will use
export interface ChatMessage {
  id: string; // Tambahkan ID unik untuk setiap pesan
  text: string | React.ReactNode;
  user: boolean;
  mode: "survey" | "qa";
  loading?: boolean;
  responseType?: string;
  questionCode?: string;
  questionObject?: Question;
  timestamp?: string;
  read?: boolean;
  options?: string[]; // Opsi yang ditampilkan untuk pesan ini
  customComponent?: 'SwitchedToSurveyMessage' | 'InfoWithQuestion' | 'QAMessage' | 'ExpectedAnswerMessage' | 'AutoInjectedQuestion' | 'UnexpectedAnswerMessage' | 'NotReadyForSurveyMessage' | 'SurveyStartedMessage' | 'WelcomeMessage';
  infoText?: string;
  infoSource?: string;
  questionText?: string;
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
    answer
  } = response;

  let responseText: string | React.ReactNode = "";
  let mode: "survey" | "qa" = "survey";
  let questionObject: Question | undefined = undefined;
  const questionCode = next_question?.code || currentQuestion?.code;

  // Determine the appropriate text based on info type
  if (info) {
    switch (info) {
      case "survey_completed":
        responseText = additional_info || "Survei telah selesai.";
        break;

      case "welcome":
        responseText = system_message || "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi tentang profil wisatawan nusantara, maksud perjalanan, akomodasi yang digunakan, lama perjalanan, dan rata-rata pengeluaran terkait perjalanan yang dilakukan oleh penduduk Indonesia di dalam wilayah teritorial Indonesia.\n\nSebelum memulai, apakah Anda sudah siap untuk mengikuti survei ini? Contoh: Saya sudah siap untuk mengikuti survei ini.";
        
        // Return custom component for welcome message
        return {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: responseText,
          user: false,
          mode: "survey",
          responseType: info,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          options: [],
          customComponent: 'WelcomeMessage'
        };

      case "expected_answer":
        if (!next_question) {
          responseText = "Pertanyaan berikutnya tidak tersedia.";
        } else {
          responseText = next_question.text || "Pertanyaan tidak ditemukan.";
          questionObject = next_question;
        }
        
        return {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: responseText,
          user: false,
          mode: "survey",
          responseType: info,
          questionCode: questionObject?.code,
          questionObject: questionObject,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          options: questionObject?.options || [],
          customComponent: 'ExpectedAnswerMessage'
        };

      case "unexpected_answer_or_other":
        if (!currentQuestion || !clarification_reason || !follow_up_question) {
          responseText = "Mohon berikan jawaban yang sesuai dengan pertanyaan.";
        } else {
          if (currentQuestion.code === "S003" || currentQuestion.code === "S005") {
            responseText = `${clarification_reason} ${follow_up_question}`;
          } else {
            responseText = `${clarification_reason} ${follow_up_question}`;
          }
          questionObject = currentQuestion;
        }
        
        // Return custom component for unexpected answer
        return {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: responseText,
          user: false,
          mode: "survey",
          responseType: info,
          questionCode: questionObject?.code,
          questionObject: questionObject,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          options: questionObject?.options || [],
          customComponent: 'UnexpectedAnswerMessage'
        };

      case "question":
        if (answer && currentQuestion) {
          console.log("RAW ANSWER:", answer); // Logging untuk debug
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          // Flexible regex: cari penjelasan, sumber (opsional), dan pertanyaan
          const match = answer.match(/^(.*?)(\(Sumber:.*?\))?\.?\s*(Terima kasih.*)?\n*Pertanyaan saat ini:?\n*([\s\S]*)$/i);
          if (match) {
            // match[1]: infoText, match[2]: infoSource, match[4]: questionText
            return {
              id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              text: `${match[1]?.trim() || ''}${match[4] ? '\n\n' + match[4]?.trim() : ''}`,
              user: false,
              mode: 'survey',
              responseType: info,
              questionCode: currentQuestion.code,
              questionObject: currentQuestion,
              timestamp,
              read: false,
              options: currentQuestion.options || [],
              customComponent: 'InfoWithQuestion',
              infoText: match[1]?.trim(),
              infoSource: match[2]?.trim(),
              questionText: match[4]?.trim(),
            };
          } else {
            // Fallback: split dengan 'Pertanyaan saat ini:' jika ada
            const splitIdx = answer.indexOf('Pertanyaan saat ini:');
            if (splitIdx !== -1) {
              const infoText = answer.slice(0, splitIdx).trim();
              const questionText = answer.slice(splitIdx + 'Pertanyaan saat ini:'.length).trim();
              return {
                id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                text: `${infoText}${questionText ? '\n\n' + questionText : ''}`,
                user: false,
                mode: 'survey',
                responseType: info,
                questionCode: currentQuestion.code,
                questionObject: currentQuestion,
                timestamp,
                read: false,
                options: currentQuestion.options || [],
                customComponent: 'InfoWithQuestion',
                infoText,
                questionText,
              };
            } else {
              // Jika hanya penjelasan saja, tetap tampilkan info box
              // Cek apakah ada sumber
              const infoMatch = answer.match(/^(.*?)(\(Sumber:.*?\))?\.?\s*(Terima kasih.*)?$/i);
              if (infoMatch) {
                return {
                  id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                  text: `${infoMatch[1]?.trim() || ''}${currentQuestion.text ? '\n\n' + currentQuestion.text : ''}`,
                  user: false,
                  mode: 'survey',
                  responseType: info,
                  questionCode: currentQuestion.code,
                  questionObject: currentQuestion,
                  timestamp,
                  read: false,
                  options: currentQuestion.options || [],
                  customComponent: 'InfoWithQuestion',
                  infoText: infoMatch[1]?.trim(),
                  infoSource: infoMatch[2]?.trim(),
                  questionText: currentQuestion.text,
                };
              }
            }
          }
          responseText =  `${answer} \n\nPertanyaan saat ini:\n\n${currentQuestion.text}` || system_message || "Silakan jawab pertanyaan saat ini.";
          questionObject = currentQuestion;
        } else if (currentQuestion && system_message) {
          // Handle auto-injected questions (from setModeAsync)
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            text: currentQuestion.text,
            user: false,
            mode: 'survey',
            responseType: 'auto_injected_question',
            questionCode: currentQuestion.code,
            questionObject: currentQuestion,
            timestamp,
            read: false,
            options: currentQuestion.options || [],
            customComponent: 'AutoInjectedQuestion',
            infoText: 'Melanjutkan pertanyaan terakhir. Jawablah pertanyaan berikut ini.',
            questionText: currentQuestion.text,
          };
        } else {
          responseText = system_message || "Silakan jawab pertanyaan saat ini.";
        }
        break;

      case "survey_started":
        responseText = additional_info || "Survei telah dimulai.";
        if (next_question) {
          responseText += `\n\n${next_question.text}`;
        }
        
        // Return custom component for survey started
        return {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: responseText,
          user: false,
          mode: "survey",
          responseType: info,
          questionCode: next_question?.code,
          questionObject: next_question,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          options: next_question?.options || [],
          customComponent: 'SurveyStartedMessage'
        };

      case "not_ready_for_survey":
        responseText =
          system_message ||
          "Sepertinya Anda belum siap untuk memulai survei. Silakan kirim pesan kapan saja jika Anda ingin memulai.";
        
        // Return custom component for not ready for survey
        return {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: responseText,
          user: false,
          mode: "survey",
          responseType: info,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          options: [],
          customComponent: 'NotReadyForSurveyMessage'
        };

      case "error":
        responseText =
          additional_info || "Terjadi kesalahan dalam memproses jawaban Anda.";
        break;

      case "switched_to_survey":
        responseText =
          "Anda telah beralih ke mode survei. Silakan jawab pertanyaan survei.";
        questionObject = currentQuestion;
        
        return {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          text: responseText,
          user: false,
          mode: "survey",
          responseType: info,
          questionCode: questionObject?.code,
          questionObject: questionObject,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          options: questionObject?.options || [],
          customComponent: 'SwitchedToSurveyMessage'
        };

      default:
        responseText = "Terjadi kesalahan jaringan. Pastikan jaringan internet Anda dapat berjalan dengan baik.";
    }
  } else if (response.answer) {
    // For QA-type responses
    responseText = response.answer;
    mode = "qa";
    
    // Extract source information from QA response
    const responseTextStr = typeof responseText === 'string' ? responseText : String(responseText);
    const sourceMatch = responseTextStr.match(/^(.*?)(\(Sumber:.*?\))?\.?\s*(Terima kasih.*)?$/i);
    if (sourceMatch) {
      const infoText = sourceMatch[1]?.trim();
      const infoSource = sourceMatch[2]?.trim();
      
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        text: responseText,
        user: false,
        mode: "qa",
        responseType: "qa_response",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
        options: [],
        customComponent: 'QAMessage',
        infoText: infoText,
        infoSource: infoSource
      };
    }
    
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text: responseText,
      user: false,
      mode: "qa",
      responseType: "qa_response",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
      options: [],
      customComponent: 'QAMessage'
    };
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
      console.log("systemResponse:", systemResponse);
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

/**
 * Splits message text into an array of sentences
 * @param text The text to split into sentences
 * @returns Array of sentences
 */
export function splitTextIntoSentences(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Remove extra whitespace and normalize line breaks
  const normalizedText = text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  if (!normalizedText) {
    return [];
  }

  // Split by sentence endings (., !, ?) followed by space or end of string
  // This regex handles various sentence endings including multiple punctuation marks
  const sentences = normalizedText
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);

  // If no sentences found with punctuation, split by line breaks or periods
  if (sentences.length === 0) {
    return normalizedText
      .split(/\n+|\./)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }

  return sentences;
}

/**
 * Splits message text into an array of words
 * @param text The text to split into words
 * @returns Array of words
 */
export function splitTextIntoWords(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Remove extra whitespace and normalize
  const normalizedText = text
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalizedText) {
    return [];
  }

  // Split by spaces and filter out empty strings
  return normalizedText
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 0);
}

/**
 * Splits message text into an array of characters
 * @param text The text to split into characters
 * @returns Array of characters
 */
export function splitTextIntoCharacters(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Split into individual characters, preserving spaces and punctuation
  return text.split('');
}

/**
 * Splits message text into chunks of specified size
 * @param text The text to split into chunks
 * @param chunkSize The size of each chunk
 * @returns Array of text chunks
 */
export function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  if (!text || typeof text !== 'string' || chunkSize <= 0) {
    return [];
  }

  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

/**
 * Gets the first sentence from a text
 * @param text The text to extract the first sentence from
 * @returns The first sentence or empty string
 */
export function getFirstSentence(text: string): string {
  const sentences = splitTextIntoSentences(text);
  return sentences.length > 0 ? sentences[0] : '';
}

/**
 * Gets the last sentence from a text
 * @param text The text to extract the last sentence from
 * @returns The last sentence or empty string
 */
export function getLastSentence(text: string): string {
  const sentences = splitTextIntoSentences(text);
  return sentences.length > 0 ? sentences[sentences.length - 1] : '';
}

/**
 * Counts the number of sentences in a text
 * @param text The text to count sentences in
 * @returns Number of sentences
 */
export function countSentences(text: string): number {
  return splitTextIntoSentences(text).length;
}

/**
 * Counts the number of words in a text
 * @param text The text to count words in
 * @returns Number of words
 */
export function countWords(text: string): number {
  return splitTextIntoWords(text).length;
}

/**
 * Counts the number of characters in a text (excluding spaces)
 * @param text The text to count characters in
 * @returns Number of characters
 */
export function countCharacters(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return text.replace(/\s/g, '').length;
}

/**
 * Truncates text to a specified number of sentences
 * @param text The text to truncate
 * @param maxSentences Maximum number of sentences to keep
 * @returns Truncated text
 */
export function truncateToSentences(text: string, maxSentences: number): string {
  const sentences = splitTextIntoSentences(text);
  if (sentences.length <= maxSentences) {
    return text;
  }
  return sentences.slice(0, maxSentences).join('. ') + '.';
}

/**
 * Truncates text to a specified number of words
 * @param text The text to truncate
 * @param maxWords Maximum number of words to keep
 * @returns Truncated text
 */
export function truncateToWords(text: string, maxWords: number): string {
  const words = splitTextIntoWords(text);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Extracts sentences containing specific keywords
 * @param text The text to search in
 * @param keywords Array of keywords to search for
 * @returns Array of sentences containing keywords
 */
export function extractSentencesWithKeywords(text: string, keywords: string[]): string[] {
  const sentences = splitTextIntoSentences(text);
  return sentences.filter(sentence => 
    keywords.some(keyword => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

/**
 * Formats text for display by adding line breaks between sentences
 * @param text The text to format
 * @returns Formatted text with line breaks
 */
export function formatTextWithLineBreaks(text: string): string {
  const sentences = splitTextIntoSentences(text);
  return sentences.join('\n\n');
}