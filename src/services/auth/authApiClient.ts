// src/services/auth/authApiClient.ts
import { getToken } from "./tokenStorage";
import { ApiResponse } from "./types";

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * Makes authenticated requests to the API
 */
export async function authApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getToken();

    // Prepare headers
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    } as Record<string, string>;

    // Add authorization if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Make the request
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
