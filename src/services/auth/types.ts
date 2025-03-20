// src/services/auth/types.ts

/**
 * API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Authentication token data
 */
export interface AuthToken {
  token: string;
  expiresAt?: number;
}

/**
 * User information returned after login/register
 */
export interface UserData {
  _id: string;
  name: string;
  email: string;
  activeSurveySessionId?: string;
  activeEvaluationSessionId?: string;
}

/**
 * Full login response data
 */
export interface LoginResponseData extends UserData {
  token: string;
}

/**
 * Registration request data
 */
export interface RegisterRequestData {
  name: string;
  email: string;
  password: string;
}

/**
 * Login request data
 */
export interface LoginRequestData {
  email: string;
  password: string;
}
