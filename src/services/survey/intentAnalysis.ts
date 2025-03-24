// src/services/survey/intentAnalysis.ts
import { surveyApiRequest } from "./surveyApiClient";
import { IntentAnalysisResponse, IntentAnalysisResult } from "./types";

/**
 * Analyzes user message to determine if they want to start a survey
 *
 * @param message - User message to analyze
 * @returns Analysis result indicating if user wants to start the survey
 */
export async function analyzeIntent(
  message: string
): Promise<IntentAnalysisResponse> {
  try {
    const response = await surveyApiRequest<IntentAnalysisResult>(
      "/api/survey/analyze-intent",
      {
        method: "POST",
        body: JSON.stringify({ message }),
      }
    );
    return response;
  } catch (error) {
    console.error("Error analyzing intent:", error);
    return {
      success: false,
      message: "Failed to analyze intent",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
