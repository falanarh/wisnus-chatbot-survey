// src/services/survey/surveyStatus.ts
import { surveyApiRequest } from "./surveyApiClient";
import { SurveyStatusResponse } from "./types";

/**
 * Gets the current status of a survey session
 *
 * @param sessionId - Survey session ID to check status for
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Detailed survey session status
 */
export async function getSurveyStatus(
  sessionId: string,
  signal?: AbortSignal
): Promise<SurveyStatusResponse> {
  try {
    const response = await surveyApiRequest<SurveyStatusResponse>(
      `/api/survey/status/${sessionId}`,
      { method: "GET" },
      signal
    );

    return response.data!;
  } catch (error) {
    console.error("Error getting survey status:", error);
    return {
      success: false,
      message: "Failed to get survey status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
