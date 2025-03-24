// src/services/survey/surveyMessages.ts
import { surveyApiRequest } from "./surveyApiClient";
import { SurveyMessagesResult } from "./types";

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
