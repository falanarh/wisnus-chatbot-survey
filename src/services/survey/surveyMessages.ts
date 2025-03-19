// src/services/survey/surveyMessages.ts
import { surveyApiRequest } from "./surveyApiClient";
import { ApiResponse, SurveyResponseData } from "./types";

/**
 * Survey messages response
 */
export type SurveyMessagesResponse = ApiResponse<SurveyMessage[]>;

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
): Promise<SurveyMessagesResponse> {
  try {
    const response = await surveyApiRequest<SurveyMessage[]>(
      `/api/survey/messages/${sessionId}`,
      { method: "GET" },
      signal
    );

    return response;
  } catch (error) {
    console.error("Error retrieving survey messages:", error);
    return {
      success: false,
      message: "Failed to retrieve survey messages",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
