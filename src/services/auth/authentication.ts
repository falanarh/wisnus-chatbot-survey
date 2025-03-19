// src/services/auth/authentication.ts
import { authApiRequest } from "./authApiClient";
import { saveToken, removeToken, hasToken } from "./tokenStorage";
import { saveUserData, removeUserData } from "./userStorage";
import {
  LoginRequestData,
  RegisterRequestData,
  LoginResponseData,
} from "./types";

/**
 * Registers a new user
 */
export async function register(
  userData: RegisterRequestData
): Promise<LoginResponseData> {
  const response = await authApiRequest<LoginResponseData>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Registration failed");
  }

  const { token, ...userProps } = response.data;

  // Save auth data
  saveToken(token);
  saveUserData(userProps);

  return response.data;
}

/**
 * Logs in an existing user
 */
export async function login(
  credentials: LoginRequestData
): Promise<LoginResponseData> {
  const response = await authApiRequest<LoginResponseData>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || "Login failed");
  }

  const { token, ...userProps } = response.data;

  // Save auth data
  saveToken(token);
  saveUserData(userProps);

  return response.data;
}

/**
 * Logs out the current user
 */
export function logout(): void {
  removeToken();
  removeUserData();
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
  return hasToken();
}
