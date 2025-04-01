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
    // Correctly use SurveySessionStatus as the generic type parameter
    const response = await surveyApiRequest(
      `/api/survey/status/${sessionId}`,
      { method: "GET" },
      signal
    ) as SurveyStatusResponse;

    // Return the response directly
    return response;
  } catch (error) {
    console.error("Error getting survey status:", error);
    return {
      success: false,
      message: "Failed to get survey status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}