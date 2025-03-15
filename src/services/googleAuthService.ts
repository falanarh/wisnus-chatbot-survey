// src/services/googleAuthService.ts
import { apiRequest } from '@/utils/authConfig';
import { LoginResponseData, saveToken } from './authService';

/**
 * Authenticate user with Google by sending the idToken to our backend
 * @param idToken The ID token obtained from Google Auth
 */
export async function authenticateWithGoogle(idToken: string): Promise<LoginResponseData> {
  try {
    const result = await apiRequest('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });

    // Check if the request was successful
    if (!result.success) {
      const errorMessage = result.message || 'Google authentication failed';
      throw new Error(errorMessage);
    }

    // Ensure data is available
    if (!result.data) {
      throw new Error('No data returned from server');
    }

    const loginData = result.data;
    
    // Save token to cookies and localStorage
    saveAuthData(loginData);

    return loginData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Google authentication error:", error.message);
      throw error;
    }
    console.error("Google authentication error:", error);
    throw new Error("Google authentication failed");
  }
}

/**
 * Save authentication data to storage
 */
function saveAuthData(loginData: LoginResponseData): void {
  // Save token
  saveToken(loginData.token);
  
  // Save user data in localStorage
  localStorage.setItem('user_data', JSON.stringify({
    _id: loginData._id,
    name: loginData.name,
    email: loginData.email,
    activeSurveySessionId: loginData.activeSurveySessionId
  }));
}