// src/services/survey/surveyManagement.ts
import { surveyApiRequest } from "./surveyApiClient";
import { SurveyResponseResult } from "./types";

/**
 * Direct submission to the new unified /api/survey/respond endpoint
 * Keeps the same interface for backward compatibility
 */
export async function submitResponse(
  userResponse: string
): Promise<SurveyResponseResult> {
  try {
    const response = await surveyApiRequest(
      "/api/survey/respond",
      {
        method: "POST",
        body: JSON.stringify({
          user_response: userResponse,
        }),
      }
    ) as SurveyResponseResult;

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