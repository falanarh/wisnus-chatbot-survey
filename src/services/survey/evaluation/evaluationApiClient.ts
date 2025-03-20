// src/services/evaluation/evaluationApiClient.ts

import { getToken } from "@/services/auth";
import { ApiResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Makes authenticated requests to evaluation API endpoints
 */
export async function evaluationApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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
    console.error("Evaluation API request error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
