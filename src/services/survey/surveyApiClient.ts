// src/services/survey/surveyApiClient.ts
import { getToken } from "../auth/tokenStorage";
import { CurrentQuestionResponseResult, SurveyMessagesResult, SurveyResponseResult, SurveyStatusResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const RAG_API_URL = process.env.NEXT_PUBLIC_RAG_API_URL || "";

/**
 * Makes authenticated requests to survey API endpoints
 */
export async function surveyApiRequest(
  endpoint: string,
  options: RequestInit = {},
  signal?: AbortSignal
): Promise<SurveyResponseResult | SurveyStatusResponse | SurveyMessagesResult | CurrentQuestionResponseResult> {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
      signal,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    // Don't report AbortError as it's expected when components unmount
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("Survey API request error:", error);
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Makes requests to RAG API endpoints (no auth required)
 */
export async function ragApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    const url = `${RAG_API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("RAG API request error:", error);
    throw error;
  }
}
