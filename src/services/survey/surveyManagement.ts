// src/services/survey/surveyManagement.ts
import { surveyApiRequest } from "./surveyApiClient";
import { updateUserProperty } from "../auth/userStorage";
import { SurveyStartResponse, SurveyResponseResult } from "./types";

/**
 * Starts a new survey session or resumes an existing one
 *
 * @returns Survey start information with session ID and first question
 */
export async function startSurvey(): Promise<SurveyStartResponse> {
  try {
    const response = await surveyApiRequest<SurveyStartResponse>(
      "/api/survey/start",
      { method: "POST" }
    );

    if (response.success && response.data && response.data.session_id) {
      // Update active session ID in user data
      updateUserProperty("activeSurveySessionId", response.data.session_id);
    }

    return response.data!;
  } catch (error) {
    console.error("Error starting survey:", error);
    return {
      success: false,
      message: "Failed to start survey",
      additional_info: error instanceof Error ? error.message : "Unknown error",
      session_id: "",
    };
  }
}

/**
 * Submits a response to the current survey question
 *
 * @param sessionId - Active survey session ID
 * @param userResponse - User's response to the current question
 * @returns Response processing result with next question if available
 */
export async function submitResponse(
  sessionId: string,
  userResponse: string
): Promise<SurveyResponseResult> {
  try {
    const response = await surveyApiRequest<SurveyResponseResult>(
      "/api/survey/respond",
      {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          user_response: userResponse,
        }),
      }
    );

    return response.data!;
  } catch (error) {
    console.error("Error submitting survey response:", error);
    return {
      success: false,
      info: "",
      message: "Failed to submit survey response",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
