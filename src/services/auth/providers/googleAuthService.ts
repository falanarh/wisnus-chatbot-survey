// src/services/auth/providers/googleAuthService.ts
import { authApiRequest } from "../authApiClient";
import { saveToken } from "../tokenStorage";
import { saveUserData } from "../userStorage";
import { LoginResponseData } from "../types";

/**
 * Authenticate with Google using ID token
 */
export async function authenticateWithGoogle(
  idToken: string
): Promise<LoginResponseData> {
  const response = await authApiRequest<LoginResponseData>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || "Google authentication failed");
  }

  const { token, ...userProps } = response.data;

  // Save auth data
  saveToken(token);
  saveUserData(userProps);

  return response.data;
}
