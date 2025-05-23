// src/services/survey/surveyMessages.ts
import { surveyApiRequest } from "./surveyApiClient";
import { SurveyMessagesResult, SurveyMessageRequest } from "./types";

/**
 * Retrieves all messages exchanged during a specific survey session
 *
 * @param sessionId - The ID of the survey session to retrieve messages for
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns All messages in the specified survey session
 */
export async function getSurveyMessages(
  sessionId: string,
  signal?: AbortSignal
): Promise<SurveyMessagesResult> {
  try {
    const response = await surveyApiRequest(
      `/api/survey/messages/${sessionId}`,
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
 * @param messageData - The message data including user_message, system_response, and optional session_id and mode
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns The created message or error information
 */
export async function addSurveyMessage(
  messageData: SurveyMessageRequest,
  signal?: AbortSignal
): Promise<SurveyMessagesResult> {
  try {
    const response = await surveyApiRequest(
      "/api/survey/messages",
      { 
        method: "POST",
        body: JSON.stringify(messageData),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      signal
    ) as SurveyMessagesResult;

    return response;
  } catch (error) {
    console.error("Error adding survey message:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}