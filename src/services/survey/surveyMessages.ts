// src/services/survey/surveyMessages.ts
import { surveyApiRequest } from "./surveyApiClient";
import { SurveyMessagesResult, SurveyMessageRequest } from "./types";

/**
 * Retrieves all survey messages
 *
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns All messages
 */
export async function getSurveyMessages(
  signal?: AbortSignal
): Promise<SurveyMessagesResult> {
  try {
    const response = await surveyApiRequest(
      `/api/survey/messages`,
      { method: "GET" },
      signal
    ) as SurveyMessagesResult;

    return response;
  } catch (error) {
    console.error("Error retrieving survey messages:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Adds a new message to the survey system
 *
 * @param messageData - The message data including user_message, system_response, and mode
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns The created message or error information
 */
export async function addSurveyMessage(
  messageData: SurveyMessageRequest,
  signal?: AbortSignal
): Promise<SurveyMessagesResult> {
  try {
    // DEBUG: Log request yang akan dikirim ke API
    console.log("🔍 DEBUG - addSurveyMessage dipanggil dengan data:", messageData);
    
    const response = await surveyApiRequest(
      "/api/survey/messages",
      {
        method: "POST",
        body: JSON.stringify(messageData),
        headers: {
          "Content-Type": "application/json",
        },
      },
      signal
    ) as SurveyMessagesResult;

    // DEBUG: Log response dari API
    console.log("🔍 DEBUG - Response dari /api/survey/messages:", response);

    return response;
  } catch (error) {
    console.error("Error adding survey message:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
