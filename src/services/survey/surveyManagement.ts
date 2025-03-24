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

    console.log("Survey response submitted:", response);

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

    console.log("Survey response submitted:", response);

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

/**
 * Starts a new survey or continues existing one by sending a message to the respond endpoint
 * Maintains backward compatibility with the previous API interface
 */
// export async function startSurvey(): Promise<SurveyStartResponse> {
//   try {
//     // Use the unified respond endpoint with a start survey intent
//     const response = await surveyApiRequest<SurveyResponseResult>(
//       "/api/survey/respond",
//       { 
//         method: "POST",
//         body: JSON.stringify({
//           user_response: "Saya ingin mulai survei" // Generic start message
//         })
//       }
//     );

//     // If response is not successful or data is undefined, return a default error response
//     if (!response.success || !response.data) {
//       return {
//         success: false,
//         message: response.message || "Failed to start survey",
//         additional_info: "No survey data returned",
//         session_id: "",
//       };
//     }

//     // If the response contains a session ID, save it to user data
//     if (response.data.session_id) {
//       updateUserProperty('activeSurveySessionId', response.data.session_id);
//     }

//     // Map the response to match the expected SurveyStartResponse format
//     return {
//       success: true,
//       message: "Survey started",
//       additional_info: response.data.additional_info || "Survei telah dimulai",
//       next_question: response.data.next_question,
//       session_id: response.data.session_id || "",
//       current_question_index: 0 // We don't get this from new API, default to 0
//     };
//   } catch (error) {
//     console.error("Error starting survey:", error);
//     return {
//       success: false,
//       message: "Failed to start survey",
//       additional_info: error instanceof Error ? error.message : "Unknown error occurred",
//       session_id: "",
//     };
//   }
// }