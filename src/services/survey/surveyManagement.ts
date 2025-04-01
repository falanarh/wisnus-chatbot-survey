// src/services/survey/surveyManagement.ts
import { surveyApiRequest } from "./surveyApiClient";
import { SurveyResponseResult } from "./types";
import { updateUserProperty } from "../auth/userStorage";

/**
 * Direct submission to the new unified /api/survey/respond endpoint
 * Keeps the same interface for backward compatibility
 */
export async function submitResponse(
  sessionId: string,
  userResponse: string
): Promise<SurveyResponseResult> {
  try {
    const response = await surveyApiRequest(
      "/api/survey/respond",
      {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          user_response: userResponse,
        }),
      }
    ) as SurveyResponseResult;

    // If the response contains a session ID, save it to user data
    if (response.success && response.session_id) {
      updateUserProperty('activeSurveySessionId', response.session_id);
    }

    if (!response.success) {
      return {
        success: false,
        info: response.message || "Failed to submit response",
      };
    }

    return response;
  } catch (error) {
    console.error("Error submitting survey response:", error);
    return {
      success: false,
      info: "error",
      additional_info: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}