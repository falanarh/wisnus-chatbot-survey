// src/services/survey/accurateProgress.ts

import { surveyApiRequest } from "./surveyApiClient";
import { AccurateProgressResponse } from "./types";

/**
 * Gets accurate progress calculation for a survey session
 * 
 * This endpoint provides detailed progress information including:
 * - Basic progress percentage (answered_questions / total_questions)
 * - Accurate progress percentage (actually_answered_questions / total_applicable_questions)
 * - Question status breakdown with detailed information
 * - Survey metrics and response quality data
 *
 * @param sessionId - Survey session ID to calculate accurate progress for
 * @param signal - Optional AbortSignal for cancelling the request
 * @returns Detailed accurate progress calculation with the following structure:
 *   - session_id: string
 *   - status: "IN_PROGRESS" | "COMPLETED"
 *   - current_question_index: number
 *   - current_question?: Question object
 *   - total_questions: number (total questions in survey)
 *   - total_applicable_questions: number (questions that apply to this user)
 *   - answered_questions: number (questions with any response)
 *   - actually_answered_questions: number (questions with valid responses)
 *   - basic_progress_percentage: number (answered_questions / total_questions)
 *   - accurate_progress_percentage: number (actually_answered_questions / total_applicable_questions)
 *   - question_status: Array of detailed question status items
 *   - metrics: Survey completion metrics
 */
export async function getAccurateProgress(
  sessionId: string,
  signal?: AbortSignal
): Promise<AccurateProgressResponse> {
  try {
    const response = await surveyApiRequest(
      `/api/survey/accurate-progress/${sessionId}`,
      { method: "GET" },
      signal
    ) as AccurateProgressResponse;

    return response;
  } catch (error) {
    console.error("Error getting accurate progress:", error);
    return {
      success: false,
      message: "Failed to get accurate progress",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
} 